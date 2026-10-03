import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders input with label and placeholder', () => {
    render(
      <Input
        label="Email Address"
        placeholder="candidate@hireflow.io"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('candidate@hireflow.io')).toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(
      <Input
        label="Password"
        error="Password must be at least 8 characters"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('captures typed text changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input label="Job Title" onChange={handleChange} />);
    const inputElement = screen.getByLabelText(/job title/i);

    await user.type(inputElement, 'Engineer');
    expect(handleChange).toHaveBeenCalled();
  });
});
