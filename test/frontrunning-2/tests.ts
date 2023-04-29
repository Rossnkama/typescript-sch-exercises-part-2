import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { Referrals, Referrals__factory } from "../../typechain-types";

describe("Frontrunning Attack Exercise 2", function () {
    let deployer: SignerWithAddress,
        user: SignerWithAddress,
        attacker: SignerWithAddress;

    let referrals: Referrals;

    let referralCode: string;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user, attacker] = await ethers.getSigners();

        // Deploy contract
        const referralsContract = (await ethers.getContractFactory(
            "contracts/frontrunning-2/Referrals.sol:Referrals",
            deployer
        )) as Referrals__factory;
        referrals = await referralsContract.deploy();

        // Send some random tx's
        for (let i = 0; i < 100; i++) {
            await deployer.sendTransaction({
                to: ethers.Wallet.createRandom().address,
                value: parseEther("0.01"),
            });
        }

        // Assign referal code to user
        referralCode = ethers.utils.keccak256(user.address);
        await referrals.connect(user).createReferralCode(referralCode);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        // Mine all the transactions
        await ethers.provider.send("evm_mine", []);

        // Attacker should steal the user's refferal code
        expect(await referrals.getReferral(referralCode)).to.equal(
            attacker.address
        );
    });
});
