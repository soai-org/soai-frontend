import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ViewerRightSidebar() {
  const [selectedModel, setSelectedModel] = useState("model1");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`${cn(
        "absolute top-0 right-0 w-80 h-screen bg-secondary p-4 shadow-lg text-white z-10 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-80",
      )}`}
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-gray-700"
        >
          {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      {isCollapsed ? (
        <></>
      ) : (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div>
            <h3 className="text-lg font-semibold mb-3">AI Model Selection</h3>
            <Separator className="my-2" />
            <Select
              onValueChange={setSelectedModel}
              defaultValue={selectedModel}
            >
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
      )}
    </aside>
  );
}
