import os
from flask import Flask, request, jsonify
from web3 import Web3
import requests # For calling the actual AI model API

# --- Configuration ---
app = Flask(__name__)

# Replace with your actual RPC URL, Contract Address, and ABI
WEB3_PROVIDER_URL = os.environ.get('WEB3_PROVIDER_URL', 'YOUR_RPC_URL')
CONTRACT_ADDRESS = os.environ.get('CONTRACT_ADDRESS', '0x...YourContractAddress...')
# ABI is simplified for this example
CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_creditCost","type":"uint256"}],"name":"consumeAICredits","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userAIAccount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

# Wallet used by the backend to sign and send `consumeAICredits` transactions
BACKEND_WALLET_PRIVATE_KEY = os.environ.get('BACKEND_WALLET_PRIVATE_KEY', '0x...YourPrivateKey...')
BACKEND_WALLET_ADDRESS = os.environ.get('BACKEND_WALLET_ADDRESS', '0x...YourBackendAddress...')
AI_MODEL_ENDPOINT = 'http://ai-service-provider/api/v1/generate'

# --- Web3 Setup ---
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))
synapse_contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# --- Utility Function ---
def consume_credits_on_chain(user_address: str, cost: int):
    """Sends a transaction to the smart contract to deduct credits."""
    if not w3.is_connected():
        raise ConnectionError("Web3 provider is not connected.")

    # Build the transaction to call the onlyOwner function `consumeAICredits`
    nonce = w3.eth.get_transaction_count(BACKEND_WALLET_ADDRESS)
    
    tx = synapse_contract.functions.consumeAICredits(
        user_address, 
        cost
    ).build_transaction({
        'chainId': w3.eth.chain_id,
        'gas': 200000, # Estimate a reasonable gas limit
        'gasPrice': w3.eth.gas_price,
        'nonce': nonce,
    })

    # Sign and send the transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=BACKEND_WALLET_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    
    # Optionally, wait for the transaction to be mined for confirmation
    w3.eth.wait_for_transaction_receipt(tx_hash)
    
    return tx_hash.hex()

# --- API Endpoints ---

@app.route('/api/ai/check_balance/<user_address>', methods=['GET'])
def check_balance(user_address):
    """Checks the user's AI credit balance from the smart contract."""
    try:
        balance = synapse_contract.functions.userAIAccount(user_address).call()
        return jsonify({'address': user_address, 'balance': balance}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/use_model', methods=['POST'])
def use_model():
    """Endpoint for users to pay with credits and get an AI response."""
    data = request.json
    user_address = data.get('user_address') # Wallet address of the user
    prompt = data.get('prompt')
    
    if not user_address or not prompt:
        return jsonify({'error': 'Missing user_address or prompt'}), 400

    # 1. Determine the cost of the AI call (e.g., based on prompt length, model complexity)
    # This is simplified. In reality, you might estimate this better.
    estimated_cost = len(prompt) * 10 
    
    # 2. Check if the user has enough credits on-chain
    current_balance = synapse_contract.functions.userAIAccount(user_address).call()
    if current_balance < estimated_cost:
        return jsonify({'error': f'Insufficient credits. Current: {current_balance}, Required: {estimated_cost}'}), 402

    # 3. Call the actual AI model (Simulated)
    # response = requests.post(AI_MODEL_ENDPOINT, json={'prompt': prompt, 'address': user_address})
    # if response.status_code != 200:
    #     return jsonify({'error': 'AI Model Service Error'}), 503

    # Simulated AI Response
    ai_response_text = f"AI Response for: '{prompt[:20]}...' [Cost: {estimated_cost} credits]"

    # 4. **CRITICAL STEP**: Deduct the credits on the blockchain
    try:
        tx_hash = consume_credits_on_chain(user_address, estimated_cost)
        print(f"Credits consumed on-chain. TX: {tx_hash}")
    except Exception as e:
        # NOTE: Implement robust compensation/retry logic here! 
        # If the blockchain call fails *after* successful AI call, the user was 'charged' but not debited.
        print(f"CRITICAL: Failed to deduct credits for user {user_address}. Error: {e}")
        # Return success but log the debit failure for manual/automatic reconciliation
        return jsonify({'warning': 'AI call succeeded but credit deduction failed. Reconcile TX required.', 
                        'result': ai_response_text}), 200


    return jsonify({
        'result': ai_response_text,
        'credits_deducted': estimated_cost,
        'new_balance': current_balance - estimated_cost
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
