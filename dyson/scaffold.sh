#!/bin/bash

# Define the root project directory name
PROJECT_ROOT="ai-token-pay"

echo "Creating project structure for $PROJECT_ROOT..."

# 1. Create all necessary directories using mkdir -p
mkdir -p "$PROJECT_ROOT"/contracts/interfaces \
         "$PROJECT_ROOT"/contracts/test \
         "$PROJECT_ROOT"/backend/src \
         "$PROJECT_ROOT"/frontend/src \
         "$PROJECT_ROOT"/scripts

echo "Directories created."

# 2. Create required placeholder files using touch

# Top-level files
touch "$PROJECT_ROOT"/hardhat.config.ts
touch "$PROJECT_ROOT"/README.md

# Contracts files
touch "$PROJECT_ROOT"/contracts/AiCredit.sol
touch "$PROJECT_ROOT"/contracts/interfaces/IUniswapV2Router.sol

# Scripts files
touch "$PROJECT_ROOT"/scripts/deploy.ts
touch "$PROJECT_ROOT"/scripts/demo-interaction.ts

# Backend files
touch "$PROJECT_ROOT"/backend/package.json
touch "$PROJECT_ROOT"/backend/tsconfig.json
touch "$PROJECT_ROOT"/backend/src/index.ts
touch "$PROJECT_ROOT"/backend/src/aiClient.ts
touch "$PROJECT_ROOT"/backend/src/creditManager.ts
touch "$PROJECT_ROOT"/backend/src/config.ts

# Frontend files
touch "$PROJECT_ROOT"/frontend/package.json
touch "$PROJECT_ROOT"/frontend/src/App.tsx
touch "$PROJECT_ROOT"/frontend/src/BuyCredits.tsx
touch "$PROJECT_ROOT"/frontend/src/wallet.ts

echo "Placeholder files created."
echo "Project structure successfully generated in the '$PROJECT_ROOT' directory."

