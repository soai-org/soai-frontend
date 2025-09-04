"use client";

import React, { Dispatch, memo, useContext, useEffect, useRef } from "react";
import {
  RenderingEngine,
  Enums,
  StackViewport,
  imageLoader,
  getRenderingEngine,
} from "@cornerstonejs/core";
import {
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
  BrushTool,
  addTool,
  Enums as csToolsEnums,
  PanTool,
  segmentation,
} from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/types";
import { SeriesCard } from "@/types/viewer/series";
import { CornerstoneContext } from "@/providers/CornerstoneProvider";
import { ColorLUT } from "@cornerstonejs/core/types";

// Define constants outside the component
const renderingEngineId = "viewerEngine";
const viewportId = "MEDICAL_IMAGE_VIEWER";
const toolGroupId = "viewerTools";
const brushSegmentationId = "brush_segmentation";
const segmentationId = "segmentation";

interface DicomViewerProps {
  series?: SeriesCard | null;
  segmentationData: number[];
  setCurrentInstanceUUID: Dispatch<string>;
  setToolGroup: (toolGroup: IToolGroup) => void;
  setIsRendered: Dispatch<boolean>;
}

const DicomViewer = memo(
  ({
    series,
    segmentationData,
    setCurrentInstanceUUID,
    setToolGroup,
    setIsRendered,
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

            // 이미지 ID 불러오기
            const url = viewport.getImageIds()[0];
            const uuid =
              new URL(url.replace("wadouri://", "http://")).searchParams.get(
                "instanceUuid",
              ) || "";
            setCurrentInstanceUUID(uuid);
            viewport.resetCamera();

            // 가상 이미지 생성하기
            const derivedImage = imageLoader.createAndCacheDerivedImage(
              viewport.getImageIds()[0],
            );

            // 세그멘테이션 레이어 만들기
            segmentation.addSegmentations([
              {
                segmentationId: brushSegmentationId,
                representation: {
                  // The type of segmentation
                  type: csToolsEnums.SegmentationRepresentations.Labelmap,
                  data: {
                    imageIds: [derivedImage.imageId],
                  },
                },
              },
            ]);

            segmentation.addLabelmapRepresentationToViewport(viewportId, [
              {
                segmentationId: brushSegmentationId,
                type: csToolsEnums.SegmentationRepresentations.Labelmap,
              },
            ]);
            viewport.render();
            setIsRendered(true);
          })();
        }
      }
      return () => {
        segmentation.removeAllSegmentations();
      };
    }, [series, isInit, setIsRendered]);

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

        const derivedImage = imageLoader.createAndCacheDerivedImage(
          viewport.getImageIds()[0],
        );

        const derivedImageData = derivedImage.getPixelData() as Float32Array;
        const externalPixelDataArrays = new Float32Array(
          segmentationData.flat(),
        );
        derivedImageData.set(externalPixelDataArrays);
        console.log(derivedImageData.length);
        console.log(externalPixelDataArrays.length);

        segmentation.addSegmentations([
          {
            segmentationId,
            representation: {
              // The type of segmentation
              type: csToolsEnums.SegmentationRepresentations.Labelmap,
              data: {
                imageIds: [derivedImage.imageId],
              },
            },
          },
        ]);

        segmentation.addLabelmapRepresentationToViewport(viewportId, [
          {
            segmentationId,
            type: csToolsEnums.SegmentationRepresentations.Labelmap,
          },
        ]);

        const colorLUT: ColorLUT = [
          [0, 0, 0, 0],
          [255, 0, 0, 150],
        ];
        const lutIndex = 1;

        segmentation.config.color.addColorLUT(colorLUT, lutIndex);

        console.log("재렌더링 중");
        viewport.render();
      })();
    }, [segmentationData]);

    return <div className="h-screen w-screen" ref={viewerElement}></div>;
  },
);

DicomViewer.displayName = "DicomViewer";
export default DicomViewer;
