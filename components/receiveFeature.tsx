
import React, { useState, useEffect, MouseEvent } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Divider,
  Button,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { Copy } from 'lucide-react';
import solana from '../solana.png';
import eth from '../ethereum.png';


interface ChainItemProps {
  chain: {
    chain: 'solana' | 'ethereum';
    publicKey: string;
    privateKey: string;
    balance: string | number;
  }
}

const ChainItem: React.FC<ChainItemProps> = ({ chain }) => {

const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(chain.publicKey);
    console.log(`Copied ${chain.chain} address!`);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};


  return (
    <ListItem sx={{mt:3}}
      disableGutters
      className="bg-[#1C1C1C] hover:bg-[#282828] transition-colors p-4 rounded-xl mb-3 cursor-pointer"
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <IconButton
            edge="end"
            aria-label="copy"
            onClick={handleCopy}
            className="text-white bg-[#282828] hover:bg-[#383838] p-2 rounded-lg"
          >
            <Copy size={20} color="#9c6bff" />
          </IconButton >
        </Stack>
      }
    >
      <ListItemAvatar>
        <Box className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-700">
            <img src={chain.chain == 'solana' ? solana.src : eth.src} alt={`${chain.chain} logo`} className="w-full h-full object-cover" />
        </Box>
      </ListItemAvatar>
      <ListItemText
        sx={{
          maxWidth: { xs: '180px', sm: '250px' },
          overflow: 'hidden'
        }}
        primary={
          <Typography variant="body1" sx={{
            color: 'white',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {chain.chain.toUpperCase()}
          </Typography>
        }
        secondary={
          <Tooltip title={chain.publicKey} arrow>
            <Typography
              component="span"
              sx={{
                color: '#9c9c9c',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                maxWidth: '100%'
              }}
            >
              {chain.publicKey}
            </Typography>
          </Tooltip>
        }
      />
    </ListItem>
  );
};


export default ChainItem;