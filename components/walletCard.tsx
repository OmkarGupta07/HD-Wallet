import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import solana from '../solana.png';
import eth from '../ethereum.png';

interface ChainData {
  chain: "solana" | "ethereum";
  balance: string | number;
  publicKey: string;
  privateKey: string;
}

interface WalletCardProps {
  chainData: ChainData;
}


const WalletCard = ({ chainData }: WalletCardProps) => {
  const { chain, balance, publicKey, privateKey } = chainData;

  const [showPrivate, setShowPrivate] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        padding: "12px 16px",
        border:"1px solid ##9c6bff",
        width: 320,
        height: hovered ? 200 : 70,
        //boxShadow: "0px 0px 8px rgba(0,0,0,0.5)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        cursor: "pointer",
        mt:4
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header Section */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar
            src={chain === 'solana' ? solana.src : eth.src}
            alt={chain}
            sx={{ bgcolor: "#000", width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 600 }}>{chain.toUpperCase()}</Typography>
            <Typography sx={{ color: "#999", fontSize: 14 }}>{balance}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Wallet Details (only visible on hover) */}
      {hovered && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ color: "#999", fontSize: 13 , fontWeight:"bold"}}>Public Key:</Typography>
            <Tooltip title="Copy public key">
              <IconButton size="small" sx={{ color: "#999" }} onClick={handleCopy}>
                <ContentCopy sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title={publicKey}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {publicKey}
            </Typography>
          </Tooltip>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography sx={{ color: "#999", fontSize: 13 ,fontWeight:"bold" }}>Private Key:</Typography>
            <IconButton
              size="small"
              sx={{ color: "#999", ml: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowPrivate((prev) => !prev);
              }}
            >
              {showPrivate ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>

          <Tooltip title={privateKey}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {showPrivate ? privateKey : "••••••••••••••••••••••"}
            </Typography>
          </Tooltip>
        </Box>
      )}

      {/* Snackbar for Copy Confirmation */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Public key copied!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default WalletCard;