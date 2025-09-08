"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  Move,
  Sun,
  RotateCcw,
  Brush,
  ChevronUp,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ZoomTool,
  PanTool,
  WindowLevelTool,
  BrushTool,
  StackScrollTool,
  Enums as csToolsEnums,
  ToolGroupManager,
  addTool,
  segmentation,
  Enums,
} from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/types";
import {
  brushSegmentationId,
  renderingEngineId,
  toolGroupId,
  viewportId,
} from "@/types/viewer/constant";
import {
  getRenderingEngine,
  imageLoader,
  StackViewport,
} from "@cornerstonejs/core";

interface ViewerToolbarProps {
  toolGroup: IToolGroup | null;
  setToolGroup: Dispatch<IToolGroup>;
  isViewportInit: boolean;
}

const setActiveTool = (toolName: string) => {
  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  if (toolGroup) {
    console.log(`toolName: ${toolName}으로 변경합니다.`);
    toolGroup.setActivePrimaryTool(toolName);
  }
};

const tools = [
  {
    name: "Zoom",
    icon: ZoomIn,
    toolName: ZoomTool.toolName,
    handler: () => setActiveTool(ZoomTool.toolName),
  },
  {
    name: "Pan",
    icon: Move,
    toolName: PanTool.toolName,
    handler: () => setActiveTool(PanTool.toolName),
  },
  {
    name: "WindowLevel",
    icon: Sun,
    toolName: WindowLevelTool.toolName,
    handler: () => setActiveTool(WindowLevelTool.toolName),
  },
  {
    name: "Brush",
    icon: Brush,
    toolName: BrushTool.toolName,
    handler: () => {
      setActiveTool(BrushTool.toolName);

      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) {
        console.log("엔진이 없습니다.");
        return;
      }
      const viewport = renderingEngine.getViewport(viewportId) as StackViewport;
      if (!viewport) {
        console.log("뷰포트가 없습니다.");
        return;
      }

      // Segmentation 생성 여부 체크
      const activeSegmentation = segmentation.getActiveSegmentation(viewportId);
      if (activeSegmentation?.segmentationId === brushSegmentationId) {
        console.log(`이미 ${brushSegmentationId}가 존재합니다.`);
        return;
      }

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
    },
  },
  {
    name: "Reset",
    icon: RotateCcw,
    toolName: "Reset",
    handler: () => {
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

      segmentation.removeAllSegmentations();
    },
  },
];

export function ViewerToolbar({
  toolGroup,
  setToolGroup,
  isViewportInit,
}: ViewerToolbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Create ToolGroup and add tools
    if (isViewportInit) {
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      if (!toolGroup) return;

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
            mouseButton: Enums.MouseBindings.Wheel,
          },
        ],
      });

      toolGroup.addViewport(viewportId, renderingEngineId);
      setToolGroup(toolGroup);
    }

    return () => {
      ToolGroupManager.destroy();
    };
  }, [isViewportInit]);

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 z-20 bg-secondary text-white p-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out",
      )}
    >
      <div className="flex items-center justify-center">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.name}
                variant="ghost"
                size="icon"
                onClick={tool.handler}
              >
                <tool.icon className="w-2 h-2" />
              </Button>
            ))}
          </div>
        )}
        {isCollapsed ? (
          <div onClick={() => setIsCollapsed((prev) => !prev)}>
            <ChevronDownIcon />
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            <ChevronUp />
          </Button>
        )}
      </div>
    </div>
  );
}
