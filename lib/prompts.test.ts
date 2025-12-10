import { systemPrompt } from './prompts';

describe('systemPrompt', () => {
  it('should be a non-empty string', () => {
    expect(systemPrompt).toBeTruthy();
    expect(typeof systemPrompt).toBe('string');
    expect(systemPrompt.length).toBeGreaterThan(0);
  });

  it('should contain key guidance about being a flower-remedy advisor', () => {
    expect(systemPrompt).toContain('flower-remedy');
    expect(systemPrompt).toContain('advisor');
  });

  it('should emphasize natural conversation', () => {
    expect(systemPrompt).toContain('conversation');
  });

  it('should mention not giving medical advice', () => {
    expect(systemPrompt).toContain('medical advice');
  });

  it('should instruct to recommend remedies based on context', () => {
    expect(systemPrompt).toContain('recommend');
    expect(systemPrompt).toContain('remedies');
  });
});
