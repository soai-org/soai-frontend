"use client";

import { ViewerSidebar } from "@/components/ViewerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

function ViewerPage() {
  const [selectedModel, setSelectedModel] = useState("model1");
  return (
    <div className="flex h-screen  dark:bg-gray-900">
      {/* New Left Sidebar */}
      <ViewerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="flex-1 bg-background rounded-lg shadow-md flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">
            Main Content Area
          </h1>
        </div>
      </main>

      {/* Right Sidebar - Metadata */}
      <aside className="w-80 bg-secondary p-4 shadow-lg text-white overflow-y-auto">
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="pt-4">
              <h3 className="text-lg font-semibold mb-3">AI Model Selection</h3>
              <Separator className="my-2"/>
              <Select onValueChange={setSelectedModel} defaultValue={selectedModel}>
                <SelectTrigger className="w-full bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border border-gray-600">
                  <SelectItem value="model1">AI Model 1</SelectItem>
                  <SelectItem value="model2">AI Model 2</SelectItem>
                  <SelectItem value="model3">AI Model 3</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ViewerPage;
