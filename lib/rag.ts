import { embed } from "./openai";
import { getRemedyCollection } from "./chroma";

export async function retrieveRelevantRemedies(query: string) {
  const collection = await getRemedyCollection();
  const vector = await embed(query);

  const results = await collection.query({
    queryEmbeddings: [vector],
    nResults: 5
  });

  return results.documents?.[0] || [];
}
