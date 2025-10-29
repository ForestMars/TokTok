// frontend/src/wallet.ts (helper)
import { ethers } from "ethers";
declare global { interface Window { ethereum?: any; } }
export async function connect() {
  if (!window.ethereum) throw new Error("no wallet");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}

// frontend/src/BuyCredits.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { connect } from "./wallet";
import AiCreditAbi from "../abis/AiCredit.json";
import IERC20Abi from "../abis/IERC20.json";

const AICREDIT_ADDRESS = process.env.REACT_APP_AICREDIT_ADDRESS!;
const PAYTOKEN = process.env.REACT_APP_PAY_TOKEN!; // token user pays in

export default function BuyCredits() {
  const [amount, setAmount] = useState("1");
  async function buy() {
    const signer = await connect();
    const payToken = new ethers.Contract(PAYTOKEN, IERC20Abi, signer);
    const contract = new ethers.Contract(AICREDIT_ADDRESS, AiCreditAbi, signer);
    const decimals = await payToken.decimals();
    const amt = ethers.utils.parseUnits(amount, decimals);
    // approve
    await payToken.approve(AICREDIT_ADDRESS, amt);
    // call buyCredits(payToken, amountIn, minStableOut)
    const tx = await contract.buyCredits(PAYTOKEN, amt, 0);
    await tx.wait();
    alert("purchase submitted");
  }
  return (
    <div>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={buy}>Buy Credits</button>
    </div>
  );
}
