#!/bin/bash

# Create the main project directory
mkdir -p ai-token-exchange

# Create backend folder and its contents
mkdir -p ai-token-exchange/backend/smart_contracts
touch ai-token-exchange/backend/main.py
touch ai-token-exchange/backend/blockchain_interface.py
touch ai-token-exchange/backend/requirements.txt

# Create frontend folder
mkdir -p ai-token-exchange/frontend

# Create config folder
mkdir -p ai-token-exchange/config

# Create README.md file
touch ai-token-exchange/README.md

# Print out success message
echo "Directory structure for ai-token-exchange has been created!"

