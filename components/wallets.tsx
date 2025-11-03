"use client"
import bip39, { generateMnemonic } from "bip39";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
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
export interface WalletData {
  walletNumber: number;
  solana: SolanaWallet;
  ethereum: EthereumWallet;
}

export type WalletType = WalletData;

const wallets = () => {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [mnemonic, setMnemonic] = useState<any>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [password, setPassword] = useState('')
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('')
  const [tokens, setTokens] = useState<WalletType[][]>([])
  const minStep = step >= 3 ? 2 : 1;


  const generateMnemonicFunc = async () => {
    const mn = await generateMnemonic();
    localStorage.setItem('mnemonic', JSON.stringify(mn?.split(" ")));
    setMnemonic(mn)
  }


  const handleBack = () => {
    if (step > minStep) {
      setStep(step - 1);
    }
  };



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
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            background: `
              radial-gradient(circle at center, rgba(156, 107, 255, 0.07) 0%, rgba(0, 0, 0, 0.9) 100%),
              linear-gradient(135deg, rgba(156, 107, 255, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)
            `,
          }
        }}
      >


        <Box
          sx={{
            bgcolor: "rgba(13, 13, 13, 0.95)",
            borderRadius: 4,
            width: 400,
            p: 4,
            textAlign: "center",
            color: "white",
            position: "relative",
            border: '1px solid rgba(156, 107, 255, 0.2)',
            boxShadow: `
              0 0 40px rgba(156, 107, 255, 0.1),
              0 0 20px rgba(156, 107, 255, 0.05),
              inset 0 0 10px rgba(156, 107, 255, 0.05)
            `,
            backdropFilter: 'blur(10px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 4,
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(156, 107, 255, 0.5), rgba(156, 107, 255, 0.1))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none'
            },
            animation: 'modalFadeIn 0.3s ease-out',
            '@keyframes modalFadeIn': {
              from: {
                opacity: 0,
                transform: 'scale(0.95)'
              },
              to: {
                opacity: 1,
                transform: 'scale(1)'
              }
            }
          }}
        >
{   (step > 0 && step !=3 ) &&
          <IconButton
          onClick={handleBack}
          disabled={step <= minStep}
          sx={{ position: "absolute", top: 16, left: 16 }}
          aria-label="Back"
        >
          <ArrowBackIosNewIcon sx={{ color: "#9c6bff" }}/>
        </IconButton>

}

          {step === 0 && (
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
                onClick={() => {setStep(1); generateMnemonicFunc();  }}
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
                onClick={() => {setStep(1) }}
              >
                I already have a wallet
              </Button>

           
            </>
          )}

          {/* {step === 2 && (
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
                    bgcolor: "#555", 
                    color: "#aaa",   
                    opacity: 0.7,   
                  },
                }}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Continue
              </Button>

            </Box>
          )} */}

          {step === 1 && (
            <SeedPhrase mnemonic={mnemonic?.split(" ")} setStep={setStep} step={step} setTokens={setTokens} setMnemonic={setMnemonic} />
          )}

          {step === 2 && (
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
                    bgcolor: "#555", 
                    color: "#aaa",   
                    opacity: 0.7,   
                  },
                }}
                onClick={() => {
                  setStep(3)
                }}
              >
                Continue
              </Button>
            </Box>
          )}


          {step === 3 && (
            <WalletCreation mnemonic={mnemonic} setStep={setStep} tokens={tokens} setTokens={setTokens}/>
          ) }


          {step === 4 && (
            <Box sx={{ maxHeight: 400,
    overflowY: "auto",
    scrollbarWidth: "thin", 
    scrollbarColor: "#9c6bff #181818", 
    "&::-webkit-scrollbar": {
      width: "8px",
      background: "#181818",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "linear-gradient(135deg, #9c6bff 40%, #6b47ff 100%)",
      borderRadius: "8px",
            borderLeft: "4px solid transparent", 
      minHeight: "40px",
      boxShadow: "0 2px 8px rgba(156,107,255,0.15)",
      border: "2px solid #181818",
      transition: "background 0.3s",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "linear-gradient(135deg, #b89cff 0%, #9c6bff 100%)",
    },
    "&::-webkit-scrollbar-track": {
      background: "#181818",
      borderRadius: "8px",
    },
  }}>
          {tokens.map( (item,index) => (<Box key={index}>
         <Box key={`${index}-sol`}><ChainItem chain={item[0].solana} />  </Box>
         <Box  key={`${index}-eth`}><ChainItem   chain={item[0].ethereum} /> </Box> </Box>
          ))}
        </Box> 
          )}


          

        </Box>
      </Modal>


         <Typography 
                component="div" 
                sx={{ 
                  position: 'absolute',
                  bottom: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.3s ease',
                  cursor: 'pointer',
                  // '&:hover': {
                  //   color: '#9c6bff'
                  // }
                }}
                onClick={() => window.open('https://www.linkedin.com/in/omkar-gupta-8b1a35223/', '_blank')}
              >
             Developed by
                <span style={{ 
                  color: '#ffd',
                  fontSize:'1rem',
                  fontWeight: "bold"
                }}>
                  Omkar
                </span>
              </Typography>
    </div>
  )
}

export default wallets




