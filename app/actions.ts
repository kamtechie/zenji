"use server";

import { openai } from "@/lib/openai";
import { retrieveRelevantRemedies } from "@/lib/rag";
import { systemPrompt } from "@/lib/prompts";

export async function sendMessage(messages: any[]) {
  const lastMsg = messages[messages.length - 1]?.content || "";
  const retrieved = await retrieveRelevantRemedies(lastMsg);

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo", // Using a valid model name as gpt-4.1 is not standard
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
      {
        role: "system",
        content: `Relevant remedy excerpts:\n${retrieved.join("\n\n")}`
      }
    ]
  });

  return response.choices[0].message;
}
