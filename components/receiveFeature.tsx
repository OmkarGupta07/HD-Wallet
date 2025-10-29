
import React, { useState, useEffect } from 'react';
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


const ChainItem = ({ chain }):any =>  {


const handleCopy = async (e) => {
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(chain.publicKey);
    console.log(`Copied ${chain.chain} address!`);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};


  return (
    <ListItem
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
            <Copy size={20} />
          </IconButton>
        </Stack>
      }
    >
      <ListItemAvatar>
        <Box className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-700">
            <img src={chain == 'solana' ? solana.src : eth.src} alt={`${chain.chain} logo`} className="w-full h-full object-cover" />
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body1" className="text-white truncate  font-semibold">
            {chain.chain.toUpperCase()}
          </Typography>
        }
        secondary={
    <Tooltip title={chain.publicKey} arrow>
        <Typography
          variant="body2"
          className="text-gray-400 text-sm truncate max-w-[180px]"
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