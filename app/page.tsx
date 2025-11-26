"use client";

import { useState } from "react";
import { sendMessage } from "./actions";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);

  async function handleSend(text: string) {
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);

    const reply = await sendMessage(newMessages);
    setMessages([...newMessages, reply]);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.content}
          </div>
        ))}
      </div>

      <input
        className="border rounded p-2 w-full"
        placeholder="Tell me what's going on..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            handleSend(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
