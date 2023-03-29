const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEFI Crash Course: Money Markets Exercise 2 - Compound V2 Excercise", () => {
  /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

  let user;

  const COMPOUND_COMPTROLLER = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";

  // Compound USDC Receipt Token
  const C_USDC = "0x39AA39c021dfbaE8faC545936693aC917d5E7563";
  // Compound DAI Receipt Token
  const C_DAI = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";
    
  const USER_USDC_BALANCE = ethers.utils.parseUnits("100000", 6)
  const AMOUNT_TO_DEPOSIT = ethers.utils.parseUnits("1000", 6);
  const AMOUNT_TO_BORROW = ethers.utils.parseUnits("100", 18);

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [user] = await ethers.getSigners();

    // Load tokens
    this.usdc = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      USDC,
      user
    );
    this.dai = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      DAI,
      user
    );
    this.cUsdc = await hre.ethers.getContractAt(
      'contracts/money-markets-2/CompoundInterfaces.sol:cERC20',
      C_USDC,
      user
    );
    this.cDai = await hre.ethers.getContractAt(
      'contracts/money-markets-2/CompoundInterfaces.sol:cERC20',
      C_DAI,
      user
    );

    // Whale impersonation
    const whaleSigner = await ethers.getImpersonatedSigner(WHALE)

    // Set user & whale balance to 2 ETH
    await ethers.provider.send("hardhat_setBalance", [
      user.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      whaleSigner.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);

    // Transfer USDC to the user
    await this.usdc.connect(whaleSigner).transfer(user.address, USER_USDC_BALANCE);
    // Burn DAI balance form the user (somehow this signer has DAI on mainnet lol)
    await this.dai.connect(user).transfer(
      "0x000000000000000000000000000000000000dEaD", await this.dai.balanceOf(user.address)
    );
  })

  it("Student Tests", async () => {
    /** CODE YOUR SOLUTION HERE */
    
    // TODO: Deploy CompoundUser.sol smart contract

    // TODO: Complete all the following tests using your deployed smart contract
    
    // TODO: Deposit 1000 USDC to compound

    // TODO: Validate that the depositedAmount state var was changed
    
    // TODO: Store the cUSDC tokens that were minted to the compoundUser contract in `this.cUSDCBalanceBefore`
    
    // TODO: Validate that your contract received cUSDC tokens (receipt tokens)
    

    // TODO: Allow USDC as collateral
    
    // TODO: Borrow 100 DAI against the deposited USDC
    
    // TODO: Validate that the borrowedAmount state var was changed
    
    // TODO: Validate that the user received the DAI Tokens
    

    // TODO: Repay all the borrowed DAI
    
    // TODO: Validate that the borrowedAmount state var was changed
    
    // TODO: Validate that the user doesn't own the DAI tokens
    

    // TODO: Withdraw all your USDC

    // TODO: Validate that the depositedAmount state var was changed
    
    // TODO: Validate that the user got the USDC tokens back
    
    // TODO: Validate that the majority of the cUSDC tokens (99.9%) were burned, and the contract doesn't own them
    // NOTE: There are still some cUSDC tokens left, since we accumelated positive interest

  })
})