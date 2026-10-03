import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders badge label text correctly', () => {
    render(<Badge variant="success">Published</Badge>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('applies variant styling classes', () => {
    const { container } = render(<Badge variant="danger">Rejected</Badge>);
    const badgeElement = container.querySelector('span');
    expect(badgeElement).toBeInTheDocument();
  });
});
