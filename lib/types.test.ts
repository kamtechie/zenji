import { ChatMessage } from './types';

describe('ChatMessage type', () => {
  it('should accept valid system message', () => {
    const message: ChatMessage = {
      role: 'system',
      content: 'Test system message'
    };
    expect(message.role).toBe('system');
    expect(message.content).toBe('Test system message');
  });

  it('should accept valid user message', () => {
    const message: ChatMessage = {
      role: 'user',
      content: 'Test user message'
    };
    expect(message.role).toBe('user');
    expect(message.content).toBe('Test user message');
  });

  it('should accept valid assistant message', () => {
    const message: ChatMessage = {
      role: 'assistant',
      content: 'Test assistant message'
    };
    expect(message.role).toBe('assistant');
    expect(message.content).toBe('Test assistant message');
  });

  it('should handle empty content', () => {
    const message: ChatMessage = {
      role: 'user',
      content: ''
    };
    expect(message.content).toBe('');
  });

  it('should handle multiline content', () => {
    const message: ChatMessage = {
      role: 'assistant',
      content: 'Line 1\nLine 2\nLine 3'
    };
    expect(message.content).toContain('\n');
    expect(message.content.split('\n')).toHaveLength(3);
  });
});
