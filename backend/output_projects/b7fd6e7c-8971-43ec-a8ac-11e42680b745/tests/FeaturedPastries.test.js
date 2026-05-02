import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FeaturedPastries from '../FeaturedPastries';

describe('FeaturedPastries Component', () => {
  test('renders 3 signature pastries in a responsive grid', () => {
    render(<FeaturedPastries />);
    const pastryItems = screen.getAllByRole('listitem');
    expect(pastryItems).toHaveLength(3);
    pastryItems.forEach(item => {
      const img = item.querySelector('img');
      expect(img).toHaveAttribute('src');
      expect(img).toHaveAttribute('alt');
    });
  });

  test('uses responsive grid layout', () => {
    render(<FeaturedPastries />);
    const grid = screen.getByRole('list');
    expect(grid).toHaveClass('responsive-grid');
  });
});