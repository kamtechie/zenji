import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPage from './page';
import { sendMessage } from './actions';

// Mock the sendMessage action
jest.mock('./actions', () => ({
  sendMessage: jest.fn()
}));

const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the chat page', () => {
    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...");
    expect(input).toBeInTheDocument();
  });

  it('should display an empty message list initially', () => {
    const { container } = render(<ChatPage />);
    
    // Check that the message container exists and has no child elements with text
    const messageContainer = container.querySelector('.space-y-2');
    expect(messageContainer).toBeInTheDocument();
    expect(messageContainer?.children.length).toBe(0);
  });

  it('should add user message when Enter is pressed', async () => {
    mockSendMessage.mockResolvedValue({
      role: 'assistant',
      content: 'Hello! How can I help you?'
    });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, 'I feel anxious{Enter}');

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith([
        { role: 'user', content: 'I feel anxious' }
      ]);
    });
  });

  it('should display user and assistant messages', async () => {
    mockSendMessage.mockResolvedValue({
      role: 'assistant',
      content: 'I understand. Can you tell me more?'
    });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, 'I feel anxious{Enter}');

    await waitFor(() => {
      expect(screen.getByText('I feel anxious')).toBeInTheDocument();
      expect(screen.getByText('I understand. Can you tell me more?')).toBeInTheDocument();
    });
  });

  it('should clear input after sending message', async () => {
    mockSendMessage.mockResolvedValue({
      role: 'assistant',
      content: 'Response'
    });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, 'Test message');
    expect(input.value).toBe('Test message');
    
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should not send empty or whitespace-only messages', async () => {
    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, '   {Enter}');

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('should handle multiple messages in sequence', async () => {
    mockSendMessage
      .mockResolvedValueOnce({
        role: 'assistant',
        content: 'First response'
      })
      .mockResolvedValueOnce({
        role: 'assistant',
        content: 'Second response'
      });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, 'First message{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('First response')).toBeInTheDocument();
    });

    await userEvent.type(input, 'Second message{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Second response')).toBeInTheDocument();
    });

    expect(mockSendMessage).toHaveBeenCalledTimes(2);
  });

  it('should pass all previous messages to sendMessage', async () => {
    mockSendMessage
      .mockResolvedValueOnce({
        role: 'assistant',
        content: 'First response'
      })
      .mockResolvedValueOnce({
        role: 'assistant',
        content: 'Second response'
      });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, 'First message{Enter}');
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenNthCalledWith(1, [
        { role: 'user', content: 'First message' }
      ]);
    });

    await userEvent.type(input, 'Second message{Enter}');

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenNthCalledWith(2, [
        { role: 'user', content: 'First message' },
        { role: 'assistant', content: 'First response' },
        { role: 'user', content: 'Second message' }
      ]);
    });
  });

  it('should apply correct CSS classes to messages', async () => {
    mockSendMessage.mockResolvedValue({
      role: 'assistant',
      content: 'Assistant reply'
    });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText("Tell me what's going on...") as HTMLInputElement;
    
    await userEvent.type(input, 'User message{Enter}');

    await waitFor(() => {
      const userMessage = screen.getByText('User message');
      const assistantMessage = screen.getByText('Assistant reply');
      
      expect(userMessage.className).toBe('user');
      expect(assistantMessage.className).toBe('assistant');
    });
  });
});
