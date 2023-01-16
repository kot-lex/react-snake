import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const scoreElement = screen.getByText(/score/i);
  expect(scoreElement).toBeInTheDocument();
});
