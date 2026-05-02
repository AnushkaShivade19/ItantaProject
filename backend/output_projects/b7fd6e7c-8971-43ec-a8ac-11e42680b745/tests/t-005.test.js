import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from 'src/pages/about';

describe('About Page', () => {
  it('should display about us section', () => {
    render(<About />);
    expect(screen.getByText(/about us/i)).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    render(<About />);
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});