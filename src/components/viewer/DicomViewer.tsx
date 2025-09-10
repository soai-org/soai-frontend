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
  BrushTool,
  PanTool,
  StackScrollTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
  addTool,
  Enums as csToolsEnums,
  segmentation,
  utilities,
} from "@cornerstonejs/tools";
import { SeriesCard } from "@/types/viewer/series";
import { CornerstoneContext } from "@/providers/CornerstoneProvider";
import { ViewerMetadata } from "@/types/viewer/metadata";
import { formatTime } from "@/lib/utils";
import { fixBrokenUtf8 } from "@/lib/strconv";
import {
  renderingEngineId,
  toolGroupId,
  viewportId,
} from "@/types/viewer/constant";

interface DicomViewerProps {
  series?: SeriesCard | null;
  segmentationData?: number[];
  setCurrentInstanceUUIDs: Dispatch<string[]>;
  setMetadata: Dispatch<ViewerMetadata>;
}

const DicomViewer = memo(
  ({ series, setCurrentInstanceUUIDs, setMetadata }: DicomViewerProps) => {
    const isCornerstoneInit = useContext(CornerstoneContext);
    const viewerElement = useRef<HTMLDivElement>(null);

    // 렌더링 엔진 및 뷰포트 등록
    useEffect(() => {
      if (!window || !document) {
        return;
      }

      const setup = () => {
        if (!viewerElement.current) {
          return;
        }

        // Create and enable rendering engine
        const renderingEngine = new RenderingEngine(renderingEngineId);
        const viewportInput = {
          viewportId,
          element: viewerElement.current,
          type: Enums.ViewportType.STACK,
        };
        renderingEngine.enableElement(viewportInput);
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
        if (!toolGroup) {
          return;
        }

        addTool(ZoomTool);
        addTool(WindowLevelTool);
        addTool(PanTool);
        addTool(BrushTool);
        addTool(StackScrollTool);
        toolGroup.addTool(ZoomTool.toolName);
        toolGroup.addTool(WindowLevelTool.toolName);
        toolGroup.addTool(PanTool.toolName);
        toolGroup.addTool(BrushTool.toolName);
        toolGroup.addTool(StackScrollTool.toolName);

        toolGroup.setToolActive(StackScrollTool.toolName, {
          bindings: [
            {
              mouseButton: csToolsEnums.MouseBindings.Wheel,
            },
          ],
        });

        toolGroup.addViewport(viewportId, renderingEngineId);
      };

      setup();

      return () => {
        try {
          ToolGroupManager.destroyToolGroup(toolGroupId);
          segmentation.removeAllSegmentationRepresentations();
          segmentation.removeAllSegmentations();
          const renderingEngine = getRenderingEngine(renderingEngineId);
          renderingEngine?.destroy();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      };
    }, [viewerElement]);

    // 이미지 메타데이터 출력 로직
    useEffect(() => {
      if (isCornerstoneInit && series && series.instances.length > 0) {
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

        // const wadouris = [`wadouri://localhost:4000/dummy.dcm`];

        if (wadouris && wadouris.length > 0) {
          (async () => {
            // DICOM 이미지 불러오기
            await viewport.setStack(wadouris, 0);
            utilities.stackContextPrefetch.enable(viewerElement.current);
            setCurrentInstanceUUIDs(series.instances);

            // 이미지 ID 불러오기
            const imageId = viewport.getImageIds()[0];
            viewport.resetCamera();
            const image = await imageLoader.loadAndCacheImage(imageId);

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
              size: `${image.width}X${image.height}`,
            });

            viewport.render();
          })();
        }
      }
    }, [series, isCornerstoneInit, setCurrentInstanceUUIDs, setMetadata]);

    return <div className="h-screen w-screen" ref={viewerElement}></div>;
  },
);

DicomViewer.displayName = "DicomViewer";
export default DicomViewer;
