import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Dispatch, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChatbotPanel } from "./ChatbotPanel";
import axios from "@/query/axios";
import { getSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";

interface ModelInfo {
  id: string;
  name: string;
  type: string;
  handler: (args?: unknown[]) => void;
}

// Helper function to render UI based on selected model
const renderModelControls = (
  selectedModel: ModelInfo,
  labeldString?: string,
) => {
  return (
    <div className="mt-4">
      {selectedModel.type === "input-button" && (
        <Textarea
          className="mb-4 border-none rounded-md bg-background"
          value={labeldString}
          readOnly
        ></Textarea>
      )}
      <Button className="w-full" onClick={() => selectedModel.handler()}>
        요청하기
      </Button>
    </div>
  );
};

interface ViewerRightSidebarProps {
  instanceUUID?: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSegmentationData: Dispatch<[]>;
}

export function ViewerRightSidebar({
  instanceUUID,
  isCollapsed,
  setSegmentationData,
  toggleSidebar,
}: ViewerRightSidebarProps) {
  const modelInfos: ModelInfo[] = [
    {
      id: "model1",
      name: "X-ray 세그멘테이션 ",
      type: "button",
      handler: async () => {
        const session = await getSession();
        if (!session?.accessToken) {
          console.log("세션이 없습니다.");
          return;
        }

        if (!instanceUUID) {
          console.log("인스턴스 UUID가 유효하지 않습니다.");
          return;
        }

        try {
          const data = {
            instanceUUID,
          };
          const res = await axios.post("/x-ray/segmentation-array", data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });

          setSegmentationData(res.data.data);
        } catch (error) {
          console.log("요청이 실패했습니다.");
        }
      },
    },
    {
      id: "model2",
      name: "X-ray 라벨링",
      type: "input-button",
      handler: async () => {
        const session = await getSession();
        if (!session?.accessToken) {
          console.log("세션이 없습니다.");
          return;
        }

        if (!instanceUUID) {
          console.log("인스턴스 UUID가 유효하지 않습니다.");
          return;
        }

        try {
          const data = {
            instanceUUID,
            description: "선천성유문협착증",
          };
          const res = await axios.post("/x-ray/captioning", data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });

          setLabeledLabeledString(res.data.transcript as string);
        } catch (error) {
          console.log("요청이 실패했습니다.");
        }
      },
    },
  ];

  const [selectedModelId, setSelectedModelId] = useState("model1");
  const [labeledString, setLabeledLabeledString] = useState("");

  return (
    <aside
      className={cn(
        "absolute top-0 right-0 w-80 h-screen bg-secondary p-4 shadow-lg text-white z-10 transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-20" : "w-80",
      )}
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
        <div className="flex flex-col h-full space-y-4">
          {/* 상단 AI 모델 선택 영역 */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold mb-3">AI Model Selection</h3>
            <Separator className="my-2" />
            <Select
              onValueChange={setSelectedModelId}
              defaultValue={modelInfos[0].id}
            >
              <SelectTrigger className="w-full bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border border-gray-600">
                {modelInfos.map((modelInfo) => (
                  <SelectItem value={modelInfo.id} key={modelInfo.id}>
                    {modelInfo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Conditionally rendered UI for the selected model */}
            {renderModelControls(
              modelInfos.find(
                (modelInfo) => modelInfo.id === selectedModelId,
              ) || modelInfos[0],
              labeledString,
            )}
          </div>

          {/* 하단 챗봇 패널 - 화면 높이의 50% 정도 */}
          <div className="flex-1 max-h-[50vh] min-h-[50vh]">
            <ChatbotPanel />
          </div>
        </div>
      )}
    </aside>
  );
}
