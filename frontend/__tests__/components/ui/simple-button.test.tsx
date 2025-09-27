/**
 * Simple Button Component Test
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Test that we can import and render a simple button
describe('Simple Button Test', () => {
  it('renders a basic button', () => {
    render(<button>Click me</button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click me</button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});