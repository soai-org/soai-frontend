import { create } from "zustand";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isError: boolean;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  buffer: string;
  isPending: boolean;
}

interface ChatActions {
  addMessages: (message: Message) => void;
  setBuffer: (buffer: ChatState["buffer"]) => void;
  resetBuffer: () => void;
  setPending: (now: ChatState["isPending"]) => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: "1",
      content:
        "안녕하세요! 보조 진단 챗봇입니다. 궁금한 점이 있으시면 언제든 물어보세요.",
      isUser: false,
      isError: false,
      timestamp: new Date(),
    },
  ],
  buffer: "",
  isPending: false,
  addMessages: (message) => {
    set((pre) => ({ messages: [...pre.messages, message], buffer: "" }));
  },
  setBuffer: (buffer: string) => {
    set((pre) => ({ buffer: pre.buffer + " " + buffer }));
  },
  resetBuffer: () => {
    set(() => ({ buffer: "" }));
  },
  setPending: (now) => {
    set(() => ({ isPending: now }));
  },
}));
