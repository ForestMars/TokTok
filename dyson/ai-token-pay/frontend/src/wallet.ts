import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Connects the browser wallet (e.g. MetaMask)
 * and returns an ethers.js Signer for contract calls.
 */
export async function connect(): Promise<ethers.Signer> {
  if (!window.ethereum) throw new Error("No crypto wallet found");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}

/**
 * Utility function to get current user address.
 */
export async function getAddress(): Promise<string> {
  const signer = await connect();
  return signer.getAddress();
}
