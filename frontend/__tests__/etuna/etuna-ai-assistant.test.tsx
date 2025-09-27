/**
 * Etuna AI Assistant Tests
 * 
 * Comprehensive tests for the AI assistant functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import EtunaAIAssistant from '@/app/guest/etuna/ai-assistant-new/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/guest/etuna/ai-assistant-new',
}));

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Etuna AI Assistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AI assistant title and description', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('Etuna AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Enhanced AI concierge with LangGraph & Pydantic architecture')).toBeInTheDocument();
  });

  it('displays welcome message and capabilities', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('Welcome to Etuna Guesthouse & Tours!')).toBeInTheDocument();
    expect(screen.getByText(/I'm here to help you with bookings, tours, dining, and any questions about your stay/)).toBeInTheDocument();
  });

  it('shows quick actions buttons', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('Room Availability')).toBeInTheDocument();
    expect(screen.getByText('Restaurant Menu')).toBeInTheDocument();
    expect(screen.getByText('Tour Information')).toBeInTheDocument();
    expect(screen.getByText('Spa Services')).toBeInTheDocument();
    expect(screen.getByText('Conference Facilities')).toBeInTheDocument();
    expect(screen.getByText('Local Attractions')).toBeInTheDocument();
  });

  it('displays AI capabilities panel', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('AI Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
    expect(screen.getByText('Voice Recognition')).toBeInTheDocument();
    expect(screen.getByText('Context Awareness')).toBeInTheDocument();
    expect(screen.getByText('Multi-language Support')).toBeInTheDocument();
  });

  it('shows system status indicators', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('LangGraph Workflow Active')).toBeInTheDocument();
    expect(screen.getByText('Enhanced AI with double-booking prevention and escalation handling')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('Etuna Guesthouse')).toBeInTheDocument();
    expect(screen.getByText('5544 Valley Street, Ongwediva')).toBeInTheDocument();
    expect(screen.getByText('+264 65 231 177')).toBeInTheDocument();
    expect(screen.getByText('24/7 Front Desk')).toBeInTheDocument();
  });

  it('shows property statistics', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('35 Rooms Total')).toBeInTheDocument();
    expect(screen.getByText('7 Confirmed Bookings')).toBeInTheDocument();
    expect(screen.getByText('35 Rooms Available')).toBeInTheDocument();
  });

  it('renders chat interface elements', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('Ask me anything about your stay...')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('displays AI status indicators', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('LangGraph AI Agent')).toBeInTheDocument();
    expect(screen.getByText('Calendar Status')).toBeInTheDocument();
    expect(screen.getByText('Today: 2024-12-20')).toBeInTheDocument();
  });

  it('shows platform branding', () => {
    render(<EtunaAIAssistant />);
    
    expect(screen.getByText('Buffr Host - Hospitality Ecosystem Management Platform')).toBeInTheDocument();
  });
});
