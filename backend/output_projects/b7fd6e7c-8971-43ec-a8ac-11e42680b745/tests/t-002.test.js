import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../../src/components/Hero';


test('displays bakery tagline', () => {
  render(<Hero />);
  expect(screen.getByText(/fresh baked goods/i)).toBeInTheDocument();
});

test('includes View Menu call to action', () => {
  render(<Hero />);
  expect(screen.getByRole('button', { name: /View Menu/i })).toBeInTheDocument();
});

test('renders full-width hero section', () => {
  render(<Hero />);
  const heroSection = screen.getByTestId('hero-section');
  expect(heroSection).toHaveStyle({ width: '100%' });
});