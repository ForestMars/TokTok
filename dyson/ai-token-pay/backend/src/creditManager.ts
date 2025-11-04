import {
  ethers,
  Contract,
  JsonRpcProvider,
  Interface,
  BigNumberish,
} from "ethers";
import axios from "axios";
import {
  GATEWAY_CONTRACT_ADDRESS,
  CRYPTO_TOKENS,
  AI_MODEL_PRICING,
  CRYPTO_PRICE_API_URL,
  RPC_URL,
  BACKEND_PRIVATE_KEY,
} from "./config";
import AiCreditGatewayAbi from "./AiCreditGateway.abi.json"; // Assume ABI is generated/copied here

// Interface for the token contract (minimal ABI)
const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

// --- Web3 and Provider Setup ---
const provider = new JsonRpcProvider(RPC_URL);
const backendWallet = new ethers.Wallet(BACKEND_PRIVATE_KEY, provider);

// Gateway Contract Instance
const gatewayContract = new Contract(
  GATEWAY_CONTRACT_ADDRESS,
  AiCreditGatewayAbi as any, // Replace with your generated ABI file import
  backendWallet, // Connected with the OWNER wallet for sending transactions
);

/**
 * Fetches the real-time USD price of the given crypto token.
 * @param tokenSymbol The symbol of the token (e.g., 'SOL').
 * @returns The price in USD (e.g., 150.75).
 */
async function fetchTokenPrice(tokenSymbol: string): Promise<number> {
  try {
    // NOTE: This uses a mock CoinGecko URL for 'solana'. Adjust for other tokens.
    const response = await axios.get(CRYPTO_PRICE_API_URL);
    const priceData = response.data;

    // Assuming priceData structure is {'solana': {'usd': 150.75}}
    const price = priceData["solana"]?.usd;

    if (typeof price !== "number" || price <= 0) {
      throw new Error(`Invalid price response for ${tokenSymbol}`);
    }
    console.log(`[Price Feed] Current ${tokenSymbol}/USD price: $${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${tokenSymbol}:`, error);
    // Fallback or throw error depending on required resilience
    throw new Error(`Failed to fetch real-time price for ${tokenSymbol}`);
  }
}

/**
 * Calculates the total USD cost for an AI query based on token usage.
 * @param modelKey The AI model used.
 * @param inputTokens The number of input tokens.
 * @param outputTokens The number of output tokens.
 * @returns The total cost in USD (as a number).
 */
export function calculateUSDCost(
  modelKey: keyof typeof AI_MODEL_PRICING,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = AI_MODEL_PRICING[modelKey];
  if (!pricing) {
    throw new Error(`Pricing not found for model: ${modelKey}`);
  }

  // Prices are in USD per 1,000,000 tokens
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

  const totalCostUSD = inputCost + outputCost;

  console.log(
    `[Billing] Cost Breakdown: Input=$${inputCost.toFixed(6)}, Output=$${outputCost.toFixed(6)}. Total=$${totalCostUSD.toFixed(6)}`,
  );
  return totalCostUSD;
}

/**
 * Handles the end-to-end payment processing and debits the user's wallet on-chain.
 * @param userAddress The user's wallet address.
 * @param tokenSymbol The crypto token used for payment (e.g., 'SOL').
 * @param modelKey The AI model used.
 * @param totalCostUSD The final USD cost calculated.
 * @param tokenDecimals The decimals of the payment token.
 * @returns The transaction hash of the on-chain payment.
 */
export async function processOnChainPayment(
  userAddress: string,
  tokenSymbol: string,
  modelKey: string,
  totalCostUSD: number,
  tokenDecimals: number,
): Promise<string> {
  const tokenAddress = CRYPTO_TOKENS[tokenSymbol];
  if (!tokenAddress) {
    throw new Error(`Token address not configured for ${tokenSymbol}`);
  }

  // 1. Get real-time price for the crypto token
  const tokenPriceUSD = await fetchTokenPrice(tokenSymbol);

  // 2. Calculate the exact crypto token amount required
  const tokenAmountRequired = totalCostUSD / tokenPriceUSD;

  // 3. Convert the required token amount to the contract's smallest unit (Wei/Gwei/etc.)
  const tokenAmountWei = ethers.parseUnits(
    tokenAmountRequired.toFixed(tokenDecimals),
    tokenDecimals,
  );

  // 4. Check user allowance (pre-approval)
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
  const allowance: BigNumberish = await tokenContract.allowance(
    userAddress,
    GATEWAY_CONTRACT_ADDRESS,
  );

  if (allowance < tokenAmountWei) {
    const requiredAmountString = ethers.formatUnits(
      tokenAmountWei,
      tokenDecimals,
    );
    throw new Error(
      `Insufficient allowance. User needs to approve ${requiredAmountString} ${tokenSymbol} to the gateway contract.`,
    );
  }

  console.log(
    `[Payment] Debiting ${ethers.formatUnits(tokenAmountWei, tokenDecimals)} ${tokenSymbol} (Value: $${totalCostUSD.toFixed(2)}) from ${userAddress}`,
  );

  // 5. Send the transaction to the AiCreditGateway
  const usdBilledWei = ethers.parseUnits(totalCostUSD.toFixed(2), 2); // Store USD billed in 2 decimals

  const tx = await gatewayContract.processPayment(
    userAddress,
    tokenAddress,
    tokenAmountWei,
    usdBilledWei,
    modelKey,
    { gasLimit: 300000 }, // Estimate appropriate gas limit
  );

  await tx.wait();

  return tx.hash;
}
