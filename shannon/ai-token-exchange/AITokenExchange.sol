// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title AITokenExchange
 * @dev Exchange blockchain tokens for AI usage credits
 * @notice This contract allows users to swap various tokens for AI credits
 */
contract AITokenExchange is Ownable, ReentrancyGuard, Pausable {
    
    // ===== State Variables =====
    
    /// @notice AI Credit Token (ERC20)
    AICredit public aiCreditToken;
    
    /// @notice Supported token addresses
    mapping(address => bool) public supportedTokens;
    
    /// @notice Exchange rates: tokenAddress => AI provider => rate (in wei)
    /// Rate represents how many AI credits (18 decimals) per 1 token
    mapping(address => mapping(string => uint256)) public exchangeRates;
    
    /// @notice AI provider names
    string[] public aiProviders;
    mapping(string => bool) public providerExists;
    
    /// @noti
