import { CustomOpenAIEmbeddingFunction } from './openai-embeddings';
import { OpenAI } from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
  const mockCreate = jest.fn();
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      embeddings: {
        create: mockCreate
      }
    })),
    mockCreate
  };
});

describe('CustomOpenAIEmbeddingFunction', () => {
  let embeddingFunction: CustomOpenAIEmbeddingFunction;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    embeddingFunction = new CustomOpenAIEmbeddingFunction('test-api-key', 'text-embedding-3-large');
    // Access the mock through the instance
    mockCreate = (embeddingFunction as any).openaiClient.embeddings.create;
  });

  describe('generate', () => {
    it('should return empty array for empty input', async () => {
      const result = await embeddingFunction.generate([]);
      expect(result).toEqual([]);
    });

    it('should generate embeddings for single text', async () => {
      const mockEmbeddings = [[0.1, 0.2, 0.3]];
      mockCreate.mockResolvedValue({
        data: [{ embedding: mockEmbeddings[0] }]
      });

      const result = await embeddingFunction.generate(['test text']);

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'text-embedding-3-large',
        input: ['test text']
      });
      expect(result).toEqual(mockEmbeddings);
    });

    it('should generate embeddings for multiple texts', async () => {
      const mockEmbeddings = [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
        [0.7, 0.8, 0.9]
      ];
      mockCreate.mockResolvedValue({
        data: mockEmbeddings.map(emb => ({ embedding: emb }))
      });

      const result = await embeddingFunction.generate(['text1', 'text2', 'text3']);

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'text-embedding-3-large',
        input: ['text1', 'text2', 'text3']
      });
      expect(result).toEqual(mockEmbeddings);
      expect(result).toHaveLength(3);
    });

    it('should use the specified model name', async () => {
      const customModel = 'custom-embedding-model';
      const customEmbeddingFunction = new CustomOpenAIEmbeddingFunction('test-key', customModel);
      const customMockCreate = (customEmbeddingFunction as any).openaiClient.embeddings.create;
      
      customMockCreate.mockResolvedValue({
        data: [{ embedding: [0.1, 0.2] }]
      });

      await customEmbeddingFunction.generate(['test']);

      expect(customMockCreate).toHaveBeenCalledWith({
        model: customModel,
        input: ['test']
      });
    });

    it('should handle large batch of texts', async () => {
      const texts = Array.from({ length: 100 }, (_, i) => `text${i}`);
      const mockEmbeddings = Array.from({ length: 100 }, () => [0.1, 0.2, 0.3]);
      
      mockCreate.mockResolvedValue({
        data: mockEmbeddings.map(emb => ({ embedding: emb }))
      });

      const result = await embeddingFunction.generate(texts);

      expect(result).toHaveLength(100);
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'text-embedding-3-large',
        input: texts
      });
    });
  });
});
