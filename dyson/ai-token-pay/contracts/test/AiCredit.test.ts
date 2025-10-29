import { expect } from "chai";
import { ethers } from "hardhat";

describe("AiCredit", function () {
  it("allows buying credits with stable token", async function () {
    const [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20Mock");
    const stable = await Token.deploy(
      "Stable",
      "STB",
      owner.address,
      ethers.utils.parseUnits("10000", 18),
    );

    const AiCredit = await ethers.getContractFactory("AiCredit");
    const contract = await AiCredit.deploy(
      stable.address,
      ethers.constants.AddressZero,
      ethers.utils.parseUnits("1", 18),
    );

    await stable.transfer(user.address, ethers.utils.parseUnits("100", 18));
    const userStable = stable.connect(user);
    await userStable.approve(
      contract.address,
      ethers.utils.parseUnits("10", 18),
    );

    await contract
      .connect(user)
      .buyCredits(stable.address, ethers.utils.parseUnits("10", 18), 0);

    const credits = await contract.credits(user.address);
    expect(credits).to.equal(ethers.utils.parseUnits("10", 18));
  });
});
