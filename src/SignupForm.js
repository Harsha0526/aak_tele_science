import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import zxcvbn from 'zxcvbn';
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignupForm = ({ onSignupSuccess }) => {
  const [userTypeSelected, setUserTypeSelected] = useState(false); 
  const [formData, setFormData] = useState({
    user_type: '', 
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    country: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [passwordScore, setPasswordScore] = useState(null);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const handleUserTypeSelection = (userType) => {
    setFormData({ ...formData, user_type: userType });
    setUserTypeSelected(true); 
  };

  const debouncedCheckUsername = debounce(async () => {
    if (formData.username.trim() !== '') {
      try {
        const response = await axios.get(
          `https://django-dev.aakscience.com/get_user_by_username/${formData.username}`,
          {
            headers: { Accept: 'application/json' },
          }
        );
        if (
          response.status === 200 &&
          response.data.user.username === formData.username &&
          response.data.profile.user_type === formData.user_type
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: `The username already exists for a ${formData.user_type}. Please pick another one.`,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: 'An error occurred while checking the username.',
          }));
        }
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
    }
  }, 500);

  const debouncedCheckEmail = debounce(async () => {
    if (formData.email.trim() !== '') {
      try {
        const response = await axios.get(
          `https://django-dev.aakscience.com/get_user_by_username/${formData.email}`,
          {
            headers: { Accept: 'application/json' },
          }
        );
        if (
          response.status === 200 &&
          response.data.user.email === formData.email &&
          response.data.profile.user_type === formData.user_type
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: `The email already exists for a ${formData.user_type}. Please pick another one.`,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'An error occurred while checking the email.',
          }));
        }
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
  }, 500);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username' && value.trim() === '') {
      setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
    }

    if (name === 'email' && value.trim() === '') {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }

    if (name === 'password') {
      if (value.trim() === '') {
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        setPasswordScore(null);
      } else {
        const passwordAnalysis = zxcvbn(value);
        setPasswordScore(passwordAnalysis.score);
        if (passwordAnalysis.score < 3) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: 'Your password is too weak. Try making it longer or adding more complex characters.',
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
      }
    }

    if (name === 'confirm_password') {
      if (value !== formData.password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirm_password: 'Passwords do not match.',
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirm_password: '' }));
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (formData.username) {
      debouncedCheckUsername();
    }
    return () => {
      debouncedCheckUsername.cancel();
    };
  }, [formData.username, formData.user_type]);

  useEffect(() => {
    if (formData.email) {
      debouncedCheckEmail();
    }
    return () => {
      debouncedCheckEmail.cancel();
    };
  }, [formData.email, formData.user_type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setGeneralError('');
    try {
      const response = await axios.post(
        'https://django-dev.aakscience.com/signup/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      if (response.status === 200) {
        onSignupSuccess(formData.first_name);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setGeneralError(err.response.data);
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', 
          backgroundColor: '#f9fbff', 
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          Welcome, {formData.first_name}!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 450, margin: 'auto', padding: 2 }}>
      {!userTypeSelected ? (
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            padding: 4,
            borderRadius: 4,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" gutterBottom> 
              <strong>Join Us!</strong>
            </Typography>
            <Typography variant="h9" gutterBottom>
              To begin this journey, tell us what type of account you'd be opening.
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleUserTypeSelection('researcher')}
              fullWidth
            >
              Researcher
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUserTypeSelection('investor')}
              fullWidth
            >
              Investor
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUserTypeSelection('institution_staff')}
              fullWidth
            >
              Institution Staff
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUserTypeSelection('service_provider')}
              fullWidth
            >
              Service Provider
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Signup as {formData.user_type.charAt(0).toUpperCase() + formData.user_type.slice(1)}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username}
              required
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              inputProps={{ 'data-testid': 'password' }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordScore !== null && (
              <Typography
                variant="body2"
                sx={{ color: passwordScore < 3 ? 'red' : 'green' }}
              >
                Password strength: {['Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
              </Typography>
            )}
            <TextField
              id="confirm-password"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
              required
              inputProps={{ 'data-testid': 'confirm-password' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button label="Signup" type="submit" variant="contained" color="primary" fullWidth>
              Signup
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setUserTypeSelected(false)}
              fullWidth
              sx={{ marginTop: 2 }} 
            >
              Back
            </Button>
            {generalError && <Typography color="red">{generalError}</Typography>}
          </form>
        </Box>
      )}
      <Snackbar
        open={success}
        onClose={() => setSuccess(false)}
        message="Signup successful!"
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default SignupForm;
