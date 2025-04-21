import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 9999,
                animation: `${fadeIn} 0.3s ease-in-out`,
            }}
        >
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                    color: 'primary.main',
                    marginBottom: 2,
                }}
            />
            <Typography
                variant="h6"
                sx={{
                    color: 'text.primary',
                    marginTop: 2,
                    fontWeight: 500,
                }}
            >
                Cargando...
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    marginTop: 1,
                }}
            >
                Por favor espere
            </Typography>
        </Box>
    );
};

export default LoadingScreen;