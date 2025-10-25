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
    
    /// @notice User balances per AI provider
    mapping(address => mapping(string => uint256)) public userCredits;
    
    /// @notice Treasury address for collected tokens
    address public treasury;
    
    /// @notice Oracle address for rate updates
    address public oracle;
    
    /// @notice Swap fee (basis points, e.g., 30 = 0.3%)
    uint256 public swapFeeBps = 30;
    
    // ===== Events =====
    
    event TokenSwapped(
        address indexed user,
        address indexed token,
        uint256 tokenAmount,
        string aiProvider,
        uint256 creditsReceived,
        uint256 fee,
        uint256 timestamp
    );
    
    event CreditsUsed(
        address indexed user,
        string aiProvider,
        uint256 creditsUsed,
        uint256 tokensProcessed,
        uint256 timestamp
    );
    
    event ExchangeRateUpdated(
        address indexed token,
        string aiProvider,
        uint256 oldRate,
        uint256 newRate
    );
    
    event TokenAdded(address indexed token, string symbol);
    event ProviderAdded(string provider);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event OracleUpdated(address oldOracle, address newOracle);
    
    // ===== Constructor =====
    
    constructor(address _treasury, address _oracle) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        oracle = _oracle;
        
        // Deploy AI Credit token
        aiCreditToken = new AICredit();
        
        // Add default AI providers
        _addProvider("openai");
        _addProvider("anthropic");
        _addProvider("cohere");
    }
    
    // ===== Modifiers =====
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }
    
    // ===== Main Functions =====
    
    /**
     * @notice Swap blockchain tokens for AI credits
     * @param token Address of the token to swap
     * @param amount Amount of tokens to swap
     * @param aiProvider AI provider to allocate credits for
     */
    function swapForCredits(
        address token,
        uint256 amount,
        string calldata aiProvider
    ) external nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(providerExists[aiProvider], "Provider not supported");
        require(amount > 0, "Amount must be > 0");
        
        uint256 rate = exchangeRates[token][aiProvider];
        require(rate > 0, "Exchange rate not set");
        
        // Transfer tokens from user
        IERC20 tokenContract = IERC20(token);
        require(
            tokenContract.transferFrom(msg.sender, treasury, amount),
            "Token transfer failed"
        );
        
        // Calculate credits (adjusting for token decimals)
        uint256 tokenDecimals = ERC20(token).decimals();
        uint256 credits = (amount * rate) / (10 ** tokenDecimals);
        
        // Calculate and deduct fee
        uint256 fee = (credits * swapFeeBps) / 10000;
        uint256 creditsAfterFee = credits - fee;
        
        // Mint AI credits to this contract
        aiCreditToken.mint(address(this), creditsAfterFee);
        
        // Allocate to user's balance for specific provider
        userCredits[msg.sender][aiProvider] += creditsAfterFee;
        
        emit TokenSwapped(
            msg.sender,
            token,
            amount,
            aiProvider,
            creditsAfterFee,
            fee,
            block.timestamp
        );
    }
    
    /**
     * @notice Deduct credits when AI tokens are used
     * @param user User address
     * @param aiProvider AI provider
     * @param tokensUsed Number of AI tokens used
     */
    function useCredits(
        address user,
        string calldata aiProvider,
        uint256 tokensUsed
    ) external onlyOwner nonReentrant {
        require(providerExists[aiProvider], "Provider not supported");
        
        // Convert AI tokens to credits (1M tokens = 1 credit with 18 decimals)
        uint256 creditsNeeded = (tokensUsed * 1e18) / 1e6;
        
        require(
            userCredits[user][aiProvider] >= creditsNeeded,
            "Insufficient credits"
        );
        
        userCredits[user][aiProvider] -= creditsNeeded;
        
        // Burn the used credits
        aiCreditToken.burn(address(this), creditsNeeded);
        
        emit CreditsUsed(
            user,
            aiProvider,
            creditsNeeded,
            tokensUsed,
            block.timestamp
        );
    }
    
    /**
     * @notice Get user's credit balance for a provider
     */
    function getCreditBalance(
        address user,
        string calldata aiProvider
    ) external view returns (uint256) {
        return userCredits[user][aiProvider];
    }
    
    /**
     * @notice Get all balances for a user
     */
    function getAllBalances(address user) external view returns (
        string[] memory providers,
        uint256[] memory balances
    ) {
        providers = new string[](aiProviders.length);
        balances = new uint256[](aiProviders.length);
        
        for (uint i = 0; i < aiProviders.length; i++) {
            providers[i] = aiProviders[i];
            balances[i] = userCredits[user][aiProviders[i]];
        }
    }
    
    // ===== Admin Functions =====
    
    /**
     * @notice Add a supported token
     */
    function addSupportedToken(
        address token,
        string calldata symbol
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!supportedTokens[token], "Token already supported");
        
        supportedTokens[token] = true;
        emit TokenAdded(token, symbol);
    }
    
    /**
     * @notice Add an AI provider
     */
    function addProvider(string calldata provider) external onlyOwner {
        _addProvider(provider);
    }
    
    function _addProvider(string memory provider) internal {
        require(!providerExists[provider], "Provider exists");
        providerExists[provider] = true;
        aiProviders.push(provider);
        emit ProviderAdded(provider);
    }
    
    /**
     * @notice Update exchange rate (only oracle)
     */
    function updateExchangeRate(
        address token,
        string calldata aiProvider,
        uint256 newRate
    ) external onlyOracle {
        require(supportedTokens[token], "Token not supported");
        require(providerExists[aiProvider], "Provider not supported");
        
        uint256 oldRate = exchangeRates[token][aiProvider];
        exchangeRates[token][aiProvider] = newRate;
        
        emit ExchangeRateUpdated(token, aiProvider, oldRate, newRate);
    }
    
    /**
     * @notice Batch update exchange rates
     */
    function batchUpdateRates(
        address[] calldata tokens,
        string[] calldata providers,
        uint256[] calldata rates
    ) external onlyOracle {
        require(
            tokens.length == providers.length && 
            providers.length == rates.length,
            "Length mismatch"
        );
        
        for (uint i = 0; i < tokens.length; i++) {
            exchangeRates[tokens[i]][providers[i]] = rates[i];
            emit ExchangeRateUpdated(tokens[i], providers[i], 0, rates[i]);
        }
    }
    
    /**
     * @notice Update treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }
    
    /**
     * @notice Update oracle address
     */
    function updateOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle");
        address oldOracle = oracle;
        oracle = newOracle;
        emit OracleUpdated(oldOracle, newOracle);
    }
    
    /**
     * @notice Update swap fee
     */
    function updateSwapFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 500, "Fee too high"); // Max 5%
        swapFeeBps = newFeeBps;
    }
    
    /**
     * @notice Pause/unpause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}

/**
 * @title AICredit
 * @dev ERC20 token representing AI usage credits
 */
contract AICredit is ERC20, Ownable {
    constructor() ERC20("AI Credit", "AIC") {}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
    
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
