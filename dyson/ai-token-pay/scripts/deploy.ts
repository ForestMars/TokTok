import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const stableAddress = "0x..."; // testnet stable token
  const routerAddress = "0x..."; // testnet uniswap router (or zero to disable)
  const pricePerModelToken = ethers.utils.parseUnits("0.02", 18); // 0.02 stable / model token (scaled by 1e18)
  const AiCredit = await ethers.getContractFactory("AiCredit");
  const ai = await AiCredit.deploy(
    stableAddress,
    routerAddress,
    pricePerModelToken,
  );
  await ai.deployed();
  console.log("AiCredit:", ai.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
