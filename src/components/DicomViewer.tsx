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
} from "@cornerstonejs/tools";

import { PublicViewportInput } from "@cornerstonejs/core/types";

const DicomViewer = () => {
  const viewerElement = useRef<HTMLDivElement>(null);
  const cornerstoneDICOMImageLoader = useRef<unknown>(null);

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

        viewport.setStack(["wadouri://localhost:3000/dummy.dcm"]);
        viewport.render();

        // Tool 추가하기
        const toolGroupId = "viewerTools";
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

        addTool(ZoomTool); // Zoom 툴 추가
        addTool(WindowLevelTool);
        toolGroup?.addTool(ZoomTool.toolName);
        toolGroup?.addTool(WindowLevelTool.toolName);
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

        viewport.render();
      }
    };

    setup();
  }, [viewerElement]);

  return (
    <div className={`h-screen w-screen bg-black`} ref={viewerElement}></div>
  );
};

export default DicomViewer;
