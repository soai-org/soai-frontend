"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import {
  RenderingEngine,
  Enums,
  init as csCoreInit,
  StackViewport,
  getRenderingEngine,
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
import { IToolGroup } from "@cornerstonejs/tools/types";
import { getSession } from "next-auth/react";
import { SeriesCard } from "@/types/viewer/series";

// Define constants outside the component
const renderingEngineId = "viewerEngine";
const viewportId = "MEDICAL_IMAGE_VIEWER";
const toolGroupId = "viewerTools";

interface DicomViewerProps {
  series?: SeriesCard | null;
  setToolGroup: (toolGroup: IToolGroup) => void;
}

const DicomViewer = memo(({ series, setToolGroup }: DicomViewerProps) => {
  const [init, setInit] = useState(false);
  const viewerElement = useRef<HTMLDivElement>(null);

  // Effect for one-time setup and cleanup
  useEffect(() => {
    if (!window || !document) {
      return;
    }

    // 초기화 진행 후 다시 실행 방지
    if (init) {
      return;
    }

    const setup = async () => {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("세션이 없습니다.");
      }

      if (!viewerElement.current) {
        return;
      }

      const element = viewerElement.current;

      // Init libraries
      csCoreInit();
      csToolInit();
      const dicomImageLoaderModule = await import(
        "@cornerstonejs/dicom-image-loader"
      );
      dicomImageLoaderModule.init({
        maxWebWorkers: 1,
        beforeSend(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            `Bearer ${session.accessToken}`,
          );
        },
      });

      // Create and enable rendering engine
      const renderingEngine = new RenderingEngine(renderingEngineId);
      const viewportInput = {
        viewportId,
        element,
        type: Enums.ViewportType.STACK,
      };
      renderingEngine.enableElement(viewportInput);

      // Create ToolGroup and add tools
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      if (!toolGroup) return;

      addTool(ZoomTool);
      addTool(WindowLevelTool);
      addTool(PanTool);
      toolGroup.addTool(ZoomTool.toolName);
      toolGroup.addTool(WindowLevelTool.toolName);
      toolGroup.addTool(PanTool.toolName);
      toolGroup.addViewport(viewportId, renderingEngineId);

      // // Set tool bindings
      toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
      });
      toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
      });
      toolGroup.setToolActive(PanTool.toolName, {
        bindings: [{ mouseButton: csToolsEnums.MouseBindings.Auxiliary }],
      });

      setToolGroup(toolGroup);
    };

    setup().then(() => {
      setInit(true);
    });

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
    if (init && series && series.instances) {
      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) {
        console.log("렌더링 엔진을 가지고 오는데 실패했습니다.");
        return;
      }

      const viewport = renderingEngine.getViewport(viewportId) as StackViewport;
      if (!viewport) {
        console.log("뷰포트를 가져오는 데 실패했습니다.");
        return;
      }

      const wadouris = series?.instances.map(
        (instance) =>
          `wadouri://${process.env.NEXT_PUBLIC_SPRING_SERVER}/api/viewer/dicomfile?instanceUuid=${instance}`,
      );

      console.log(wadouris);

      if (wadouris && wadouris.length > 0) {
        viewport.setStack(wadouris);
        viewport.render();
      }
    }
  }, [series, init]);

  return <div className="h-screen w-screen" ref={viewerElement}></div>;
});

DicomViewer.displayName = "DicomViewer";
export default DicomViewer;
