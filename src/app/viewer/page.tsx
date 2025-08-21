"use client";

import { ViewerSidebar } from "@/components/ViewerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function ViewerPage() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* New Left Sidebar */}
      <ViewerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="flex-1 bg-[#121212] rounded-lg shadow-md flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">
            Main Content Area
          </h1>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white dark:bg-gray-800 p-4 shadow-lg">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Information</h3>
              <p className="text-sm text-gray-500">
                Details about the selected item will appear here.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold">Actions</h3>
              <div className="flex flex-col space-y-2 mt-2">
                <Button variant="outline">Action 1</Button>
                <Button variant="outline">Action 2</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export default ViewerPage;
