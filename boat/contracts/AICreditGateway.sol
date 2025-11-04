// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Note: We use the actual IERC20, but the IUniswapV2Router is kept as a placeholder in the requested file structure.

/**
 * @title AiCreditGateway
 * @dev A gateway contract used by the centralized backend to debit a user's pre-approved
 * DeFi tokens based on a real-time crypto-to-USD calculation off-chain.
 * The contract owner is the only address authorized to call the payment function.
 */
contract AiCreditGateway is Ownable {
    // Address where the collected DeFi tokens will be sent (the AI Service Treasury)
    address public immutable treasuryAddress;

    // Event emitted when a user successfully pays for an AI call
    event AITokensPaid(
        address indexed user,
        address indexed tokenPaid,
        uint256 tokenAmount,
        uint256 usdBilled,
        string modelUsed
    );

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    /**
     * @notice The backend service calls this function to debit the calculated crypto amount
     * from the user's pre-approved allowance and transfer it to the treasury.
     * @dev Only callable by the contract owner (the backend service wallet).
     * The user MUST have approved the necessary token amount to this contract beforehand.
     * @param _user The address of the user who requested the AI service.
     * @param _tokenAddress The address of the DeFi token (e.g., SOL, ETH, DAI).
     * @param _tokenAmount The EXACT amount of tokens calculated by the backend to cover the USD cost.
     * @param _usdBilled The USD value of the service consumed (for record-keeping).
     * @param _modelUsed The identifier for the model used (e.g., 'AI_CLAUDE').
     */
    function processPayment(
        address _user,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _usdBilled,
        string memory _modelUsed
    ) external onlyOwner {
        require(_tokenAmount > 0, "Token amount must be greater than zero.");

        IERC20 token = IERC20(_tokenAddress);

        // 1. Transfer the calculated token amount from the user to the treasury (via this contract)
        // This requires the user to have called approve(_tokenAmount) on the token contract previously.
        bool success = token.transferFrom(_user, treasuryAddress, _tokenAmount);
        require(success, "Token transfer failed. Check user allowance or balance.");

        // 2. Emit event for off-chain accounting and tracking
        emit AITokensPaid(_user, _tokenAddress, _tokenAmount, _usdBilled, _modelUsed);
    }

    // --- Utility for Owner ---
    /**
     * @notice Allows the owner to recover any mistakenly sent tokens (optional).
     */
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        token.transfer(owner(), tokenAmount);
    }
}
