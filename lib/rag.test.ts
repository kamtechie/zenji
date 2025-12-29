// Mock dependencies before imports
jest.mock('./openai', () => ({
  embed: jest.fn(),
  openai: {}
}));

jest.mock('./chroma/client', () => ({
  getRemedyCollection: jest.fn(),
  chroma: {}
}));

import { retrieveRelevantRemedies } from './rag';
import { embed } from './openai';
import { getRemedyCollection } from './chroma/client';

describe('retrieveRelevantRemedies', () => {
  const mockEmbed = embed as jest.MockedFunction<typeof embed>;
  const mockGetRemedyCollection = getRemedyCollection as jest.MockedFunction<typeof getRemedyCollection>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve relevant remedies for a query', async () => {
    const mockEmbedding = new Array(3072).fill(0).map((_, i) => i * 0.001);
    const mockRemedies = [
      'Remedy 1: Description of remedy 1',
      'Remedy 2: Description of remedy 2',
      'Remedy 3: Description of remedy 3'
    ];

    const mockCollection = {
      query: jest.fn().mockResolvedValue({
        documents: [mockRemedies]
      })
    };

    mockEmbed.mockResolvedValue(mockEmbedding);
    mockGetRemedyCollection.mockResolvedValue(mockCollection as any);

    const result = await retrieveRelevantRemedies('I feel anxious');

    expect(mockEmbed).toHaveBeenCalledWith('I feel anxious');
    expect(mockGetRemedyCollection).toHaveBeenCalled();
    expect(mockCollection.query).toHaveBeenCalledWith({
      queryEmbeddings: [mockEmbedding],
      nResults: 5
    });
    expect(result).toEqual(mockRemedies);
    expect(result).toHaveLength(3);
  });

  it('should return empty array when no documents found', async () => {
    const mockEmbedding = new Array(3072).fill(0);

    const mockCollection = {
      query: jest.fn().mockResolvedValue({
        documents: null
      })
    };

    mockEmbed.mockResolvedValue(mockEmbedding);
    mockGetRemedyCollection.mockResolvedValue(mockCollection as any);

    const result = await retrieveRelevantRemedies('test query');

    expect(result).toEqual([]);
  });

  it('should return empty array when documents array is empty', async () => {
    const mockEmbedding = new Array(3072).fill(0);

    const mockCollection = {
      query: jest.fn().mockResolvedValue({
        documents: []
      })
    };

    mockEmbed.mockResolvedValue(mockEmbedding);
    mockGetRemedyCollection.mockResolvedValue(mockCollection as any);

    const result = await retrieveRelevantRemedies('test query');

    expect(result).toEqual([]);
  });

  it('should handle empty query string', async () => {
    const mockEmbedding = new Array(3072).fill(0);
    const mockRemedies = ['Default remedy'];

    const mockCollection = {
      query: jest.fn().mockResolvedValue({
        documents: [mockRemedies]
      })
    };

    mockEmbed.mockResolvedValue(mockEmbedding);
    mockGetRemedyCollection.mockResolvedValue(mockCollection as any);

    const result = await retrieveRelevantRemedies('');

    expect(mockEmbed).toHaveBeenCalledWith('');
    expect(result).toEqual(mockRemedies);
  });

  it('should request exactly 5 results', async () => {
    const mockEmbedding = new Array(3072).fill(0);
    const mockRemedies = ['Remedy 1', 'Remedy 2', 'Remedy 3', 'Remedy 4', 'Remedy 5'];

    const mockCollection = {
      query: jest.fn().mockResolvedValue({
        documents: [mockRemedies]
      })
    };

    mockEmbed.mockResolvedValue(mockEmbedding);
    mockGetRemedyCollection.mockResolvedValue(mockCollection as any);

    await retrieveRelevantRemedies('test');

    expect(mockCollection.query).toHaveBeenCalledWith(
      expect.objectContaining({
        nResults: 5
      })
    );
  });
});
