import { render, screen } from '@testing-library/react';
import { GlassCard } from '../GlassCard';
import { expect, test, describe } from 'vitest';

describe('GlassCard', () => {
  test('renders children correctly', () => {
    render(
      <GlassCard>
        <div data-testid="child">Test Child</div>
      </GlassCard>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('applies additional className', () => {
    const { container } = render(
      <GlassCard className="custom-class">
        Content
      </GlassCard>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});