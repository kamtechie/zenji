// Mock chromadb before importing
jest.mock('chromadb', () => ({
  ChromaClient: jest.fn().mockImplementation(() => ({
    getOrCreateCollection: jest.fn()
  }))
}));

// Mock the custom embedding function before importing
jest.mock('./openai-embeddings', () => ({
  CustomOpenAIEmbeddingFunction: jest.fn().mockImplementation(() => ({
    generate: jest.fn()
  }))
}));

// Set environment variables before importing the module
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.OPENAI_EMBED_MODEL = 'text-embedding-3-large';
process.env.CHROMA_COLLECTION_NAME = 'test-collection';
process.env.CHROMA_URL = 'http://localhost:8000';

import { chroma, getRemedyCollection } from './client';

describe('ChromaDB client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('chroma client', () => {
    it('should be initialized', () => {
      expect(chroma).toBeDefined();
    });
  });

  describe('getRemedyCollection', () => {
    it('should get or create collection with correct name and embedding function', async () => {
      const mockCollection = {
        name: 'test-collection',
        query: jest.fn()
      };

      (chroma.getOrCreateCollection as jest.Mock).mockResolvedValue(mockCollection);

      const collection = await getRemedyCollection();

      expect(chroma.getOrCreateCollection).toHaveBeenCalledWith({
        name: 'test-collection',
        embeddingFunction: expect.any(Object)
      });
      expect(collection).toBe(mockCollection);
    });

    it('should return the same collection on multiple calls', async () => {
      const mockCollection = {
        name: 'test-collection',
        query: jest.fn()
      };

      (chroma.getOrCreateCollection as jest.Mock).mockResolvedValue(mockCollection);

      const collection1 = await getRemedyCollection();
      const collection2 = await getRemedyCollection();

      expect(collection1).toBe(collection2);
      expect(chroma.getOrCreateCollection).toHaveBeenCalledTimes(2);
    });
  });
});
