import { Separator } from "@radix-ui/react-separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useState } from "react";

export function ViewerRightSidebar() {
  const [selectedModel, setSelectedModel] = useState("model1");

  return (
    <aside className="absolute right-0 w-80 bg-secondary p-4 shadow-lg text-white z-10">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-3">AI Model Selection</h3>
          <Separator className="my-2" />
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
  );
}
