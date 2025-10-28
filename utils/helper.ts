import CryptoJS from "crypto-js";

const STORAGE_KEY = "wallet_data";

export const saveWallets = (wallets: any, password: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(wallets),
    password
  ).toString();
  localStorage.setItem(STORAGE_KEY, encrypted);
};

export const loadWallets = (password: string) => {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption failed. Wrong password or corrupted data.");
    return null;
  }
};

export const clearWallets = () => {
  localStorage.removeItem(STORAGE_KEY);
};
