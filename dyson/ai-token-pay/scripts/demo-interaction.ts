import { ethers } from "hardhat";

async function main() {
  const [user] = await ethers.getSigners();
  const address = process.env.AICREDIT_ADDRESS!;
  const AiCredit = await ethers.getContractAt("AiCredit", address);

  const credits = await AiCredit.credits(user.address);
  console.log(
    `User ${user.address} has ${ethers.utils.formatUnits(credits, 18)} AI credits.`,
  );
}

main().catch(console.error);
