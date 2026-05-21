import { render, screen, act } from '@testing-library/react';
import { AnimatedCounter } from '../AnimatedCounter';
import { vi, expect, test, describe } from 'vitest';

// Mocking useInView to return true so it starts counting
vi.mock('@/hooks/useInView', () => ({
  useInView: () => true,
}));

// Mocking useCountUp to just return the value for simple testing if needed,
// but we'll try to let the actual hook work if possible.
// Actually, useCountUp might be complex to test with real timers.
// Let's check what useCountUp does.

describe('AnimatedCounter', () => {
  test('renders the value after animation', async () => {
    render(<AnimatedCounter value={100} duration={100} />);
    
    // We wait for the animation to "complete"
    // Since useCountUp uses requestAnimationFrame, we might need to wait or mock it.
    // For this test, we'll just check if it renders *something* initially and then the final value.
    const element = await screen.findByText(/100/);
    expect(element).toBeInTheDocument();
  });

  test('displays prefix and suffix', () => {
    render(<AnimatedCounter value={50} prefix="$" suffix="k" />);
    expect(screen.getByText(/\$50k/)).toBeInTheDocument();
  });
});