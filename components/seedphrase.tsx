import {
    Box,
    Typography,
    Button,
    TextField,
    Modal,
    Grid,
} from "@mui/material";
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useEffect, useState } from "react";
import { ethers, Wallet } from "ethers";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { HDNodeWallet } from "ethers";
import { toast } from "react-toastify";
import { conn, provider } from "./walletCreation";
import { EthereumWallet, SolanaWallet, WalletData } from "./wallets";


interface SeedPhraseProps {
  mnemonic: string[] | undefined;
  setStep: (step: number) => void;
  step: number;
  setTokens: React.Dispatch<React.SetStateAction<WalletData[][]>>;
  setMnemonic: (mnemonic: string) => void;
}

const SeedPhrase: React.FC<SeedPhraseProps> = ({ mnemonic, setStep, step, setTokens, setMnemonic }) => {
    const [words, setWords] = useState(
        Array.from({ length: 12 }, (_, i) => ({ id: i + 1, word: "" }))
    );

    useEffect(() => {
        if (mnemonic && mnemonic.length === words.length) {
            setWords((prev) =>
                prev.map((w, i) => ({
                    ...w,
                    word: mnemonic[i],
                }))
            );
        }
    }, [mnemonic]);


    const handleChange = (index: number, value: string) => {
        const updated = words.map((w, i) => (i === index ? { ...w, word: value } : w));
        setWords(updated);
    };

    const rows = [];
    for (let i = 0; i < words.length; i += 3) {
        rows.push(words.slice(i, i + 3));
    }



    const retriveWallet = async () => {
        const phrase = words.map(ele => ele.word)
        const mnemonic=phrase.join(' ');
    if (!bip39.validateMnemonic(mnemonic)) {
      toast.error("Invalid mnemonic");
      return
    }


    for (let i = 0; i < 3; i++) {
      const path =`44'/60'/0'/0/${i}`;
      const node = HDNodeWallet.fromPhrase(mnemonic).derivePath(path);
      const wallet = new Wallet(node.privateKey);
      const balance = await provider.getBalance(wallet.address)
      const ethBalance = ethers.formatEther(balance)

      const ethWllet: EthereumWallet = {
        chain: 'ethereum',
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        balance: ethBalance
      }


      const seed = await bip39.mnemonicToSeed(mnemonic);
      const solanaPath = `m/44'/501'/${i}'/0'`;
      const { key } = derivePath(solanaPath, seed.toString('hex'))
      const keypair = Keypair.fromSeed(key.slice(0, 32));
      const lamports = await conn.getBalance(keypair.publicKey)
      const solBalance = Number(lamports / LAMPORTS_PER_SOL);
      const solanaWallet: SolanaWallet = {
        chain: "solana",
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(keypair.secretKey).toString("hex"),
        balance: solBalance.toString(),
      }

       const walletData = {
          walletNumber: i,
          solana: solanaWallet,
          ethereum: ethWllet,
      };

      setTokens((prevTokens) => {
        const exists = prevTokens.some(token => token[0].walletNumber === i);
        if (exists) {
          return prevTokens; 
        }
        return [...prevTokens, [walletData]];
      });

      if(i==2){
        setMnemonic(mnemonic);
        setStep(2);
      }
    }
  }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: '#eeeeee', fontSize: '28px' }}>
                Recovery Phrase
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: mnemonic ? '#ffe629' : '#ccc' }}>
                {mnemonic ? 'This phrase is the ONLY way to recover your wallet. Do NOT share it with anyone!' : 'Import an existing wallet using your 12-word recovery phrase.'}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rows.map((row, rowIndex) => (
                    <Box 
                        key={rowIndex}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(3, 1fr)'
                            },
                            gap: 2
                        }}
                    >
                        {row.map((item, index) => (
                            <Box 
                                key={item.id}
                            >
                                <TextField
                                    value={item.word}
                                    InputProps={{
                                        readOnly: mnemonic && mnemonic.length > 0
                                    }}
                                    placeholder={`${item.id}.`}
                                    onChange={(e) => handleChange(rowIndex * 3 + index, e.target.value)}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'grey.900',
                                            '& fieldset': {
                                                borderColor: 'grey.600',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#9c6bff',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#9c6bff',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                            borderRadius: 8
                                        },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>



            <Button
                variant="contained"
                fullWidth
                //disabled={}
                sx={{
                    bgcolor: "#9c6bff",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 3,
                    mt: 3,
                    "&:hover": { bgcolor: "#a580ff" },
                    "&.Mui-disabled": {
                        bgcolor: "#555", 
                        color: "#aaa",   
                        opacity: 0.7,    
                    },
                }}
                onClick={async () => {
                 if(mnemonic && mnemonic.length > 0) {
                    setStep(2);
                 } else {
                    await retriveWallet();
                 }
                }}
            >
                Continue
            </Button>


        </Box>
    )

}


export default SeedPhrase;