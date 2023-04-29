import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits, keccak256 } from "ethers/lib/utils";
import { FindMe, FindMe__factory } from "../../typechain-types";

let deployer: SignerWithAddress,
    user: SignerWithAddress,
    attacker: SignerWithAddress;

describe("Frontrunning Attack Exercise 1", function () {
    let attackerInitialBalance: BigNumber;

    let findMe: FindMe;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user, attacker] = await ethers.getSigners();
        attackerInitialBalance = await ethers.provider.getBalance(
            attacker.address
        );

        const findMeContract = (await ethers.getContractFactory(
            "contracts/frontrunning-1/FindMe.sol:FindMe",
            deployer
        )) as FindMe__factory;
        findMe = await findMeContract.deploy({
            value: parseEther("10"),
        });

        const obfuscatedString = atob("RXRoZXJldW0=");
        await findMe.connect(user).claim(obfuscatedString);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        // Mine all the transactions
        await ethers.provider.send("evm_mine", []);

        // Check if the attacker have in his balance at leat 9.9 more eth than what he had before
        const attackerBalance = await ethers.provider.getBalance(
            attacker.address
        );
        expect(attackerBalance).to.be.gt(
            attackerInitialBalance.add(parseEther("9.9"))
        );
    });
});
