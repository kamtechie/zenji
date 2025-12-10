// Mock dependencies before imports
jest.mock('@/lib/openai', () => ({
  openai: {
    responses: {
      create: jest.fn()
    }
  },
  embed: jest.fn()
}));

jest.mock('@/lib/rag', () => ({
  retrieveRelevantRemedies: jest.fn()
}));

import { sendMessage } from './actions';
import { openai } from '@/lib/openai';
import { retrieveRelevantRemedies } from '@/lib/rag';
import { systemPrompt } from '@/lib/prompts';

describe('sendMessage', () => {
  const mockOpenai = openai as jest.Mocked<typeof openai>;
  const mockRetrieveRelevantRemedies = retrieveRelevantRemedies as jest.MockedFunction<typeof retrieveRelevantRemedies>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send message and get response', async () => {
    const mockRemedies = [
      'Remedy 1: For anxiety and stress',
      'Remedy 2: For emotional balance'
    ];

    mockRetrieveRelevantRemedies.mockResolvedValue(mockRemedies);
    
    (mockOpenai.responses as any) = {
      create: jest.fn().mockResolvedValue({
        output_text: 'I recommend trying Remedy 1 for your anxiety.',
        output: [{ content: [{ text: 'Alternative text' }] }]
      })
    };

    const messages = [
      { role: 'user' as const, content: 'I feel anxious' }
    ];

    const result = await sendMessage(messages);

    expect(mockRetrieveRelevantRemedies).toHaveBeenCalledWith('I feel anxious');
    expect(mockOpenai.responses.create).toHaveBeenCalledWith({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: systemPrompt },
        ...messages,
        {
          role: 'system',
          content: expect.stringContaining('Relevant remedy excerpts:')
        }
      ]
    });
    expect(result.role).toBe('assistant');
    expect(result.content).toBe('I recommend trying Remedy 1 for your anxiety.');
  });

  it('should handle multiple messages in conversation', async () => {
    const mockRemedies = ['Remedy 1'];

    mockRetrieveRelevantRemedies.mockResolvedValue(mockRemedies);
    
    (mockOpenai.responses as any) = {
      create: jest.fn().mockResolvedValue({
        output_text: 'Follow-up response',
        output: []
      })
    };

    const messages = [
      { role: 'user' as const, content: 'I feel anxious' },
      { role: 'assistant' as const, content: 'I understand. Can you tell me more?' },
      { role: 'user' as const, content: 'It happens mostly in the mornings' }
    ];

    const result = await sendMessage(messages);

    expect(mockRetrieveRelevantRemedies).toHaveBeenCalledWith('It happens mostly in the mornings');
    expect(result.role).toBe('assistant');
  });

  it('should include remedies in system message', async () => {
    const mockRemedies = [
      'Remedy A: Description A',
      'Remedy B: Description B'
    ];

    mockRetrieveRelevantRemedies.mockResolvedValue(mockRemedies);
    
    (mockOpenai.responses as any) = {
      create: jest.fn().mockResolvedValue({
        output_text: 'Response',
        output: []
      })
    };

    await sendMessage([{ role: 'user', content: 'test' }]);

    const callArgs = (mockOpenai.responses.create as jest.Mock).mock.calls[0][0];
    const systemMessage = callArgs.input[callArgs.input.length - 1];

    expect(systemMessage.role).toBe('system');
    expect(systemMessage.content).toContain('Remedy A: Description A');
    expect(systemMessage.content).toContain('Remedy B: Description B');
  });

  it('should handle empty message array', async () => {
    mockRetrieveRelevantRemedies.mockResolvedValue([]);
    
    (mockOpenai.responses as any) = {
      create: jest.fn().mockResolvedValue({
        output_text: 'Hello! How can I help you?',
        output: []
      })
    };

    const result = await sendMessage([]);

    expect(mockRetrieveRelevantRemedies).toHaveBeenCalledWith('');
    expect(result.role).toBe('assistant');
  });

  it('should fallback to nested output text when output_text is null', async () => {
    mockRetrieveRelevantRemedies.mockResolvedValue([]);
    
    (mockOpenai.responses as any) = {
      create: jest.fn().mockResolvedValue({
        output_text: null,
        output: [{ content: [{ text: 'Fallback text from nested structure' }] }]
      })
    };

    const result = await sendMessage([{ role: 'user', content: 'test' }]);

    expect(result.content).toBe('Fallback text from nested structure');
  });

  it('should return empty string when no text is available', async () => {
    mockRetrieveRelevantRemedies.mockResolvedValue([]);
    
    (mockOpenai.responses as any) = {
      create: jest.fn().mockResolvedValue({
        output_text: null,
        output: []
      })
    };

    const result = await sendMessage([{ role: 'user', content: 'test' }]);

    expect(result.content).toBe('');
  });
});
