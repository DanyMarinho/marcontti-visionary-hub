import { render, screen } from '@testing-library/react';
import { AnimatedCounter } from '../AnimatedCounter';
import { vi, expect, test, describe } from 'vitest';

// Mocking useInView to return true so it starts counting
vi.mock('@/hooks/useInView', () => ({
  useInView: () => true,
}));

// Mocking useCountUp to just return the value directly for tests
vi.mock('@/hooks/useCountUp', () => ({
  useCountUp: (value: number) => value.toString(),
}));

describe('AnimatedCounter', () => {
  test('renders the value', () => {
    render(<AnimatedCounter value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('displays prefix and suffix', () => {
    render(<AnimatedCounter value={50} prefix="$" suffix="k" />);
    // Testing Library getByText might fail if separated in spans, but AnimatedCounter puts them in one span if not careful
    // Actually, AnimatedCounter does: {prefix}{formattedValue}{suffix} inside one span.
    expect(screen.getByText('$50k')).toBeInTheDocument();
  });
});