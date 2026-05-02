import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IndexPage from '../index.js';

test('displays menu container', () => {
  render(<IndexPage />);
  expect(screen.getByRole('menu')).toBeInTheDocument();
});

test('shows at least three menu items', () => {
  render(<IndexPage />);
  expect(screen.getAllByRole('menuitem')).toHaveLength(3);
});

test('contains home menu item', () => {
  render(<IndexPage />);
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});