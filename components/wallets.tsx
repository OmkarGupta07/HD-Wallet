"use client"

// import nacl from "tweetnacl";
// import { generateMnemonic, mnemonicToSeedSync } from "bip39";
// import { derivePath } from "ed25519-hd-key";
// import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, } from "@solana/web3.js";
// import { ethers } from "ethers";
import { generateMnemonic } from "bip39";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  IconButton,
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
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [mnemonic, setMnemonic] = useState<any>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [password, setPassword] = useState('')
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('')
  const [tokens, setTokens] = useState<WalletType[]>([])

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
    //setStep("seed");
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
            position: "relative",
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

          {/* {step === "password" && (
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
                }}
              >
                Continue
              </Button>

            </Box>
          )} */}

          {step === 1 && (
            <SeedPhrase mnemonic={mnemonic?.split(" ")} setStep={setStep} step={step} />
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
    scrollbarWidth: "thin", // Firefox
    scrollbarColor: "#9c6bff #181818", // Firefox
    "&::-webkit-scrollbar": {
      width: "8px",
      background: "#181818",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "linear-gradient(135deg, #9c6bff 40%, #6b47ff 100%)",
      borderRadius: "8px",
            borderLeft: "4px solid transparent", // pushes thumb right
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
    </div>
  )
}

export default wallets




