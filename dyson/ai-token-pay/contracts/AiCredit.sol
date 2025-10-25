// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn, uint amountOutMin,
        address[] calldata path, address to, uint deadline
    ) external returns (uint[] memory amounts);
}

contract AiCredit is ReentrancyGuard {
    address public owner;
    IERC20 public stable; // e.g., USDC/DAI used as pricing denom
    IUniswapV2Router public router; // optional DEX router
    bool public allowSwaps;

    // price per AI-model-token in stable tokens (with stable decimals)
    // pricePerModelToken = stableUnits per model token * 1e18 (fixed-point)
    uint256 public pricePerModelToken; // scaled by 1e18 for precision

    mapping(address => uint256) public credits; // modelTokens credits (scaled by 1e18)
    event CreditsPurchased(address indexed buyer, address payToken, uint256 paidAmount, uint256 modelTokenCredits);
    event CreditsConsumed(address indexed user, uint256 modelTokenAmount);
    event Withdraw(address token, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(address _stable, address _router, uint256 _pricePerModelToken) {
        owner = msg.sender;
        stable = IERC20(_stable);
        router = IUniswapV2Router(_router);
        pricePerModelToken = _pricePerModelToken; // e.g., 1 stable = 1e18, price=1e18 => 1 model token per stable
        allowSwaps = _router != address(0);
    }

    /// @notice Buy model-token credits paying with an ERC20 `payToken`.
    /// @param payToken address of token user pays with
    /// @param amountIn amount of payToken user sends/approves before calling
    /// @param minStableOut minimum acceptable stable tokens after swap (if swap used)
    function buyCredits(address payToken, uint256 amountIn, uint256 minStableOut) external nonReentrant {
        require(amountIn > 0, "zero");
        IERC20(payToken).transferFrom(msg.sender, address(this), amountIn);

        uint256 stableReceived;
        if (payToken == address(stable)) {
            stableReceived = amountIn;
        } else {
            require(allowSwaps, "swaps disabled");
            // approve router to spend payToken
            IERC20(payToken).approve(address(router), amountIn);
            address;
            path[0] = payToken;
            path[1] = address(stable);
            uint[] memory amounts = router.swapExactTokensForTokens(amountIn, minStableOut, path, address(this), block.timestamp + 300);
            stableReceived = amounts[amounts.length - 1];
        }

        // compute model token credits: credits = stableReceived / pricePerModelToken
        // both stableReceived and pricePerModelToken are scaled; we'll return credits scaled by 1e18
        // For simplicity we assume stable decimals are compatible (production: normalize decimals)
        uint256 modelTokenCredits = (stableReceived * 1e18) / pricePerModelToken;
        credits[msg.sender] += modelTokenCredits;

        emit CreditsPurchased(msg.sender, payToken, amountIn, modelTokenCredits);
    }

    /// @notice Owner or backend can consume credits on behalf of user (e.g., when model is invoked).
    function consumeCredits(address user, uint256 modelTokenAmount) external onlyOwner {
        require(modelTokenAmount > 0, "zero");
        require(credits[user] >= modelTokenAmount, "insufficient credits");
        credits[user] -= modelTokenAmount;
        emit CreditsConsumed(user, modelTokenAmount);
    }

    /// @notice Admin functions
    function setPricePerModelToken(uint256 newPrice) external onlyOwner {
        pricePerModelToken = newPrice;
    }
    function setRouter(address _router) external onlyOwner { router = IUniswapV2Router(_router); allowSwaps = _router != address(0); }
    function withdraw(address token, uint256 amount, address to) external onlyOwner {
        IERC20(token).transfer(to, amount);
        emit Withdraw(token, amount);
    }
}

