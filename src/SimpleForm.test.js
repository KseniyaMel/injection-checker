import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SimpleForm from './SimpleForm';

describe('SimpleForm Component', () => {
  test('DOMPurify Validation - Valid Input', () => {
    render(<SimpleForm />);
    const input = screen.getByLabelText('Simple Form:');
    fireEvent.change(input, { target: { value: 'Safe input' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('valid')).toBeInTheDocument();
  });

  test('DOMPurify Validation - Invalid Input', () => {
    render(<SimpleForm />);
    const input = screen.getByLabelText('Simple Form:');
    fireEvent.change(input, { target: { value: '<script>alert("XSS Attack!")</script>' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('not valid')).toBeInTheDocument();
  });

  test('xssFilters Validation - Valid Input', () => {
    render(<SimpleForm />);
    const input = screen.getByLabelText('Simple Form:');
    fireEvent.change(input, { target: { value: 'Safe input' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('valid')).toBeInTheDocument();
  });

  test('xssFilters Validation - Invalid Input', () => {
    render(<SimpleForm />);
    const input = screen.getByLabelText('Simple Form:');
    fireEvent.change(input, { target: { value: '<script>alert("XSS Attack!")</script>' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('not valid')).toBeInTheDocument();
  });

  test('yup Validation - Valid Input', async () => {
    render(<SimpleForm />);
    const input = screen.getByLabelText('Simple Form:');
    fireEvent.change(input, { target: { value: 'Safe input' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('valid')).toBeInTheDocument();
  });

  test('yup Validation - Invalid Input', async () => {
    render(<SimpleForm />);
    const input = screen.getByLabelText('Simple Form:');
    fireEvent.change(input, { target: { value: '<script>alert("XSS Attack!")</script>' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('not valid')).toBeInTheDocument();
  });

  test('No Validator Selected', () => {
    render(<SimpleForm />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('valid')).toBeInTheDocument();
  });
});