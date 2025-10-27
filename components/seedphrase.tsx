import {
    Box,
    Typography,
    Button,
    TextField,
    Modal,
} from "@mui/material";
import { Grid } from "@mui/system";
import { useEffect, useState } from "react";


const SeedPhrase = ({ mnemonic,setStep,step }: any) => {
    const boxes = Array.from({ length: 12 }, (_, i) => i + 1);
    console.log(mnemonic,'memo')
    const [words,setWords] = useState([
        { id: 1, word: '' },
        { id: 2, word: '' },
        { id: 3, word: '' },
        { id: 4, word: '' },
        { id: 5, word: '' },
        { id: 6, word: '' },
        { id: 7, word: '' },
        { id: 8, word: '' },
        { id: 9, word: '' },
        { id: 10, word: '' },
        { id: 11, word: '' },
        { id: 12, word: '' },
    ]);

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

    const rows = [];
    for (let i = 0; i < words.length; i += 3) {
        rows.push(words.slice(i, i + 3));
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
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    placeholder={`${item.id}.`}

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
    mt:3,
    "&:hover": { bgcolor: "#a580ff" },
    "&.Mui-disabled": {
      bgcolor: "#555", // visible disabled color
      color: "#aaa",   // lighter text
      opacity: 0.7,    // subtle fade
    },
  }}
  onClick={() => {
    setStep("walletcreation")
  }}
>
  Continue
</Button>


        </Box>
    )

}


export default SeedPhrase;