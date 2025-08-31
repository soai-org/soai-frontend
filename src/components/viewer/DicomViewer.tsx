"use client";

import React, { useEffect, useRef } from "react";

import {
  RenderingEngine,
  Enums,
  init as csCoreInit,
  StackViewport,
} from "@cornerstonejs/core";
import {
  init as csToolInit,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
  addTool,
  Enums as csToolsEnums,
  PanTool,
} from "@cornerstonejs/tools";

import { PublicViewportInput } from "@cornerstonejs/core/types";
import { useInstancesBySeriesUUID } from "@/query/patient";
import { InstanceCard } from "@/types/patient";
import { IToolGroup } from "@cornerstonejs/tools/types";

interface DicomViewerProps {
  seriesId: string | null;
  setToolGroup: (toolGroup: IToolGroup) => void;
}

const DicomViewer = ({ seriesId, setToolGroup }: DicomViewerProps) => {
  const viewerElement = useRef<HTMLDivElement>(null);
  const cornerstoneDICOMImageLoader = useRef<unknown>(null);
  const { mutate: getInstances } = useInstancesBySeriesUUID();

  useEffect(() => {
    const setup = async () => {
      if (window.document && viewerElement.current) {
        csCoreInit();
        csToolInit();

        // cornerstonejs/dicom-image-loader를 다이나믹하게 import
        const dicomImageLoaderModule = await import(
          "@cornerstonejs/dicom-image-loader"
        );
        dicomImageLoaderModule.init({
          maxWebWorkers: 1,
        });

        cornerstoneDICOMImageLoader.current = dicomImageLoaderModule;

        const renderingEngineId = "viewerEngine";
        const renderingEngine = new RenderingEngine(renderingEngineId);

        const viewportId = "MEDICAL_IMAGE_VIEWER";

        // Viewport 설정
        const viewportInput: PublicViewportInput = {
          viewportId,
          element: viewerElement.current,
          type: Enums.ViewportType.STACK,
        };

        // 렌더링 엔진에 Viewport 설정 주입
        renderingEngine.enableElement(viewportInput);

        // viewport 가져오기
        const viewport = renderingEngine.getViewport(
          viewportId,
        ) as StackViewport;

        if (seriesId) {
          getInstances(
            { seriesUuid: seriesId },
            {
              onSuccess: (data: InstanceCard[]) => {
                if (data && data.length > 0) {
                  const imageIds = data.map(
                    (instance) =>
                      `wadouri:http://localhost:8042/instances/${instance.instanceUuid}/file`,
                  );
                  viewport.setStack(imageIds);
                  viewport.render();
                }
              },
            },
          );
        } else {
          viewport.setStack(["wadouri://localhost:4000/dummy.dcm"]);
          viewport.render();
        }

        // Tool 추가하기
        const toolGroupId = "viewerTools";
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
        if (toolGroup) {
          setToolGroup(toolGroup);
        }

        addTool(ZoomTool);
        addTool(WindowLevelTool);
        addTool(PanTool);
        toolGroup?.addTool(ZoomTool.toolName);
        toolGroup?.addTool(WindowLevelTool.toolName);
        toolGroup?.addTool(PanTool.toolName);
        toolGroup?.addViewport(viewportId, renderingEngineId);

        // IO 인터페이스 바인딩
        toolGroup?.setToolActive(ZoomTool.toolName, {
          bindings: [
            {
              mouseButton: csToolsEnums.MouseBindings.Wheel, // Wheel
            },
          ],
        });
        toolGroup?.setToolActive(WindowLevelTool.toolName, {
          bindings: [
            {
              mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
            },
          ],
        });
        toolGroup?.setToolActive(PanTool.toolName, {
          bindings: [
            {
              mouseButton: csToolsEnums.MouseBindings.Auxiliary,
            },
          ],
        });

        viewport.render();

        function onResize() {
          viewport.resize();
          viewport.resetCamera();
          viewport.render();
        }

        window.addEventListener("resize", onResize);
      }
    };

    setup();
  }, [viewerElement, seriesId, getInstances]);

  return (
    <div className={`h-screen w-screen bg-black`} ref={viewerElement}></div>
  );
};

export default DicomViewer;
