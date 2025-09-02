"use client";

import React, { memo, useContext, useEffect, useRef } from "react";
import {
  RenderingEngine,
  Enums,
  StackViewport,
  getRenderingEngine,
} from "@cornerstonejs/core";
import {
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
  addTool,
  Enums as csToolsEnums,
  PanTool,
} from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/types";
import { SeriesCard } from "@/types/viewer/series";
import { CornerstoneContext } from "@/providers/CornerstoneProvider";

// Define constants outside the component
const renderingEngineId = "viewerEngine";
const viewportId = "MEDICAL_IMAGE_VIEWER";
const toolGroupId = "viewerTools";

interface DicomViewerProps {
  series?: SeriesCard | null;
  setToolGroup: (toolGroup: IToolGroup) => void;
}

const DicomViewer = memo(({ series, setToolGroup }: DicomViewerProps) => {
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

      const viewport = renderingEngine.getViewport(viewportId) as StackViewport;
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
          viewport.resetCamera();
          viewport.render();
        })();
      }
    }
  }, [series, isInit]);

  return <div className="h-screen w-screen" ref={viewerElement}></div>;
});

DicomViewer.displayName = "DicomViewer";
export default DicomViewer;
