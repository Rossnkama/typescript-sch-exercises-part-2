const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Frontrunning Attack Exercise 2', function () {
  let deployer, user, attacker;

  before(async function () {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [deployer, user, attacker] = await ethers.getSigners();

    // Deploy contract
    const referralsContract = await ethers.getContractFactory(
      'contracts/frontrunning-2/Referrals.sol:Referrals',
      deployer
    );
    this.referrals = await referralsContract.deploy();

    // Send some random tx's
    for (let i = 0; i < 100; i++) {
      await deployer.sendTransaction({
        to: ethers.Wallet.createRandom().address,
        value: ethers.utils.parseEther('0.01'),
      });
    }

    // Assign referal code to user
    this.referralCode = ethers.utils.keccak256(user.address);
    await this.referrals.connect(user).createReferralCode(this.referralCode);
  });

  it('Exploit', async function () {
    /** CODE YOUR SOLUTION HERE */

  });

  after(async function () {

    // Mine all the transactions
    await ethers.provider.send('evm_mine', []);

    // Attacker should steal the user's refferal code
    expect(await this.referrals.getReferral(this.referralCode)).to.equal(attacker.address);
    
  });
  
});
