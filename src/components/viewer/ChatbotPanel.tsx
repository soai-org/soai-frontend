"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatbotAsk } from "@/query/ai/chatbot";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isError: boolean;
  timestamp: Date;
}

export function ChatbotPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "안녕하세요! 보조 진단 챗봇입니다. 궁금한 점이 있으시면 언제든 물어보세요.",
      isUser: false,
      isError: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: ask, isPending } = useChatbotAsk();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      isError: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

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
      setMessages((prev) => [...prev, chatbotResponse]);
    } catch (error) {
      console.log(error);

      const ErrorDisplay: Message = {
        id: Date.now().toString(),
        content: "오류, 질문을 다시 해주세요.",
        isUser: false,
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, ErrorDisplay]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
            onClick={handleSendMessage}
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
