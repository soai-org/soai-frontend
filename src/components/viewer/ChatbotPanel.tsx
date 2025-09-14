"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatbotAsk } from "@/query/ai/chatbot";
import axios from "@/query/axios";
import { getSession } from "next-auth/react";
import { useChatStore } from "@/store/chat";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isError: boolean;
  timestamp: Date;
}

export function ChatbotPanel() {
  const { messages, addMessages, buffer, setBuffer } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: ask, isPending } = useChatbotAsk();

  const weboscketRef = useRef<WebSocket>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectWebsocket = () => {
    const websocket = new WebSocket("ws://localhost:8080/ws");

    websocket.onopen = async function () {
      console.log("WebSocket 연결됨");
    };

    websocket.onmessage = (event) => {
      const message = event.data as string;
      if (message.includes("--- 스트리밍 완료 ---")) {
        const { buffer } = useChatStore.getState();
        addMessages({
          id: Date.now().toString(),
          content: buffer,
          isUser: false,
          isError: false,
          timestamp: new Date(),
        });
      } else if (message.startsWith("🚀 WebSocket 연결 성공!")) {
      } else if (message.startsWith("🚀 LLM 스트리밍 WebSocket 연결 성공!")) {
      } else if (message.startsWith("🔑 클라이언트 ID: ")) {
        setClientId(message.replace("🔑 클라이언트 ID: ", ""));
      } else if (message.startsWith("### 질문:")) {
      } else {
        setBuffer(event.data);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket 연결 종료");
      weboscketRef.current = null;
      setClientId(null);
      if (!buffer) {
        console.log("전달받은 답변이 없습니다.");
        return;
      }
    };

    websocket.onerror = (error) => {
      console.log(error);
      weboscketRef.current = null;
      const ErrorDisplay: Message = {
        id: Date.now().toString(),
        content: "오류, 질문을 다시 해주세요.",
        isUser: false,
        isError: true,
        timestamp: new Date(),
      };
      addMessages(ErrorDisplay);
    };

    return websocket;
  };

  useEffect(() => {
    weboscketRef.current = connectWebsocket();

    return () => {
      weboscketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  // 기존 한꺼번에 반환하는 LLM 핸들러
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!weboscketRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      isError: false,
      timestamp: new Date(),
    };

    addMessages(userMessage);

    // 간단한 자동 응답 (실제로는 API 호출로 대체)
    try {
      const result = await ask(inputValue);
      const chatbotResponse: Message = {
        id: Date.now().toString(),
        content: result.response,
        isUser: false,
        isError: false,
        timestamp: new Date(),
      };
      addMessages(chatbotResponse);
    } catch (error) {
      console.log(error);

      const ErrorDisplay: Message = {
        id: Date.now().toString(),
        content: "오류, 질문을 다시 해주세요.",
        isUser: false,
        isError: true,
        timestamp: new Date(),
      };
      addMessages(ErrorDisplay);
    }
  };

  // Websocekt 이용 실시간 LLM 답변 핸들러
  const handleSendMessageWithWebsocket = async () => {
    if (!inputValue.trim()) return;

    if (!weboscketRef.current) {
      const errorMessage = "연결을 재설정합니다.";
      console.log(errorMessage);
      const ErrorDisplay: Message = {
        id: Date.now().toString(),
        content: errorMessage,
        isUser: false,
        isError: true,
        timestamp: new Date(),
      };
      addMessages(ErrorDisplay);
      weboscketRef.current = connectWebsocket();
      return;
    }

    const session = await getSession();
    if (!session) {
      console.log("인증 세션이 없습니다.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      isError: false,
      timestamp: new Date(),
    };

    addMessages(userMessage);
    setInputValue("");

    try {
      await axios.post(
        "/api/fastapi/websocket/llm/start",
        {
          clientId,
          prompt: inputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageWithWebsocket();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-600">
      {/* 채팅 헤더 */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-600">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-white">AI 어시스턴트</h3>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isUser ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg text-sm",
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-700 text-white",
                message.isError && "border border-red-500",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {buffer ? (
          <div
            className={cn(
              "max-w-[80%] p-3 rounded-lg text-sm",
              "bg-gray-700 text-white",
            )}
          >
            {buffer}
          </div>
        ) : (
          <></>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-3 border-t border-gray-600">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary"
            disabled={isPending}
          />
          <Button
            onClick={handleSendMessageWithWebsocket}
            size="icon"
            className="bg-primary hover:bg-primary/90"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
