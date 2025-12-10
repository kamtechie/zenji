// Mock the OpenAI client before importing
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      embeddings: {
        create: jest.fn()
      }
    }))
  };
});

import { embed, openai } from './openai';

describe('OpenAI utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('openai client', () => {
    it('should be initialized', () => {
      expect(openai).toBeDefined();
    });
  });

  describe('embed function', () => {
    it('should return embedding vector for given text', async () => {
      const mockEmbedding = new Array(3072).fill(0).map((_, i) => i * 0.001);
      const mockResponse = {
        data: [{ embedding: mockEmbedding }]
      };

      (openai.embeddings.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await embed('test text');

      expect(openai.embeddings.create).toHaveBeenCalledWith({
        model: 'text-embedding-3-large',
        input: 'test text'
      });
      expect(result).toEqual(mockEmbedding);
      expect(result).toHaveLength(3072);
    });

    it('should handle empty text', async () => {
      const mockEmbedding = new Array(3072).fill(0);
      const mockResponse = {
        data: [{ embedding: mockEmbedding }]
      };

      (openai.embeddings.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await embed('');

      expect(openai.embeddings.create).toHaveBeenCalledWith({
        model: 'text-embedding-3-large',
        input: ''
      });
      expect(result).toEqual(mockEmbedding);
    });

    it('should handle long text', async () => {
      const longText = 'word '.repeat(1000);
      const mockEmbedding = new Array(3072).fill(0);
      const mockResponse = {
        data: [{ embedding: mockEmbedding }]
      };

      (openai.embeddings.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await embed(longText);

      expect(openai.embeddings.create).toHaveBeenCalledWith({
        model: 'text-embedding-3-large',
        input: longText
      });
      expect(result).toBeDefined();
    });
  });
});
