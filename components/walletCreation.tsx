import { Avatar, Button, Typography, Modal, TextField, MenuItem } from "@mui/material"
import { Box } from "@mui/system"
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bip39,{ generateMnemonic, mnemonicToSeed, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, } from "@solana/web3.js";
import { ethers } from "ethers";
import { HDNodeWallet } from "ethers";
import { Wallet } from "ethers";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import WalletCard from "./walletCard";
import ChainItem from "./receiveFeature";
import { EthereumWallet, SolanaWallet } from "./wallets";
import { toast } from "react-toastify";
import Loader from './Loader';

// to create wallet and send receive features


 const ETHEREUM_RPC = "https://eth-sepolia.g.alchemy.com/v2/qPuH3QPcyyGJdTzXi9hz9";
 const SOLANA_RPC = "https://solana-devnet.g.alchemy.com/v2/qPuH3QPcyyGJdTzXi9hz9";

export const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC);
export const conn = new Connection(SOLANA_RPC, "confirmed");

interface WalletData {
  walletNumber: number;
  solana: SolanaWallet;
  ethereum: EthereumWallet;
}

const WalletCreation = ({ 
  mnemonic, 
  setStep, 
  tokens, 
  setTokens
}: {
  mnemonic: string;
  setStep: (step: number) => void;
  tokens: WalletData[][];
  setTokens: React.Dispatch<React.SetStateAction<WalletData[][]>>;
}) => {
  const [walletCount,setWalletCount] = useState<number>(tokens.length)
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    
    if (mnemonic && tokens.length===0) generateWallets(walletCount);
    //else alert("Mnemonic Not Found");

  }, [mnemonic]);


 const generateKeyPair = async (chain: string, mnemonic: string, count: number) => {


    if (chain === "ethereum") {
      const path = `m/44'/60'/${count}'/0'`;
      const seed = await mnemonicToSeed(mnemonic);
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(path);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      const balance = await provider.getBalance(wallet.address)
      const ethBalance = ethers.formatEther(balance)
      return {
        chain: "ethereum",
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        balance: ethBalance
      };
    }

    if (chain === "solana") {
      const path = `m/44'/501'/${count}'/0'`;
      const seed = mnemonicToSeedSync(mnemonic);
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      const lamports = await conn.getBalance(keypair.publicKey)
      const solBalance = lamports / LAMPORTS_PER_SOL;
      return {
        chain: "solana",
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(secret).toString("hex"),
        balance: solBalance
      };
    }


    throw new Error("Unsupported chain");
     
  };

  const generateWallets = async (count:number) => {
        try {
      setIsLoading(true);
          if(count>=3){
            toast.error('Cant Add More than 3 Accounts');
            setIsLoading(false);
            return ;
          }

      setWalletCount(count);
      const solanaWallet = await generateKeyPair("solana", mnemonic, count) as SolanaWallet;
      const ethereumWallet = await generateKeyPair("ethereum", mnemonic, count) as EthereumWallet;
      const walletData = {
          walletNumber: count,
          solana: solanaWallet,
          ethereum: ethereumWallet,
      };

      setTokens((prevTokens) => {
        const exists = prevTokens.some(token => token[0].walletNumber === count);
        if (exists) {
          setIsLoading(false);
          return prevTokens; 
        }
        return [...prevTokens, [walletData]];
      });
      setIsLoading(false);
      return true;
    }catch(err){
      setIsLoading(false);
      console.log(err)
      return false;
    }
};

const addWallet=async ()=>{
   const wallet=await generateWallets(walletCount+1);
   wallet ? toast.success(`Account Created SuccessFully`) : ' ' ; 
  }




  return (
    <Box sx={{ position: 'relative' }}>
      <Loader open={isLoading} message="Creating account..." />
      <Box display="flex" justifyContent="space-around">
        <Button
          startIcon={<QrCode2OutlinedIcon sx={{ fontSize: 40, mb: 1.5, color: '#9c6bff' }} />} 
          onClick={()=> setStep(4)}
          sx={{
            flexDirection: "column",
            alignItems: "center",
            color: "#eee",
            textTransform: "none",
            fontWeight: 700,
            border: "1px solid #9c6bff", 
            borderRadius: "16px",        
            px: 3,
            py: 2,
            "& .MuiButton-startIcon": {
              margin: 0, 
            },
            "&:hover": {
              borderColor: "#a580ff",   
              backgroundColor: "rgba(156, 107, 255, 0.1)",
            },
          }}
        >
          Receive
        </Button>

        <Button
          startIcon={<SendOutlinedIcon sx={{ fontSize: 40, mb: 1.5, color: '#9c6bff' }} />}
          sx={{
            flexDirection: "column",
            alignItems: "center",
            color: "#eee",
            textTransform: "none",
            fontWeight: 700,
            border: "1px solid #9c6bff",
            borderRadius: "16px",
            px: 3,
            py: 2,
            "& .MuiButton-startIcon": {
              margin: 0,
            },
            "&:hover": {
              borderColor: "#a580ff",
              backgroundColor: "rgba(156, 107, 255, 0.1)",
            },
          }}
          onClick={() => setStep(5)}
        >
          Send
        </Button>
    
        <Button
  startIcon={<SendOutlinedIcon sx={{ fontSize: 40, mb: 1.5, color: '#9c6bff' }} />}
  sx={{
    flexDirection: "column",
    alignItems: "center",
    color: "#eee",
    textTransform: "none",
    fontWeight: 700,
    border: "1px solid #9c6bff",
    borderRadius: "16px",
    px: 3,
    py: 2,
    transition: "all 0.2s ease",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
    "&:hover": {
      borderColor: "#a580ff",
      backgroundColor: "rgba(156, 107, 255, 0.1)",
    },
    "&.Mui-disabled": {
      color: "rgba(238, 238, 238, 0.4)", 
      borderColor: "rgba(156, 107, 255, 0.3)", 
      backgroundColor: "rgba(156, 107, 255, 0.05)",     },
  }}
  disabled={walletCount === 3 || isLoading}
  onClick={addWallet}
>
  Add Wallet
</Button>

        
  </Box>

  <Box>

        <Typography variant="h6" sx={{ mb: 1, color: "#fff" }}>
          Tokens
        </Typography>

        <Box
          sx={{
            maxHeight: 400,
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
          }}
        >
          {tokens.map((item, index) => (<Box key={index}>
            <Box key={`${index}-sol`}><WalletCard chainData={item[0].solana} />  </Box>
            <Box key={`${index}-eth`}><WalletCard chainData={item[0].ethereum} /> </Box> </Box>
          ))}
        </Box>

      </Box>

    </Box>
  )



}



export default WalletCreation;
