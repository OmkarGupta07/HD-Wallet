import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import solana from "../solana.png";
import eth from "../ethereum.png";

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
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(`${label} copied!`);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Box
      sx={{
        background: hovered
          ? "linear-gradient(145deg, #222, #161616)"
          : "linear-gradient(145deg, #1b1b1b, #111)",
        borderRadius: 3,
        p: 2,
        border: "1px solid rgba(156,107,255,0.3)",
        width: 320,
        height: hovered ? 170 : 70, // compact card height
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? "0 0 14px rgba(156,107,255,0.25)"
          : "0 0 6px rgba(0,0,0,0.4)",
        overflow: "hidden",
        cursor: "pointer",
        mt:2
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
     {/* Header */}
<Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
  {/* Left side - logo and chain name */}
  <Box display="flex" alignItems="center" gap={1.25}>
    <Avatar
      src={chain === "solana" ? solana.src : eth.src}
      alt={chain}
      sx={{
        bgcolor: "#000",
        width: 38,
        height: 38,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
      {chain.toUpperCase()}
    </Typography>
  </Box>

  {/* Right side - balance */}
  <Typography
    sx={{
      color: "#9c6bff",
      fontSize: 15,
      fontFamily: "monospace",
      fontWeight: "bold",
    }}
  >
    {Number(balance)}
  </Typography>
</Box>



      <Divider
        sx={{
          my: 1.2,
          borderColor: "rgba(255,255,255,0.1)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Wallet Details */}
      <Box
        sx={{
          // opacity: hovered ? 1 : 0,
          // transform: hovered ? "translateY(0)" : "translateY(-10px)",
          // transition: "all 0.3s ease",
          // pointerEvents: hovered ? "auto" : "none",
           maxHeight: hovered ? 140 : 0,
    opacity: hovered ? 1 : 0,
    transform: hovered ? "translateY(0)" : "translateY(-6px)",
    transition: "max-height 0.32s ease, opacity 0.28s ease, transform 0.28s ease",
    overflow: "hidden",
    // allow children clicks even during transition
    pointerEvents: hovered ? "auto" : "none",
    mt: 0.5,
        }}
      >
        {/* Public Key */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ color: "#999", fontSize: 12, fontWeight: 600 }}>
            Public Key
          </Typography>
          <Tooltip title="Copy public key">
            <IconButton
              size="small"
              sx={{ color: "#9c6bff" }}
              onClick={() => handleCopy(publicKey, "Public key")}
            >
              <ContentCopy sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title={publicKey}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 12,
              fontFamily: "monospace",
              mt: 0.5,
              p: 0.4,
              borderRadius: 1,
              backgroundColor: "rgba(255,255,255,0.05)",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {publicKey}
          </Typography>
        </Tooltip>

        {/* Private Key */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.2,
          }}
        >
          <Typography sx={{ color: "#999", fontSize: 12, fontWeight: 600 }}>
            Private Key
          </Typography>
          <Box>
            <Tooltip title="Copy private key">
              <IconButton
                size="small"
                sx={{ color: "#9c6bff" }}
                onClick={() => handleCopy(privateKey, "Private key")}
              >
                <ContentCopy sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {/* <IconButton
              size="small"
              sx={{ color: "#9c6bff", ml: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowPrivate((prev) => !prev);
              }}
            >
              {showPrivate ? (
                <Visibility sx={{ fontSize: 16 }} />
              ) : (
                <VisibilityOff sx={{ fontSize: 16 }} />
              )}
            </IconButton> */}
          </Box>
        </Box>

        <Tooltip title={privateKey}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 12,
              fontFamily: "monospace",
              mt: 0.5,
              p: 0.4,
              borderRadius: 1,
              backgroundColor: "rgba(255,255,255,0.05)",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {showPrivate ? privateKey : "••••••••••••••••••••••"}
          </Typography>
        </Tooltip>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={!!copiedMsg}
        autoHideDuration={2000}
        onClose={() => setCopiedMsg(null)}
        message={copiedMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default WalletCard;
