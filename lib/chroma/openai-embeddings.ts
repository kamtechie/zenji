import { OpenAI } from "openai";
import { EmbeddingFunction } from "chromadb";

// NOTE: The 'EmbeddingFunction' type generally expects the 'generate' method.
// You might need to use 'implements' if your TypeScript is strict.

export class CustomOpenAIEmbeddingFunction implements EmbeddingFunction {
    private openaiClient: OpenAI;
    private modelName: string;

    constructor(apiKey: string, modelName: string) {
        this.openaiClient = new OpenAI({ apiKey });
        this.modelName = modelName;

    }

    // This is the core method required by Chroma
    public async generate(texts: string[]): Promise<number[][]> {
        if (texts.length === 0) {
            return [];
        }

        // 1. Call the official OpenAI API
        const response = await this.openaiClient.embeddings.create({
            model: this.modelName,
            input: texts,
        });

        // 2. Extract and return the embeddings array (a 2D array of numbers)
        return response.data.map(item => item.embedding);
    }
}