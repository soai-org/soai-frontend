"use client";

import { ViewerLeftSidebar } from "@/components/viewer/ViewerLeftSidebar";
import DicomViewer from "@/components/viewer/DicomViewer";
import { ViewerRightSidebar } from "@/components/viewer/ViewerRightSidebar";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { Suspense, useState, use } from "react";
import { IToolGroup } from "@cornerstonejs/tools/types";
import { useSeriesByStudyUUID } from "@/query/viewer";

interface ViewerPageParams {
  studyuuid: string;
}

interface ViewerPageProps {
  params: Promise<ViewerPageParams>;
}

function ViewerPage({ params }: ViewerPageProps) {
  const { studyuuid } = use(params);

  // 현재 InstnaceUUID 상태값
  const [segmentationData, setSegmentationData] = useState<number[]>([]);
  const [currentInstanceUUID, setCurrentInstanceUUID] = useState("");
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);
  const [toolGroup, setToolGroup] = useState<IToolGroup | null>(null);

  const { data: seriesList, isLoading: isSeriesLoading } = useSeriesByStudyUUID(
    {
      studyUuid: studyuuid,
      limit: 6,
      since: 0,
    },
  );

  const leftMargin = isLeftSidebarCollapsed ? 80 : 256;
  const rightMargin = isRightSidebarCollapsed ? 80 : 320;

  return (
    <div className="relative h-screen dark:bg-gray-900">
      <ViewerToolbar toolGroup={toolGroup} />
      <Suspense>
        <ViewerLeftSidebar
          seriesList={seriesList}
          isCollapsed={isLeftSidebarCollapsed}
          isSeriesLoading={isSeriesLoading}
          toggleSidebar={() => setIsLeftSidebarCollapsed((prev) => !prev)}
          currentSeriesId={currentSeriesId}
          onSeriesSelect={setCurrentSeriesId}
        />
      </Suspense>

      <main
        className="flex-1 flex flex-col overflow-auto transition-all duration-300 ease-in-out"
        style={{
          marginLeft: `${leftMargin}px`,
          marginRight: `${rightMargin}px`,
        }}
      >
        <div className="flex-1 bg-background flex items-center justify-center">
          {seriesList && currentSeriesId && (
            <DicomViewer
              segmentationData={segmentationData}
              setCurrentInstanceUUID={setCurrentInstanceUUID}
              series={seriesList.find(
                (series) => series.id === currentSeriesId,
              )}
              setToolGroup={setToolGroup}
            />
          )}
        </div>
      </main>

      <ViewerRightSidebar
        instanceUUID={currentInstanceUUID}
        isCollapsed={isRightSidebarCollapsed}
        toggleSidebar={() => setIsRightSidebarCollapsed((prev) => !prev)}
        setSegmentationData={setSegmentationData}
      />
    </div>
  );
}

export default ViewerPage;
