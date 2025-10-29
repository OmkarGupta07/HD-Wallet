"use client"

// import nacl from "tweetnacl";
// import { generateMnemonic, mnemonicToSeedSync } from "bip39";
// import { derivePath } from "ed25519-hd-key";
// import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, } from "@solana/web3.js";
// import { ethers } from "ethers";
import { generateMnemonic } from "bip39";

import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import { Grid } from "@mui/system";
import { useRef, useState } from "react";
import SeedPhrase from "./seedphrase";
import WalletCreation from "./walletCreation";
import ChainItem from "./receiveFeature";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface EthereumWallet {
  chain: "ethereum";
  publicKey: string;
  privateKey: string;
  balance: string;
}

export interface SolanaWallet {
  chain: "solana";
  publicKey: string;
  privateKey: string;
  balance: string;
}
export interface WalletType {
  walletNumber: number;
  solana: SolanaWallet;
  ethereum: EthereumWallet;
}

const wallets = () => {
  const [step, setStep] = useState("welcome"); // welcome | password | seed
  const [open, setOpen] = useState(true);
  const [mnemonic, setMnemonic] = useState<any>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [password, setPassword] = useState('')
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('')
  const [tokens, setTokens] = useState<WalletType[]>([])




  const generateMnemonicFunc = async () => {
    const mn = await generateMnemonic();
    localStorage.setItem('mnemonic', JSON.stringify(mn?.split(" ")));
    setMnemonic(mn)
  }


  const handleSubmit = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setStep("seed");
    //alert("Password successfully set!");
  };


  return (
    <div ref={rootRef}>
      <Modal
        open={open}
        onClose={(event, reason) => {
    if (reason && reason === "backdropClick") return;
    handleClose();
  }}
        aria-labelledby="wallet-modal"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#0d0d0d",
            borderRadius: 4,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.6)",
            width: 400,
            p: 4,
            textAlign: "center",
            color: "white",
          }}
        >
          {/* WELCOME SCREEN */}
          {step === "welcome" && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                <span style={{ color: "#9c6bff" }}>ASTRA</span>
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "#ccc" }}>
                To get started, create a new wallet or import an existing one.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mb: 2,
                  bgcolor: "#9c6bff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "#a580ff" },
                }}
                onClick={() => setStep("password")}
              >
                Create a new wallet
              </Button>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1a1a1a",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "#2a2a2a" },
                }}
                onClick={() => setStep("seed")}
              >
                I already have a wallet
              </Button>
            </>
          )}

          {step === "password" && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, color: '#ccc', fontWeight: 'bold' }}>
                Create a password
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#ccc" }}>
                You’ll use this to unlock your wallet.
              </Typography>

              <TextField
                placeholder="Enter password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#9c6bff" },
                    "&.Mui-focused fieldset": { borderColor: "#9c6bff" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "#888" },
                }}
              />

              <TextField
                placeholder="Confirm password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  mb: 3,
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#9c6bff" },
                    "&.Mui-focused fieldset": { borderColor: "#9c6bff" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "#888" },
                }}
              />

              {error !== "" && <Typography sx={{ m: 2 }}>{error}</Typography>}

              <Button
                variant="contained"
                fullWidth
                disabled={!password || !confirmPassword}
                sx={{
                  bgcolor: "#9c6bff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "#a580ff" },
                  "&.Mui-disabled": {
                    bgcolor: "#555", // visible disabled color
                    color: "#aaa",   // lighter text
                    opacity: 0.7,    // subtle fade
                  },
                }}
                onClick={() => {
                  handleSubmit();
                  generateMnemonicFunc();
                }}
              >
                Continue
              </Button>

            </Box>
          )}

          {step === "seed" && (
            <SeedPhrase mnemonic={mnemonic?.split(" ")} setStep={setStep} step={step} />
          )}

          {step === "walletcreation" && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1, color: '#ccc', fontWeight: 'bold' }}>
                HII !!!!
              </Typography>

               <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: "#9c6bff"}}>
                You're all ready!
              </Typography>
               <Typography variant="h6" sx={{ mb: 1, color: '#ccc', fontWeight: 'bold' }}>
                              You can now fully enjoy your wallet  
              </Typography>

               <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#9c6bff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "#a580ff" },
                  "&.Mui-disabled": {
                    bgcolor: "#555", // visible disabled color
                    color: "#aaa",   // lighter text
                    opacity: 0.7,    // subtle fade
                  },
                }}
                onClick={() => {
                  setStep("features")
                }}
              >
                Continue
              </Button>
            </Box>
          )}


          {step === "features" && (
            <WalletCreation mnemonic={mnemonic} setStep={setStep} tokens={tokens} setTokens={setTokens}/>
          ) }


          {step === "receive" && (
            <Box sx={{mt:5}}>
          {tokens.map( (item,index) => (<Box key={index}>
         <Box key={`${index}-sol`}><ChainItem chain={item.solana} />  </Box>
         <Box  key={`${index}-eth`}><ChainItem   chain={item.ethereum} /> </Box> </Box>
          ))}
        </Box> 
          )}

        </Box>
      </Modal>
    </div>
  )
}

export default wallets




