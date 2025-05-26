import { render, screen } from '@testing-library/react';
import { AIMessage } from '../AIMessage';

describe('AIMessage', () => {
  const mockProps = {
    content: 'Test message',
    isAI: true,
    timestamp: new Date('2024-03-15T12:00:00'),
  };

  it('renders AI message correctly', () => {
    render(<AIMessage {...mockProps} />);
    
    expect(screen.getByTestId('ai-message')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('12:00'))).toBeInTheDocument();
  });

  it('renders user message correctly', () => {
    render(<AIMessage {...mockProps} isAI={false} />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<AIMessage {...mockProps} className={customClass} />);
    
    expect(screen.getByTestId('ai-message')).toHaveClass(customClass);
  });
}); 