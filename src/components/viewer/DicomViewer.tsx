"use client";

import React, { Dispatch, memo, useContext, useEffect, useRef } from "react";
import {
  RenderingEngine,
  Enums,
  StackViewport,
  imageLoader,
  getRenderingEngine,
  metaData,
} from "@cornerstonejs/core";
import {
  ToolGroupManager,
  Enums as csToolsEnums,
  segmentation,
} from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/types";
import { SeriesCard } from "@/types/viewer/series";
import { CornerstoneContext } from "@/providers/CornerstoneProvider";
import { ViewerMetadata } from "@/types/viewer/metadata";
import { formatTime } from "@/lib/utils";
import { fixBrokenUtf8 } from "@/lib/strconv";
import {
  labelSegmentationId,
  renderingEngineId,
  toolGroupId,
  viewportId,
} from "@/types/viewer/constant";

interface DicomViewerProps {
  series?: SeriesCard | null;
  segmentationData: number[];
  setCurrentInstanceUUIDs: Dispatch<string[]>;
  setToolGroup: (toolGroup: IToolGroup) => void;
  setIsRendered: Dispatch<boolean>;
  setMetadata: Dispatch<ViewerMetadata>;
}

const DicomViewer = memo(
  ({
    series,
    segmentationData,
    setCurrentInstanceUUIDs,
    setToolGroup,
    setIsRendered,
    setMetadata,
  }: DicomViewerProps) => {
    const isInit = useContext(CornerstoneContext);
    const viewerElement = useRef<HTMLDivElement>(null);

    // Effect for one-time setup and cleanup
    useEffect(() => {
      if (!window || !document) {
        return;
      }

      const setup = () => {
        if (!viewerElement.current) {
          return;
        }

        const element = viewerElement.current;

        // Create and enable rendering engine
        const renderingEngine = new RenderingEngine(renderingEngineId);
        const viewportInput = {
          viewportId,
          element,
          type: Enums.ViewportType.STACK,
        };
        renderingEngine.enableElement(viewportInput);
      };

      setup();

      return () => {
        try {
          ToolGroupManager.destroyToolGroup(toolGroupId);
          const renderingEngine = getRenderingEngine(renderingEngineId);
          renderingEngine?.destroy();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      };
    }, [setToolGroup, viewerElement]);

    // Effect for loading data when series changes
    useEffect(() => {
      if (isInit && series && series.instances.length > 0) {
        const renderingEngine = getRenderingEngine(renderingEngineId);
        if (!renderingEngine) {
          console.log("렌더링 엔진을 가지고 오는데 실패했습니다.");
          return;
        }

        const viewport = renderingEngine.getViewport(
          viewportId,
        ) as StackViewport;
        if (!viewport) {
          console.log("뷰포트를 가져오는 데 실패했습니다.");
          return;
        }

        const wadouris = series?.instances.map(
          (instance) =>
            `wadouri://${process.env.NEXT_PUBLIC_SPRING_SERVER}/api/viewer/dicomfile?instanceUuid=${instance}`,
        );

        if (wadouris && wadouris.length > 0) {
          (async () => {
            await viewport.setStack(wadouris);
            setCurrentInstanceUUIDs(series.instances);

            // 이미지 ID 불러오기
            const imageId = viewport.getImageIds()[0];
            viewport.resetCamera();

            // 가상 이미지 생성하기
            const derivedImages =
              imageLoader.createAndCacheDerivedImages(wadouris);

            // DICOM 파일로부터 메타데이터 추출
            const studyDate = metaData.get(
              "generalStudyModule",
              imageId,
            )?.studyDate;
            const studyTime = metaData.get(
              "generalStudyModule",
              imageId,
            )?.studyTime;

            setMetadata({
              patientName: fixBrokenUtf8(
                metaData.get("patientModule", imageId)?.patientName,
              ), // UTF-8 인코딩 변경
              patientId: metaData.get("patientModule", imageId)?.patientID,
              studyDate: `${studyDate.year}-${studyDate.month}-${studyDate.day} ${formatTime(studyTime)}`,
              studyDescription: fixBrokenUtf8(
                metaData.get("generalStudyModule", imageId)?.studyDescription,
              ), // UTF-8 인코딩 변경
              modality: metaData.get("generalSeriesModule", imageId)?.modality,
              size: `${derivedImages[0].width}X${derivedImages[0].height}`,
            });

            viewport.render();
            setIsRendered(true);
          })();
        }
      }
      return () => {
        segmentation.removeAllSegmentations();
      };
    }, [series, isInit, setIsRendered]);

    // 세그멘테이션 렌더링
    useEffect(() => {
      (async () => {
        const renderingEngine = getRenderingEngine(renderingEngineId);
        if (!renderingEngine) {
          console.log("렌더링 엔진을 가지고 오는데 실패했습니다.");
          return;
        }

        const viewport = renderingEngine.getViewport(
          viewportId,
        ) as StackViewport;
        if (!viewport) {
          console.log("뷰포트를 가져오는 데 실패했습니다.");
          return;
        }

        if (segmentationData.length <= 0) {
          return;
        }

        const currentImageIds = viewport.getImageIds();
        const derivedImages =
          imageLoader.createAndCacheDerivedImages(currentImageIds);
        const derivedImageData =
          derivedImages[0].getPixelData() as Float32Array;
        const externalPixelDataArrays = new Float32Array(
          segmentationData.flat(),
        );
        derivedImageData.set(externalPixelDataArrays);

        if (
          segmentation.getActiveSegmentation(viewportId)?.segmentationId !==
          labelSegmentationId
        ) {
          segmentation.addSegmentations([
            {
              segmentationId: labelSegmentationId,
              representation: {
                // The type of segmentation
                type: csToolsEnums.SegmentationRepresentations.Labelmap,
                data: {
                  imageIds: derivedImages.map((image) => image.imageId),
                },
              },
            },
          ]);

          segmentation.addSegmentationRepresentations(viewportId, [
            {
              segmentationId: labelSegmentationId,
              type: csToolsEnums.SegmentationRepresentations.Labelmap,
            },
          ]);
        }

        console.log("재렌더링 중");
        viewport.render();
      })();
    }, [segmentationData]);

    return <div className="h-screen w-screen" ref={viewerElement}></div>;
  },
);

DicomViewer.displayName = "DicomViewer";
export default DicomViewer;
