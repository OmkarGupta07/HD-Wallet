import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import WalletCard from "./walletCard";
import { toast } from "react-toastify";
import { PublicKey, Keypair, LAMPORTS_PER_SOL,SystemProgram,Transaction  } from "@solana/web3.js";
import { conn, provider } from "./walletCreation";
import solana from "../solana.png";
import eth from "../ethereum.png";
import Loader from './Loader';
import { ethers } from "ethers";
interface SendModalProps {
  tokens: any[];
  setStep: (step: number) => void;

}

const SendFeature = ({tokens,setStep }: SendModalProps) => {
  const [sendChain, setSendChain] = useState<'ethereum' | 'solana' | null>(null);
  const [selectedWalletIdx, setSelectedWalletIdx] = useState<number|null>(null);
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
      setSendChain(null);
      setSelectedWalletIdx(null);
      setSendTo('');
      setSendAmount('');
      setSendError('');
      setSending(false);
  }, []);



  const transaction = async () => {
    setSending(true);
    debugger
    try {
      if (selectedWalletIdx === null) {
        toast.error('No wallet selected');
        setSending(false);
        return;
      }
      if (sendChain === 'solana') {
        const sender = tokens[selectedWalletIdx][0].solana;
        const fromKeypair = Keypair.fromSecretKey(Buffer.from(sender.privateKey, 'hex'));
        const toPubkey = new PublicKey(sendTo);
        const lamports = Math.floor(parseFloat(sendAmount) * LAMPORTS_PER_SOL);
        const recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
        const transaction = new Transaction({ recentBlockhash, feePayer: fromKeypair.publicKey });
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey,
            lamports,
          })
        );
        const signature = await conn.sendTransaction(transaction, [fromKeypair]);
        await conn.confirmTransaction(signature);
        toast.success(`${sendAmount} SOL sent to ${sendTo}`);
      } else if (sendChain === 'ethereum') {
        toast.info('ETH send not implemented in this demo');
        const sender = tokens[selectedWalletIdx][0].ethereum;
        const wallet = new ethers.Wallet(sender.privateKey, provider);

        //wei to eth
      const tx = {
        to: sendTo,
        value: ethers.parseEther(sendAmount), 
      };

      const txResponse = await wallet.sendTransaction(tx);
      toast.info("Transaction sent. Waiting for confirmation...");

      await txResponse.wait();
      toast.success(`${sendAmount} ETH sent to ${sendTo}`);
      }
    } catch (err: any) {
      toast.error('Send failed: ' + (err?.message || err));
    } finally {
      setSending(false);
      setStep(3);
    }
  }


  return (
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 420,
        bgcolor: '#181818',
        border: '2px solid #9c6bff',
        boxShadow: 24,
        p: 4,
        borderRadius: 3,
        color: '#eee',
      }}>
        <Loader open={sending} message={sendChain === 'solana' ? 'Sending SOL...' : 'Sending ETH...'} />
        <Typography variant="h6" sx={{ mb: 2, color: '#9c6bff', textAlign: 'center' }}>Send</Typography>
        {!sendChain && (
          <Box display="flex" justifyContent="space-around" gap={2}>
            <Box
              onClick={() => setSendChain('ethereum')}
              sx={{
                flex: 1,
                cursor: 'pointer',
                bgcolor: '#232136',
                border: '2px solid #7c3aed',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                transition: '0.2s',
                '&:hover': { borderColor: '#a580ff', boxShadow: '0 0 8px #7c3aed55' },
              }}
            >
              <img src={eth.src} alt="ETH" width={36} style={{display: 'block', margin: '0 auto 8px'}} />
              <Typography fontWeight={600} color="#eee">Ethereum</Typography>
            </Box>
            <Box
              onClick={() => setSendChain('solana')}
              sx={{
                flex: 1,
                cursor: 'pointer',
                bgcolor: '#232136',
                border: '2px solid #7c3aed',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                transition: '0.2s',
                '&:hover': { borderColor: '#a580ff', boxShadow: '0 0 8px #7c3aed55' },
              }}
            >
              <img src={solana.src} alt="SOL" width={36} style={{display: 'block', margin: '0 auto 8px'}} />
              <Typography fontWeight={600} color="#eee">Solana</Typography>
            </Box>
          </Box>
        )}
        {/* Step 2: Select Wallet */}
        {sendChain && selectedWalletIdx === null && (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ mb: 1, color: '#9c6bff', textAlign: 'center' }}>Select {sendChain === 'ethereum' ? 'Ethereum' : 'Solana'} Account</Typography>
            {tokens.map((item, idx) => (
              <Box key={idx} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setSelectedWalletIdx(idx)}>
                <WalletCard chainData={sendChain === 'ethereum' ? item[0].ethereum : item[0].solana} />
              </Box>
            ))}
            <Button onClick={() => setSendChain(null)} sx={{ mt: 1, color: '#aaa' }}>Back</Button>
          </Box>
        )}
        {sendChain && selectedWalletIdx !== null && (
          <Box sx={{ mt: 2 }}>
            <WalletCard chainData={sendChain === 'ethereum' ? tokens[selectedWalletIdx][0].ethereum : tokens[selectedWalletIdx][0].solana} />
          <TextField
            label="Recipient Address"
            value={sendTo}
            onChange={e => setSendTo(e.target.value)}
            fullWidth
            sx={{
              my: 2,
              input: { color: '#eee' },
              label: { color: '#9c6bff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#9c6bff', // default border color
                },
                '&:hover fieldset': {
                  borderColor: '#9c6bff', // hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9c6bff', // focused border color
                },
              },
            }}
            InputLabelProps={{ style: { color: '#9c6bff' } }}
          />
          <TextField
            label="Amount"
            value={sendAmount}
            onChange={e => {
              setSendAmount(e.target.value);
              if (selectedWalletIdx === null) {
                setSendError('No wallet selected');
                return;
              }
              const bal = parseFloat(
                sendChain === 'ethereum'
                  ? String(tokens[selectedWalletIdx][0].ethereum.balance)
                  : String(tokens[selectedWalletIdx][0].solana.balance)
              );
              const amt = parseFloat(e.target.value);
              if (isNaN(amt) || amt <= 0) {
                setSendError('Enter a valid amount');
              } else if (amt > bal) {
                setSendError('Insufficient balance');
              } else {
                setSendError('');
              }
            }}
            fullWidth
            sx={{
              mb: 2,
              input: { color: '#eee' },
              label: { color: '#9c6bff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#9c6bff',
                },
                '&:hover fieldset': {
                  borderColor: '#9c6bff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9c6bff',
                },
              },
            }}
            type="number"
            InputLabelProps={{ style: { color: '#9c6bff' } }}
          />

            {sendError && <Typography sx={{ color: '#ef4444', mb: 1 }}>{sendError}</Typography>}
            <Box display="flex" justifyContent="space-between" gap={1}>
              <Button onClick={() => setSelectedWalletIdx(null)} sx={{ color: '#aaa' }}>Back</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: '#7c3aed', color: '#fff', '&:hover': { bgcolor: '#a580ff' } }}
                disabled={!!sendError || !sendTo || !sendAmount || sending}
                onClick={transaction}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
  );
};

export default SendFeature;
