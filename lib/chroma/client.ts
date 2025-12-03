import { ChromaClient,  } from "chromadb";
import { CustomOpenAIEmbeddingFunction } from "./openai-embeddings";

const embeddingFunction = new CustomOpenAIEmbeddingFunction(process.env.OPENAI_API_KEY!, process.env.OPENAI_EMBED_MODEL!);

export const chroma = new ChromaClient({
  path: process.env.CHROMA_URL || "http://localhost:8000"
});

export async function getRemedyCollection() {
  return chroma.getOrCreateCollection({
    name: process.env.CHROMA_COLLECTION_NAME!,
    embeddingFunction: embeddingFunction
  });
}
