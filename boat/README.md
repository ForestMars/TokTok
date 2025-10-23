## Decentralized Payment Mechanism

### 1. Funding (DeFi → AI Credits)
- User calls `buyAICredits(amount)` on the `SynapseExchange.sol` contract.
- The user's DeFi token (e.g., USDC) is transferred to the contract's vault.
- The user's internal `userAIAccount` is incremented by `amount * creditsPerToken`.
- The user now has on-chain AI usage credits.

### 2. Usage (AI Credits → AI Model Output)
- User sends a request to the Python/Flask Backend API (`/api/ai/use_model`), including their Wallet Address (as their user ID).
- The Backend checks the `userAIAccount` on the smart contract for the user's balance.
- If the balance is sufficient, the Backend calls the AI model.
- Crucially, the Backend (using its designated owner wallet) calls `consumeAICredits(user, cost)` on the contract.
- The contract's internal balance for the user is decreased, proving the model usage was paid for.
- The AI model's output is returned to the user.

