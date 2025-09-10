import { renderingEngineId, viewportId } from "@/types/viewer/constant";
import { getRenderingEngine } from "@cornerstonejs/core";
import { VOILUTFunctionType } from "@cornerstonejs/core/enums";
import { PixelDataTypedArray } from "@cornerstonejs/core/types";
import dicomParser from "dicom-parser";

export function convertToImage(
  instanceUuid: string,
  data: ArrayBuffer,
): Record<string, unknown> {
  const byteArray = new Uint8Array(data);

  // DICOM 파싱
  const dataSet = dicomParser.parseDicom(byteArray);

  // 픽셀 데이터 추출
  const pixelDataElement = dataSet.elements.x7fe00010;
  if (!pixelDataElement) {
    throw new Error("픽셀 데이터를 찾을 수 없습니다.");
  }

  // DICOM 메타데이터 추출
  const width = dataSet.uint16("x00280011") || 512; // Columns
  const height = dataSet.uint16("x00280010") || 512; // Rows
  const bitsAllocated = dataSet.uint16("x00280100") || 16;
  const bitsStored = dataSet.uint16("x00280101") || 16;
  const samplesPerPixel = dataSet.uint16("x00280002") || 1;
  const photometricInterpretation =
    dataSet.string("x00280004") || "MONOCHROME2";
  const pixelRepresentation = dataSet.uint16("x00280103") || 0;

  // 픽셀 데이터를 올바른 타입으로 추출
  let pixelData: PixelDataTypedArray;
  if (bitsAllocated === 8) {
    pixelData = new Uint8Array(
      dataSet.byteArray.buffer,
      pixelDataElement.dataOffset,
      pixelDataElement.length,
    ) as PixelDataTypedArray;
  } else if (bitsAllocated === 16) {
    pixelData = new Uint16Array(
      dataSet.byteArray.buffer,
      pixelDataElement.dataOffset,
      pixelDataElement.length / 2,
    ) as PixelDataTypedArray;
  } else {
    throw new Error(`지원되지 않는 BitsAllocated: ${bitsAllocated}`);
  }

  const intercept = dataSet.floatString("x00281052") || 0;
  const slope = dataSet.floatString("x00281053") || 1;
  const windowCenter =
    dataSet.floatString("x00281050") || (bitsAllocated === 8 ? 128 : 512);
  const windowWidth =
    dataSet.floatString("x00281051") || (bitsAllocated === 8 ? 256 : 1024);
  const pixelSpacing = dataSet.string("x00280030")?.split("\\").map(Number) || [
    1, 1,
  ];

  // min/max 픽셀 값 계산
  let minPixelValue = Number.MAX_VALUE;
  let maxPixelValue = Number.MIN_VALUE;
  for (let i = 0; i < pixelData.length; i++) {
    if (pixelData[i] < minPixelValue) minPixelValue = pixelData[i];
    if (pixelData[i] > maxPixelValue) maxPixelValue = pixelData[i];
  }

  // 팔레트 컬러 룩업 테이블 정보 추출 (있는 경우에만)
  const redDescriptor =
    dataSet.string("x00281101")?.split("\\").map(Number) || ([] as number[]);
  const greenDescriptor =
    dataSet.string("x00281102")?.split("\\").map(Number) || ([] as number[]);
  const blueDescriptor =
    dataSet.string("x00281103")?.split("\\").map(Number) || ([] as number[]);

  // 팔레트 데이터 추출 (있는 경우)
  const redPaletteData = dataSet.elements.x00281201
    ? Array.from(
        new Uint16Array(
          dataSet.byteArray.buffer,
          dataSet.elements.x00281201.dataOffset,
          dataSet.elements.x00281201.length / 2,
        ),
      )
    : ([] as number[]);
  const greenPaletteData = dataSet.elements.x00281202
    ? Array.from(
        new Uint16Array(
          dataSet.byteArray.buffer,
          dataSet.elements.x00281202.dataOffset,
          dataSet.elements.x00281202.length / 2,
        ),
      )
    : ([] as number[]);
  const bluePaletteData = dataSet.elements.x00281203
    ? Array.from(
        new Uint16Array(
          dataSet.byteArray.buffer,
          dataSet.elements.x00281203.dataOffset,
          dataSet.elements.x00281203.length / 2,
        ),
      )
    : ([] as number[]);

  // 색상 이미지 여부 판단
  const isColor =
    samplesPerPixel > 1 ||
    photometricInterpretation === "RGB" ||
    photometricInterpretation === "YBR_FULL" ||
    photometricInterpretation === "PALETTE COLOR";
  // Record<string, unknown> 형태로 반환 (IImage와 호환되는 구조)
  const image: Record<string, unknown> = {
    // 기본 식별자
    imageId: instanceUuid,

    // 픽셀 값 범위
    minPixelValue,
    maxPixelValue,

    // 스케일링
    slope,
    intercept,

    // 윈도우/레벨
    windowCenter,
    windowWidth,
    voiLUTFunction: VOILUTFunctionType.LINEAR,

    // 픽셀 데이터 접근 함수
    getPixelData: () => pixelData,
    getCanvas: () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    },

    // 이미지 차원
    rows: height,
    columns: width,
    height,
    width,

    // 색상 속성
    color: isColor,
    rgba: false, // RGB이지만 Alpha 채널은 없음
    numberOfComponents: samplesPerPixel,

    // 픽셀 간격
    columnPixelSpacing: pixelSpacing[1] || 1.0,
    rowPixelSpacing: pixelSpacing[0] || 1.0,

    // 표시 속성
    invert: false,
    photometricInterpretation,

    // 메모리 정보
    sizeInBytes: pixelData.byteLength,
    dataType: bitsAllocated === 8 ? "Uint8Array" : "Uint16Array",

    // 성능 메트릭
    loadTimeInMS: performance.now(),
    decodeTimeInMS: 0,

    // 버퍼 뷰 (Cornerstone3D 중요 속성)
    bufferView: {
      buffer: pixelData.buffer,
      offset: pixelData.byteOffset,
    },

    // 추가 선택적 속성들
    sliceThickness: dataSet.floatString("x00180050"),
    FrameOfReferenceUID: dataSet.string("x00200052"),

    // 통계 정보
    stats: {
      lastGetPixelDataTime: 0,
      lastStoredPixelDataToCanvasImageDataTime: 0,
      lastPutImageDataTime: 0,
      lastLutGenerateTime: 0,
      lastRenderTime: 0,
    },

    // 이미지 프레임 정보
    imageFrame: {
      samplesPerPixel,
      photometricInterpretation,
      planarConfiguration: dataSet.uint16("x00280006") || 0,
      rows: height,
      columns: width,
      bitsAllocated,
      bitsStored,
      highBit: dataSet.uint16("x00280102") || bitsStored - 1,
      pixelRepresentation,
      smallestPixelValue: minPixelValue,
      largestPixelValue: maxPixelValue,
      redPaletteColorLookupTableDescriptor: [] as number[],
      greenPaletteColorLookupTableDescriptor: [] as number[],
      bluePaletteColorLookupTableDescriptor: [] as number[],
      redPaletteColorLookupTableData: [] as number[],
      greenPaletteColorLookupTableData: [] as number[],
      bluePaletteColorLookupTableData: [] as number[],
      pixelData: pixelData.buffer,
      pixelDataLength: pixelData.byteLength,
    },
  };

  return image;
}

export function getRenderedInfo() {
  const renderingEngine = getRenderingEngine(renderingEngineId);
  if (!renderingEngine) {
    console.log("엔진이 없습니다.");
    return;
  }
  const viewport = renderingEngine.getViewport(viewportId);
  if (!viewport) {
    console.log("뷰포트가 없습니다.");
    return;
  }
}
