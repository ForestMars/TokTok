import { ethers } from "ethers";
import * as config from "./config";
import AiCreditAbi from "../abis/AiCredit.json"; // <-- you’ll copy ABI from Hardhat artifacts

export class CreditManager {
  provider: ethers.providers.JsonRpcProvider;
  signer: ethers.Wallet;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.RPC);
    this.signer = new ethers.Wallet(config.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      config.AICREDIT_ADDRESS,
      AiCreditAbi,
      this.signer
    );
  }

  async getCredits(address: string): Promise<ethers.BigNumber> {
    const raw = await this.contract.credits(address);
    return raw; // scaled by 1e18
  }

  async consumeCredits(user: string, amountScaled: ethers.BigNumberish) {
    // owner backend consumes credits
    const tx = await this.contract.consumeCredits(user, amountScaled);
    await tx.wait();
    console.log(`Consumed ${amountScaled.toString()} model tokens for ${user}`);
  }
}
