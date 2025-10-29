// frontend/src/wallet.ts (helper)
import { ethers } from "ethers";
declare global { interface Window { ethereum?: any; } }
export async function connect() {
  if (!window.ethereum) throw new Error("no wallet");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}
