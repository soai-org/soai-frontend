"use client";

import { ViewerLeftSidebar } from "@/components/ViewerLeftSidebar";
import DicomViewer from "@/components/DicomViewer";
import { ViewerRightSidebar } from "@/components/ViewerRightSidebar";

function ViewerPage() {
  return (
    <div className="relative h-screen dark:bg-gray-900">
      {/* New Left Sidebar */}
      <ViewerLeftSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1 bg-background flex items-center justify-center">
          <DicomViewer />
        </div>
      </main>

      {/* Right Sidebar - Metadata */}
      <ViewerRightSidebar />
    </div>
  );
}

export default ViewerPage;
