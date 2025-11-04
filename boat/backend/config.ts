import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// --- Blockchain Configuration ---

// Use Sepolia Testnet or similar for development
export const RPC_URL: string = process.env.RPC_URL || "YOUR_ETHEREUM_RPC_URL";

// Address of the deployed AiCreditGateway contract
export const GATEWAY_CONTRACT_ADDRESS: string =
  process.env.GATEWAY_CONTRACT_ADDRESS || "0x...AiCreditGateway...";

// Backend's wallet (must be the contract OWNER)
export const BACKEND_PRIVATE_KEY: string =
  process.env.BACKEND_PRIVATE_KEY || "0x...YourBackendPrivateKey...";

// Example Crypto Token Addresses (replace with actual network addresses)
export const CRYPTO_TOKENS: Record<string, string> = {
  // Example: Solana Token on a specific EVM chain (e.g., Wormhole wrapped SOL on Polygon)
  SOL: process.env.SOL_TOKEN_ADDRESS || "0x...SOL_Token_Address...",
  USDC: process.env.USDC_TOKEN_ADDRESS || "0x...USDC_Token_Address...",
};

// --- AI Model Pricing Configuration ---
// Prices are defined in USD per 1 Million (1M) Input Tokens (typical unit for pricing)
export const AI_MODEL_PRICING: Record<
  string,
  { inputPrice: number; outputPrice: number }
> = {
  // Model A: Fast, cheap (e.g., GPT-3.5 Turbo or Claude Sonnet)
  AI_FLASHTX: { inputPrice: 0.5, outputPrice: 1.5 }, // $0.50/M Input, $1.50/M Output

  // Model B: Advanced, expensive (e.g., GPT-4o or Claude Opus)
  AI_OPUS_PRO: { inputPrice: 5.0, outputPrice: 15.0 }, // $5.00/M Input, $15.00/M Output
};

// --- External API Configuration ---

// API for real-time crypto price (Example using a mock or a provider like CoinGecko/CoinMarketCap)
export const CRYPTO_PRICE_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

// Placeholder for the LLM API endpoint
export const LLM_API_ENDPOINT = "http://localhost:8080/v1/chat/completions";
