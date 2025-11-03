import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import WalletCard from "./walletCard";
import { toast } from "react-toastify";
import { PublicKey, Keypair, LAMPORTS_PER_SOL,SystemProgram  } from "@solana/web3.js";
import { conn } from "./walletCreation";

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  tokens: any[];
}

const SendModal = ({ open, onClose, tokens }: SendModalProps) => {
  const [sendChain, setSendChain] = useState<'ethereum' | 'solana' | null>(null);
  const [selectedWalletIdx, setSelectedWalletIdx] = useState<number|null>(null);
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setSendChain(null);
      setSelectedWalletIdx(null);
      setSendTo('');
      setSendAmount('');
      setSendError('');
      setSending(false);
    }
  }, [open]);



   const sendChain = async () => {
                  setSending(true);
                  try {
                    if (sendChain === 'solana') {
                      // Send SOL
                      const sender = tokens[selectedWalletIdx][0].solana;
                      const fromKeypair = Keypair.fromSecretKey(Buffer.from(sender.privateKey, 'hex'));
                      const toPubkey = new PublicKey(sendTo);
                      const lamports = Math.floor(parseFloat(sendAmount) * LAMPORTS_PER_SOL);
                      const tx = await conn.requestAirdrop(fromKeypair.publicKey, 0); // dummy to get recent blockhash
                      const recentBlockhash = (await conn.getRecentBlockhash()).blockhash;
                      const transaction = new (await import('@solana/web3.js')).Transaction({ recentBlockhash, feePayer: fromKeypair.publicKey });
                      transaction.add(
  SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey,
    lamports,
  })
);
                      const signed = await fromKeypair.signTransaction(transaction);
                      const sig = await conn.sendRawTransaction(signed.serialize());
                      await conn.confirmTransaction(sig);
                      toast.success(`${sendAmount} SOL sent to ${sendTo}`);
                      onClose();
                    } else if (sendChain === 'ethereum') {
                      toast.info('ETH send not implemented in this demo');
                    }
                  } catch (err: any) {
                    toast.error('Send failed: ' + (err?.message || err));
                  } finally {
                    setSending(false);
                  }
                }


  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h6" sx={{ mb: 2, color: '#9c6bff', textAlign: 'center' }}>Send</Typography>
        {/* Step 1: Select Chain */}
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
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" alt="ETH" width={36} style={{marginBottom: 8}} />
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
              <img src="https://cryptologos.cc/logos/solana-sol-logo.png?v=026" alt="SOL" width={36} style={{marginBottom: 8}} />
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
        {/* Step 3: Enter recipient and amount */}
        {sendChain && selectedWalletIdx !== null && (
          <Box sx={{ mt: 2 }}>
            <WalletCard chainData={sendChain === 'ethereum' ? tokens[selectedWalletIdx][0].ethereum : tokens[selectedWalletIdx][0].solana} />
            <TextField
              label="Recipient Address"
              value={sendTo}
              onChange={e => setSendTo(e.target.value)}
              fullWidth
              sx={{ my: 2, input: { color: '#eee' }, label: { color: '#9c6bff' } }}
              InputLabelProps={{ style: { color: '#9c6bff' } }}
            />
            <TextField
              label="Amount"
              value={sendAmount}
              onChange={e => {
                setSendAmount(e.target.value);
                // Validate balance
                const bal = parseFloat(sendChain === 'ethereum' ? tokens[selectedWalletIdx][0].ethereum.balance : tokens[selectedWalletIdx][0].solana.balance);
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
              sx={{ mb: 2, input: { color: '#eee' }, label: { color: '#9c6bff' } }}
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
                onClick={
                    
              }
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SendModal;
