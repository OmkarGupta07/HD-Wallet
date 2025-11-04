import React from 'react';
import { Box, Typography } from '@mui/material';

type Props = {
  open?: boolean;
  message?: string;
};

const Loader: React.FC<Props> = ({ open = false, message = 'Processing...' }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(3,3,3,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'conic-gradient(from 90deg, #b89cff, #9c6bff, #6b47ff, #b89cff)',
          animation: 'spin 1s linear infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(156,107,255,0.18), inset 0 0 20px rgba(156,107,255,0.08)',
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            bgcolor: 'rgba(13,13,13,0.85)',
            display: 'block',
          }}
        />
      </Box>
      <Typography sx={{ color: '#eae6ff', fontWeight: 600 }}>{message}</Typography>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Loader;
