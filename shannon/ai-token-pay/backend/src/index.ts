// backend/src/config.ts
export const RPC = process.env.RPC || "http://localhost:8545";
export const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
export const AICREDIT_ADDRESS = process.env.AICREDIT_ADDRESS || "";
export const AI_PROVIDER_API_KEY = process.env.AI_PROVIDER_API_KEY || ""; // OpenAI or other
export const PRICE_DECIMALS = 1e18;

// backend/src/creditManager.ts
import { ethers } from "ethers";
import AiCreditAbi from "../abis/AiCredit.json"; // compiled ABI

export class CreditManager {
  provider: ethers.providers.JsonRpcProvider;
  signer: ethers.Wallet;
  contract: ethers.Contract;
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.RPC);
    this.signer = new ethers.Wallet(config.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(config.AICREDIT_ADDRESS, AiCreditAbi, this.signer);
  }

  async getCredits(address: string) {
    const raw = await this.contract.credits(address);
    // raw is scaled by 1e18 model-token units
    return raw;
  }

  async consumeCredits(user: string, amountScaled: ethers.BigNumberish) {
    // call on-chain consume (only owner), or do an off-chain check then call
    const tx = await this.contract.consumeCredits(user, amountScaled);
    await tx.wait();
  }
}

// backend/src/aiClient.ts
// Simple wrapper that "consumes" N model tokens and calls the AI model API.
// In practice you convert model-token usage (in tokens) to prompt+response usage.
import fetch from "node-fetch";

export async function callAiModel(prompt: string) {
  // Placeholder: call to OpenAI-like API. Replace with actual client.
  // This returns the response and estimated token usage (you must estimate tokens).
  const usageTokens = Math.floor(prompt.length / 4) + 10; // naive estimate
  const response = { text: "fake response for " + prompt, tokensUsed: usageTokens };
  return response;
}

// backend/src/index.ts
import express from "express";
import bodyParser from "body-parser";
import { CreditManager } from "./creditManager";
import { callAiModel } from "./aiClient";
import { ethers } from "ethers";

const app = express();
app.use(bodyParser.json());
const cm = new CreditManager();

app.post("/use-model", async (req, res) => {
  const { userAddress, prompt } = req.body;
  if (!userAddress || !prompt) return res.status(400).send("missing");

  // estimate tokens required
  const est = Math.max(1, Math.floor(prompt.length / 4) + 10);
  const estScaled = ethers.BigNumber.from(est).mul(ethers.BigNumber.from(10).pow(18)); // scaled

  const current = await cm.getCredits(userAddress);
  if (current.lt(estScaled)) {
    return res.status(402).send({ error: "insufficient credits" });
  }

  // consume on-chain (owner backend)
  await cm.consumeCredits(userAddress, estScaled);

  // call AI provider
  const out = await callAiModel(prompt);

  // if actual tokensUsed differs, reconcile: refund or charge more (left as exercise)
  return res.send({ result: out.text, tokensUsed: out.tokensUsed });
});

app.listen(3000, () => console.log("Backend listening on :3000"));

