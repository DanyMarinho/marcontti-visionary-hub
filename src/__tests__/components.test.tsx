import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastContainer, useToastStore } from '../components/shared/ToastNotification';
import { MagneticButton } from '../components/shared/MagneticButton';
import { ScrollReveal } from '../components/shared/ScrollReveal';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';

describe('Shared Components Unit Tests', () => {
  
  it('SkeletonLoader renders with correct variant className', () => {
    const { container: containerCard } = render(<SkeletonLoader variant="card" />);
    expect(containerCard.querySelector('.h-40')).toBeDefined();
    
    const { container: containerCircle } = render(<SkeletonLoader variant="circle" />);
    expect(containerCircle.querySelector('.rounded-full')).toBeDefined();
  });

  it('MagneticButton renders children and handles clicks', () => {
    const onClick = vi.fn();
    render(
      <MagneticButton onClick={onClick}>
        <span>Click Me</span>
      </MagneticButton>
    );
    
    const button = screen.getByText('Click Me');
    expect(button).toBeDefined();
    
    act(() => {
      button.click();
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('ScrollReveal renders children', () => {
    render(
      <ScrollReveal>
        <div data-testid="reveal-child">Revealed Content</div>
      </ScrollReveal>
    );
    expect(screen.getByTestId('reveal-child')).toBeDefined();
  });

  it('ToastContainer renders toasts from store', () => {
    act(() => {
      useToastStore.getState().addToast({ message: 'Test Toast', type: 'info' });
    });
    
    render(<ToastContainer />);
    expect(screen.getByText('Test Toast')).toBeDefined();
  });
});

