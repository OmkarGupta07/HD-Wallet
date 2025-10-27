import { Avatar, Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useEffect, useState } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeed, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, } from "@solana/web3.js";
import { ethers } from "ethers";
import { HDNodeWallet } from "ethers";
import { Wallet } from "ethers";
// to create wallet and send receive features

interface WalletType {
  walletNumber: number,
  solana: Object,
  ethereum: Object,
}

const ETHEREUM_RPC = "https://eth-mainnet.g.alchemy.com/v2/qPuH3QPcyyGJdTzXi9hz9";
const SOLANA_RPC = "https://solana-mainnet.g.alchemy.com/v2/qPuH3QPcyyGJdTzXi9hz9";

const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC);
const conn = new Connection(SOLANA_RPC, "confirmed");

const WalletCreation = ({ mnemonic }: string) => {

  const [tokens, setTokens] = useState<WalletType>()


  // const provider = new ethers.JsonRpcProvider(
  //   "https://eth-mainnet.g.alchemy.com/v2/qPuH3QPcyyGJdTzXi9hz9"
  // );
  //  const RPC = "https://solana-mainnet.g.alchemy.com/v2/qPuH3QPcyyGJdTzXi9hz9";
  //   const conn = new Connection(RPC, "confirmed");

  useEffect(() => {
    const generateWallets = async () => {
      const solanaWallet = await generateKeyPair("solana", mnemonic, 0);
      const ethereumWallet = await generateKeyPair("ethereum", mnemonic, 0);

      
    console.log(ethereumWallet,solanaWallet,'Address')



      setTokens({
        walletNumber: 0,
        solana: solanaWallet,
        ethereum: ethereumWallet,
      });
    };
        


    if (mnemonic) generateWallets();
    else alert("Mnemonic Not Found");

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
        address: wallet.address,
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
        secretKey: Buffer.from(secret).toString("hex"),
        balace: solBalance
      };
    }


    //toast.error("Unsupported Chain");
    throw new Error("Unsupported chain");
     
  };

  return (
    <>

      <Box display="flex" justifyContent="space-around">
        <Button
          startIcon={<QrCode2OutlinedIcon sx={{ fontSize: 40, mb: 1.5, color: '#9c6bff' }} />} // 🔹 Bigger icon
          sx={{
            flexDirection: "column",
            alignItems: "center",
            color: "#eee",
            textTransform: "none",
            fontWeight: 700,
            border: "1px solid #9c6bff", // 🔹 Border color
            borderRadius: "16px",        // 🔹 Rounded corners
            px: 3,
            py: 2,
            "& .MuiButton-startIcon": {
              margin: 0, // ✅ removes default left margin
            },
            "&:hover": {
              borderColor: "#a580ff",    // 🔹 Slightly lighter on hover
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
        >
          Send
        </Button>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 1, color: "#fff" }}>
          Tokens
        </Typography>
      </Box>
    </>
  )



}



// const WalletCard = ({ chainData }: WalletType) => (
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       backgroundColor: "#1a1a1a",
//       borderRadius: 3,
//       padding: "12px 16px",
//       width: 300,
//       height: 90,
//       boxShadow: "0px 0px 8px rgba(0,0,0,0.5)",
//     }}
//   >
//     <Box display="flex" alignItems="center">
//       <Avatar
//         src={logo}
//         alt={name}
//         sx={{
//           bgcolor: "#000",
//           width: 40,
//           height: 40,
//           mr: 2,
//         }}
//       />
//       <Box>
//         <Typography sx={{ color: "#fff", fontWeight: 600 }}>{name}</Typography>
//         <Typography sx={{ color: "#999", fontSize: 14 }}>
//           {balanceCrypto}
//         </Typography>
//       </Box>
//     </Box>
//   </Box>
// );


export default WalletCreation;
