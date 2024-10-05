import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SignupForm from './SignupForm'; 
import Content from './Content'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const theme = createTheme();

export default function SignInSide() {
  const [signupSuccess, setSignupSuccess] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');

  const handleSignupSuccess = (name) => {
    setFirstName(name);
    setSignupSuccess(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#f9fbff' }}>
        <Container component="main" maxWidth="lg">
          {signupSuccess ? (
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h2" align="center">
                Welcome, {firstName}!
              </Typography>
            </Box>
          ) : (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: '100vh', padding: 4 }}
            >
              <Box flex={1}>
                <Content />
              </Box>
              <Box flex={1}>
                <SignupForm onSignupSuccess={handleSignupSuccess} />
              </Box>
            </Stack>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
