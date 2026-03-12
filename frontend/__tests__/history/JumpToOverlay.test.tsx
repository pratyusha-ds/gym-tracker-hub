import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JumpToOverlay } from '@/components/history/calendar/JumpToOverlay';

describe('JumpToOverlay Component', () => {
  const defaultProps = {
    showJumpTo: true,
    setShowJumpTo: vi.fn(),
    selMonth: 2,
    setSelMonth: vi.fn(),
    selYear: 2026,
    setSelYear: vi.fn(),
    onConfirm: vi.fn(),
  };

  it('renders all months', () => {
    render(<JumpToOverlay {...defaultProps} />);
    expect(screen.getByText(/jan/i)).toBeInTheDocument();
    expect(screen.getByText(/dec/i)).toBeInTheDocument();
  });

  it('calls setSelMonth when a month is clicked', () => {
    render(<JumpToOverlay {...defaultProps} />);

    const janBtn = screen.getByText(/jan/i);

    fireEvent.click(janBtn);
    expect(defaultProps.setSelMonth).toHaveBeenCalledWith(0);
  });

  it('calls onConfirm when View Calendar is clicked', () => {
    render(<JumpToOverlay {...defaultProps} />);

    const confirmBtn = screen.getByText(/view calendar/i);

    fireEvent.click(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('opens year dropdown and selects a year', () => {
    render(<JumpToOverlay {...defaultProps} />);

    const yearBtn = screen.getByText('2026');
    fireEvent.click(yearBtn);
    const yearOptions = screen.getAllByText('2025');
    fireEvent.click(yearOptions[0]);

    expect(defaultProps.setSelYear).toHaveBeenCalledWith(2025);
  });

  it('calls setShowJumpTo(false) when close or cancel is clicked', () => {
    render(<JumpToOverlay {...defaultProps} />);

    const cancelBtn = screen.getByText(/cancel/i);
    fireEvent.click(cancelBtn);

    expect(defaultProps.setShowJumpTo).toHaveBeenCalledWith(false);
  });
});
