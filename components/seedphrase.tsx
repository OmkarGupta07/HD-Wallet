import {
    Box,
    Typography,
    Button,
    TextField,
    Modal,
} from "@mui/material";
import { Grid } from "@mui/system";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { HDNodeWallet } from "ethers";


const SeedPhrase = ({ mnemonic, setStep, step }: any) => {
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

    async function deriveWalletsFromMnemonic(mnemonic: string) {
    const arr=[];
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);

  const ethPath = `m/44'/60'/0'/0/0`;
  const ethWallet = HDNodeWallet.fromPhrase(mnemonic, undefined, ethPath);

  const solPath = `m/44'/501'/0'/0'`;
  const derived = derivePath(solPath, seed.toString("hex"));
  const solPrivateKey = derived.key.slice(0, 32);
  const solKeypair = Keypair.fromSeed(solPrivateKey);

  return {
    ethereum: {
      path: ethPath,
      address: ethWallet.address,
      privateKey: ethWallet.privateKey,
    },
    solana: {
      path: solPath,
      publicKey: solKeypair.publicKey.toBase58(),
      secretKey: Buffer.from(solKeypair.secretKey).toString("hex"),
    },
  };
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
                    <Grid container spacing={2} key={rowIndex}>
                        {row.map((item, index) => (
                            <Grid item xs={12} sm={4} key={item.id} sx={{ width: '30%' }}>
                                <TextField
                                    value={item.word}
                                    InputProps={mnemonic?.length > 0 ? true : false}
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
                            </Grid>
                        ))}
                    </Grid>
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
                        bgcolor: "#555", // visible disabled color
                        color: "#aaa",   // lighter text
                        opacity: 0.7,    // subtle fade
                    },
                }}
                onClick={() => {
                 if(mnemonic.length>0)
                    setStep(2)
                else 
                    deriveWalletsFromMnemonic()
                }}
            >
                Continue
            </Button>


        </Box>
    )

}


export default SeedPhrase;