import axios from "@/query/axios";
import { ChatbotResponse } from "@/types/chatbot";
import { useMutation } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const chatbotPath = "/llm";

export function useChatbotAsk() {
  return useMutation({
    mutationFn: async (message: string) => {
      const requestUrl = chatbotPath + "/ask";
      const session = await getSession();

      if (!session) {
        throw Error("세션이 없습니다.");
      }

      const res = await axios.post(
        requestUrl,
        { message },
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        },
      );

      return res.data as ChatbotResponse;
    },
  });
}
