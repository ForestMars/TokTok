# AI Token Pay — Proof of Concept

A minimal DeFi-style prototype allowing blockchain ERC-20 tokens to pay for AI model usage.
Users buy *AI Model Credits* on-chain; the backend consumes those credits when model tokens are used.

---

## Architecture

contracts/ → Solidity smart contracts (AiCredit.sol)
backend/ → Node.js/TypeScript server watching contract events and calling AI models
frontend/ → React app for buying credits and connecting wallet
scripts/ → Deployment and demo scripts

yaml
Copy code

---

## Quickstart

### 1. Setup environment
```bash
git clone https://github.com/<you>/ai-token-pay.git
cd ai-token-pay
npm install
2. Start a local Hardhat node and deploy
bash
Copy code
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
Copy the deployed AiCredit address.

3. Start backend
bash
Copy code
cd backend
npm install
export RPC=http://localhost:8545
export PRIVATE_KEY=<your_deployer_private_key>
export AICREDIT_ADDRESS=<contract_address>
npm run build && npm start
4. Start frontend
bash
Copy code
cd frontend
npm install
REACT_APP_AICREDIT_ADDRESS=<contract_address> npm start
Usage
Connect your wallet.

Approve and purchase credits using an ERC-20 token (e.g., DAI or USDC).

Use the backend /use-model endpoint to consume credits and run prompts.

Security / Production Notes
Normalize decimals for real ERC-20s (USDC 6 decimals, ETH 18, etc.)

Add Chainlink or TWAP oracles for pricing.

Protect swaps with slippage limits.

Don’t call consumeCredits on every request on-chain; use off-chain ledgers or periodic settlement.
