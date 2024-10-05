// src/SignupForm.test.js

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SignupForm from './SignupForm';
import axios from 'axios';

describe('SignupForm', () => {
  const mockOnSignupSuccess = jest.fn();

  beforeEach(() => {
    render(<SignupForm onSignupSuccess={mockOnSignupSuccess} />);
  });

  test('renders the initial signup options', () => {
    // Check that the initial options are present
    expect(screen.getByText(/Join Us!/)).toBeInTheDocument();
    expect(screen.getByText(/Researcher/i)).toBeInTheDocument();
    expect(screen.getByText(/Investor/i)).toBeInTheDocument();
    expect(screen.getByText(/Institution Staff/i)).toBeInTheDocument();
    expect(screen.getByText(/Service Provider/i)).toBeInTheDocument();
  });

  test('renders the signup form after selecting a user type', async () => {
    // Click on the Researcher button to select it
    fireEvent.click(screen.getByText(/Researcher/i));

    // Now, check that the rest of the form is rendered
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument(); 
    expect(screen.getByTestId('confirm-password')).toBeInTheDocument()
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    // Click on the Researcher button to select it
    fireEvent.click(screen.getByText(/Researcher/i));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Hero' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Mass' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'MassHero' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'MassHero@gmail.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'USA' } });

    axios.post.mockResolvedValue({ status: 200 });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Signup/i }));
    });

    // Check that onSignupSuccess was called with the first name
    expect(mockOnSignupSuccess).toHaveBeenCalledWith('Hero');
  });

  
});
