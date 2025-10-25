# AI Token Exchange Backend
# Main application server for exchanging blockchain tokens for AI credits

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uvicorn
from decimal import Decimal
import hashlib

app = FastAPI(title="AI Token Exchange", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Data Models =====

class TokenSwapRequest(BaseModel):
    wallet_address: str
    blockchain_token_amount: Decimal
    blockchain_token_symbol: str
    ai_provider: str  # "openai", "anthropic", "cohere", etc.
    
class SwapResponse(BaseModel):
    swap_id: str
    wallet_address: str
    blockchain_tokens_sent: Decimal
    ai_credits_received: Decimal
    exchange_rate: Decimal
    timestamp: datetime
    status: str
    transaction_hash: Optional[str] = None

class AIUsageRequest(BaseModel):
    user_id: str
    ai_provider: str
    tokens_used: int
    model: str

class BalanceResponse(BaseModel):
    wallet_address: str
    ai_provider: str
    credit_balance: Decimal
    tokens_available: int

# ===== In-Memory Storage (Replace with Database) =====

user_balances = {}  # {wallet_address: {provider: credits}}
swap_history = []
exchange_rates = {
    "USDC": {"openai": 0.00002, "anthropic": 0.000015, "cohere": 0.00001},
    "ETH": {"openai": 50.0, "anthropic": 66.67, "cohere": 100.0},
    "MATIC": {"openai": 0.002, "anthropic": 0.0015, "cohere": 0.001},
}

# ===== Helper Functions =====

def generate_swap_id(wallet: str, amount: Decimal) -> str:
    data = f"{wallet}{amount}{datetime.now().isoformat()}"
    return hashlib.sha256(data.encode()).hexdigest()[:16]

def get_exchange_rate(token_symbol: str, ai_provider: str) -> Decimal:
    if token_symbol not in exchange_rates:
        raise HTTPException(status_code=400, detail=f"Unsupported token: {token_symbol}")
    if ai_provider not in exchange_rates[token_symbol]:
        raise HTTPException(status_code=400, detail=f"Unsupported AI provider: {ai_provider}")
    return Decimal(str(exchange_rates[token_symbol][ai_provider]))

def calculate_ai_credits(blockchain_amount: Decimal, token_symbol: str, ai_provider: str) -> Decimal:
    rate = get_exchange_rate(token_symbol, ai_provider)
    return blockchain_amount * rate

# ===== API Endpoints =====

@app.get("/")
def root():
    return {
        "service": "AI Token Exchange",
        "version": "1.0.0",
        "description": "Exchange blockchain tokens for AI model usage credits"
    }

@app.get("/exchange-rates")
def get_rates():
    """Get current exchange rates for all supported token pairs"""
    return exchange_rates

@app.post("/swap", response_model=SwapResponse)
def swap_tokens(request: TokenSwapRequest):
    """
    Exchange blockchain tokens for AI credits
    In production, this would interact with smart contracts
    """
    ai_credits = calculate_ai_credits(
        request.blockchain_token_amount,
        request.blockchain_token_symbol,
        request.ai_provider
    )
    
    swap_id = generate_swap_id(request.wallet_address, request.blockchain_token_amount)
    
    # Update user balance
    if request.wallet_address not in user_balances:
        user_balances[request.wallet_address] = {}
    if request.ai_provider not in user_balances[request.wallet_address]:
        user_balances[request.wallet_address][request.ai_provider] = Decimal(0)
    
    user_balances[request.wallet_address][request.ai_provider] += ai_credits
    
    # Record swap
    swap = SwapResponse(
        swap_id=swap_id,
        wallet_address=request.wallet_address,
        blockchain_tokens_sent=request.blockchain_token_amount,
        ai_credits_received=ai_credits,
        exchange_rate=get_exchange_rate(request.blockchain_token_symbol, request.ai_provider),
        timestamp=datetime.now(),
        status="completed",
        transaction_hash=f"0x{hashlib.sha256(swap_id.encode()).hexdigest()}"
    )
    swap_history.append(swap)
    
    return swap

@app.get("/balance/{wallet_address}", response_model=List[BalanceResponse])
def get_balance(wallet_address: str):
    """Get AI credit balance for a wallet address"""
    if wallet_address not in user_balances:
        return []
    
    balances = []
    for provider, credits in user_balances[wallet_address].items():
        # Rough conversion: 1 credit = 1000 tokens
        tokens = int(credits * 1000000)
        balances.append(BalanceResponse(
            wallet_address=wallet_address,
            ai_provider=provider,
            credit_balance=credits,
            tokens_available=tokens
        ))
    return balances

@app.post("/use-credits")
def use_ai_credits(request: AIUsageRequest):
    """
    Deduct credits when AI tokens are used
    This would be called by the AI gateway/proxy
    """
    if request.user_id not in user_balances:
        raise HTTPException(status_code=404, detail="No balance found for user")
    
    if request.ai_provider not in user_balances[request.user_id]:
        raise HTTPException(status_code=404, detail=f"No {request.ai_provider} credits found")
    
    # Convert tokens to credits (rough estimate)
    credits_needed = Decimal(request.tokens_used) / Decimal(1000000)
    
    if user_balances[request.user_id][request.ai_provider] < credits_needed:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    user_balances[request.user_id][request.ai_provider] -= credits_needed
    
    return {
        "success": True,
        "credits_used": float(credits_needed),
        "remaining_balance": float(user_balances[request.user_id][request.ai_provider])
    }

@app.get("/swap-history/{wallet_address}")
def get_swap_history(wallet_address: str):
    """Get swap history for a wallet"""
    history = [swap for swap in swap_history if swap.wallet_address == wallet_address]
    return history

@app.get("/supported-tokens")
def get_supported_tokens():
    """List all supported blockchain tokens and AI providers"""
    return {
        "blockchain_tokens": list(exchange_rates.keys()),
        "ai_providers": ["openai", "anthropic", "cohere"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
