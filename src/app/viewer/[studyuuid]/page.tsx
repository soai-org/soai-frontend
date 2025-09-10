"use client";

import { ViewerLeftSidebar } from "@/components/viewer/ViewerLeftSidebar";
import DicomViewer from "@/components/viewer/DicomViewer";
import { ViewerRightSidebar } from "@/components/viewer/ViewerRightSidebar";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { Suspense, useState, use } from "react";
import { IToolGroup } from "@cornerstonejs/tools/types";
import { useSeriesByStudyUUID } from "@/query/viewer";
import { ViewerMetadata } from "@/types/viewer/metadata";

interface ViewerPageParams {
  studyuuid: string;
}

interface ViewerPageProps {
  params: Promise<ViewerPageParams>;
}

const metadataInit: ViewerMetadata = {
  patientName: "",
  patientId: "",
  studyDescription: "",
  studyDate: "",
  modality: "",
  size: "",
};

function ViewerPage({ params }: ViewerPageProps) {
  // uuid 동적 뷰어
  const { studyuuid } = use(params);

  // 병변 부위 API 요청 결과값 저장
  const [segmentationData, setSegmentationData] = useState<number[]>([]);
  // 현재 InstnaceUUID 상태값
  const [currentInstanceUUIDs, setCurrentInstanceUUIDs] = useState<string[]>(
    [],
  );
  // 현재 시리즈 ID 값
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);

  // 이미지 메타데이터 상태값 관리
  const [metadata, setMetadata] = useState<ViewerMetadata>(metadataInit);

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

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
      <ViewerToolbar />
      <Suspense>
        <ViewerLeftSidebar
          metadata={metadata}
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
              setCurrentInstanceUUIDs={setCurrentInstanceUUIDs}
              series={seriesList.find(
                (series) => series.id === currentSeriesId,
              )}
              setMetadata={setMetadata}
            />
          )}
        </div>
      </main>

      <ViewerRightSidebar
        metadata={metadata}
        instanceUUIDs={currentInstanceUUIDs}
        isCollapsed={isRightSidebarCollapsed}
        toggleSidebar={() => setIsRightSidebarCollapsed((prev) => !prev)}
        setSegmentationData={setSegmentationData}
      />
    </div>
  );
}

export default ViewerPage;
