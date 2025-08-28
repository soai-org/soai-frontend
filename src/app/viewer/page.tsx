"use client";

import { ViewerLeftSidebar } from "@/components/ViewerLeftSidebar";
import DicomViewer from "@/components/DicomViewer";
import { ViewerRightSidebar } from "@/components/ViewerRightSidebar";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { useState } from "react";
import { IToolGroup } from "@cornerstonejs/tools/types";

function ViewerPage() {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);
  const [toolGroup, setToolGroup] = useState<IToolGroup | null>(null);

  const leftMargin = isLeftSidebarCollapsed ? 80 : 256;
  const rightMargin = isRightSidebarCollapsed ? 80 : 320;

  return (
    <div className="relative h-screen dark:bg-gray-900">
      <ViewerToolbar toolGroup={toolGroup} />
      <ViewerLeftSidebar
        isCollapsed={isLeftSidebarCollapsed}
        toggleSidebar={() => setIsLeftSidebarCollapsed((prev) => !prev)}
        currentSeriesId={currentSeriesId}
        onSeriesSelect={setCurrentSeriesId}
      />

      <main
        className="flex-1 flex flex-col overflow-auto transition-all duration-300 ease-in-out"
        style={{
          marginLeft: `${leftMargin}px`,
          marginRight: `${rightMargin}px`,
        }}
      >
        <div className="flex-1 bg-background flex items-center justify-center">
          <DicomViewer seriesId={currentSeriesId} setToolGroup={setToolGroup} />
        </div>
      </main>

      <ViewerRightSidebar
        isCollapsed={isRightSidebarCollapsed}
        toggleSidebar={() => setIsRightSidebarCollapsed((prev) => !prev)}
      />
    </div>
  );
}

export default ViewerPage;
