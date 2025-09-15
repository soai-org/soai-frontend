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
import { ViewerMetadata } from "@/types/viewer/metadata";
import { GraphDialog } from "./GraphDialog";
import Loading from "../Loading";
import { segmentationRender } from "@/lib/dicom";
import { ResponseSkinDiagnosis } from "@/types/viewer/response";

interface ModelInfo {
  id: string;
  name: string;
  type: string;
  handler: (args?: unknown[]) => void;
}

// Helper function to render UI based on selected model
const renderModelControls = (
  isPending: boolean,
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
        {isPending ? <Loading /> : "요청하기"}
      </Button>
    </div>
  );
};

interface ViewerRightSidebarProps {
  instanceUUIDs?: string[];
  isCollapsed: boolean;
  metadata: ViewerMetadata;
  toggleSidebar: () => void;
  setSegmentationData: Dispatch<[]>;
}

export function ViewerRightSidebar({
  instanceUUIDs,
  isCollapsed,
  metadata,
  toggleSidebar,
}: ViewerRightSidebarProps) {
  const modelInfos: ModelInfo[] = [
    {
      id: "model1",
      name: "X-ray 세그멘테이션 ",
      type: "button",
      handler: async () => {
        if (!instanceUUIDs || instanceUUIDs.length <= 0) {
          console.log("인스턴스 UUID가 유효하지 않습니다.");
          return;
        }

        const session = await getSession();
        if (!session?.accessToken) {
          console.log("세션이 없습니다.");
          return;
        }

        try {
          const data = {
            instanceUUID: instanceUUIDs[0],
          };

          setIsPending(true);
          const res = await axios.post("/x-ray/segmentation-array", data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });

          segmentationRender(res.data.data);
        } catch (error) {
          console.log(error);
          console.log("요청이 실패했습니다.");
        } finally {
          setIsPending(false);
        }
      },
    },
    {
      id: "model2",
      name: "X-ray 라벨링",
      type: "input-button",
      handler: async () => {
        if (!instanceUUIDs || instanceUUIDs.length <= 0) {
          console.log("인스턴스 UUID가 유효하지 않습니다.");
          return;
        }

        const session = await getSession();
        if (!session?.accessToken) {
          console.log("세션이 없습니다.");
          return;
        }

        try {
          const data = {
            instanceUUID: instanceUUIDs[0],
            description: metadata.studyDescription,
          };

          setIsPending(true);
          const res = await axios.post("/x-ray/captioning", data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
          setIsPending(false);

          setLabeledString(res.data.transcript as string);
        } catch (error) {
          console.log(error);
          console.log("요청이 실패했습니다.");
        } finally {
          setIsPending(false);
        }
      },
    },
    {
      id: "model3",
      name: "충수염 진단",
      type: "button",
      handler: async () => {
        if (!instanceUUIDs || instanceUUIDs.length <= 0) {
          console.log("인스턴스 UUID가 유효하지 않습니다.");
          return;
        }

        const session = await getSession();
        if (!session?.accessToken) {
          console.log("세션이 없습니다.");
          return;
        }

        try {
          setIsGraphDialogOpen(true);
          const data = {
            appendicitisUuidList: instanceUUIDs,
          };
          const res = await axios.post("/appendicitis/diagnosis", data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });

          const appendcitisProbability = res.data.appendcitis_probability;
          setGraphData(res.data.concept_scores);
          setLabeledString(`충수염 확률: ${appendcitisProbability}`);
        } catch (error) {
          console.log(error);
          console.log("요청이 실패했습니다.");
          setIsGraphDialogOpen(false);
        }
      },
    },
    {
      id: "model4",
      name: "피부 질환 분류",
      type: "button",
      handler: async () => {
        if (!instanceUUIDs || instanceUUIDs.length <= 0) {
          console.log("인스턴스 UUID가 유효하지 않습니다.");
          return;
        }

        const session = await getSession();
        if (!session?.accessToken) {
          console.log("세션이 없습니다.");
          return;
        }

        try {
          setIsGraphDialogOpen(true);
          const body = {
            instanceUUID: instanceUUIDs[0],
          };
          const { data } = await axios.post<ResponseSkinDiagnosis>(
            "/skin-trouble/prediction",
            body,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            },
          );

          setGraphData(data.prediction);
          setLabeledString(data.label);
        } catch (error) {
          console.log(error);
          console.log("요청이 실패했습니다.");
          setIsGraphDialogOpen(false);
        }
      },
    },
  ];

  const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("model1");
  const [labeledString, setLabeledString] = useState("");
  const [graphData, setGraphData] = useState<Record<string, number> | null>(
    null,
  );

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
              isPending,
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
      <GraphDialog
        label={labeledString}
        data={graphData}
        isOpen={isGraphDialogOpen}
        onClose={() => {
          setGraphData(null);
          setIsGraphDialogOpen(false);
          setLabeledString("");
        }}
      />
    </aside>
  );
}
