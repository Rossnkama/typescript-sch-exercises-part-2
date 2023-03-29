const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');

describe("Sensitive On-Chain Data Exercise 3", function () {
  
  let attacker;

  const CRYPTIC_RAFFLE_ABI = fs.readFileSync("./test/sensitive-on-chain-data-3/CrypticRaffle.json").toString()
  const CRYPTIC_RAFFLE_ADDRESS = "0xca0B461f6F8Af197069a68f5f8A263b497569140"

  const PARTICIPATION_PRICE = ethers.utils.parseEther('0.01');

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [addictedGambler1, addictedGambler2, attacker] = await ethers.getSigners();

    // Set attacker balance to 0.1 ETH
    await ethers.provider.send("hardhat_setBalance", [
      attacker.address,
      "0x16345785D8A0000", // 0.1 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
    console.log("Attacker initial balance: ", ethers.utils.formatUnits(this.attackerInitialBalance), " ETH")

    // Load CrypticRaffle Contract
    this.crypticRaffle = new ethers.Contract(
      CRYPTIC_RAFFLE_ADDRESS, CRYPTIC_RAFFLE_ABI, addictedGambler1
    )
    
    // addictedGambler2 is trying his strategy
    let numbers;
    for(let i=0; i < 100; i++){
      numbers = [i, 20 + i, 100 - i];
      await this.crypticRaffle.connect(addictedGambler1).guessNumbers(
          numbers, {value: PARTICIPATION_PRICE}
      )
    }

    // addictedGambler2 is trying his strategy
    for(let i=0; i < 100; i++){
      numbers = [i + 1, i + 2, 0];
      await this.crypticRaffle.connect(addictedGambler1).guessNumbers(
          numbers, {value: PARTICIPATION_PRICE}
      )
    }

    this.initialCrypticRaffleBalance = await ethers.provider.getBalance(this.crypticRaffle.address);
    console.log("crypticRaffle initial balance (pot): ", ethers.utils.formatUnits(this.initialCrypticRaffleBalance), " ETH")
  })

  it("Exploit", async () => {    
    /** CODE YOUR SOLUTION HERE */

  })

  after(async () => {
    /** SUCCESS CONDITIONS */

    // No ETH in the cryptoRaffle contract
    const currentCrypticRaffleBalance = await ethers.provider.getBalance(this.crypticRaffle.address);
    console.log("crypticRaffle current balance: ", ethers.utils.formatUnits(currentCrypticRaffleBalance), " ETH")
    expect(currentCrypticRaffleBalance).to.eq(0)

    // Attacker was able to guess the numbers and get all the ETH
    // - 0.1 ETH for transaction fees
    const currentAttackerBalance = await ethers.provider.getBalance(attacker.address)
    console.log("Attacker current balance: ", ethers.utils.formatUnits(currentAttackerBalance), " ETH")
    expect(currentAttackerBalance).to.be.gt(
      this.attackerInitialBalance.add(this.initialCrypticRaffleBalance).sub(ethers.utils.parseEther('0.1'))
    )
  
  })
});
