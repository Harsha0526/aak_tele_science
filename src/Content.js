import React from 'react';
import { Box, Typography } from '@mui/material';

const Content = () => {
  return (
    <Box sx={{ padding: 4, maxWidth: 600 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to AAK!
      </Typography>
      <Typography variant="body1" paragraph>
        Connect with fellow researchers, investors, and service providers in a
        dynamic environment where innovation thrives.
      </Typography>
      <Typography variant="body1" paragraph>
        Our platform offers a unique opportunity to collaborate, explore, and
        accelerate groundbreaking research projects.
      </Typography>
      <Typography variant="body1" paragraph>
        Join us and be part of the future of science and technology.
      </Typography>
    </Box>
  );
};

export default Content;
