"use server";

import { openai } from "@/lib/openai";
import { retrieveRelevantRemedies } from "@/lib/rag";
import { systemPrompt } from "@/lib/prompts";
import { ChatMessage } from "@/lib/types";

export async function sendMessage(messages: ChatMessage[]) {
  const lastMsg = messages[messages.length - 1]?.content || "";
  const retrieved = await retrieveRelevantRemedies(lastMsg);

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      ...messages,
      {
        role: "system",
        content: `Relevant remedy excerpts:\n${retrieved.join("\n\n")}`
      }
    ]
  });

  return {
    role: "assistant",
    content:
      // Convenience field provided by the Responses API
      response.output_text ?? response.output?.[0]?.content?.[0]?.text ?? ""
  } satisfies ChatMessage;
}
