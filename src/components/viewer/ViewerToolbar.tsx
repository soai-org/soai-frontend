"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, Move, Sun, ChevronUp, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Enums as csToolsEnums } from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/types";

interface ViewerToolbarProps {
  toolGroup: IToolGroup | null;
}

export function ViewerToolbar({ toolGroup }: ViewerToolbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tools = [
    { name: "Zoom", icon: ZoomIn, toolName: "Zoom" },
    { name: "Pan", icon: Move, toolName: "Pan" },
    { name: "WindowLevel", icon: Sun, toolName: "WindowLevel" },
  ];

  const setActiveTool = (toolName: string) => {
    if (toolGroup) {
      toolGroup.setToolActive(toolName, {
        bindings: [
          {
            mouseButton: csToolsEnums.MouseBindings.Primary,
          },
        ],
      });
    }
  };

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
                className={""}
                key={tool.name}
                variant="ghost"
                size="icon"
                onClick={() => setActiveTool(tool.toolName)}
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
