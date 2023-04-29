import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    ShibaPool,
    ShibaPool__factory,
    ShibaToken,
    ShibaToken__factory,
} from "../../typechain-types";

describe("DOS Exercise 3", function () {
    let deployer: SignerWithAddress,
        user: SignerWithAddress,
        attacker: SignerWithAddress;

    const INITIAL_SUPPLY = parseEther("1000000"); // 1 Million
    const TOKENS_IN_POOL = parseEther("100000"); // 100K
    const ATTACKER_TOKENS = parseEther("10"); // 10

    let token: ShibaToken;
    let pool: ShibaPool;

    let userContract: any; // TODO - Update type to your contract type

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user, attacker] = await ethers.getSigners();

        // Deploy contracts
        const ShibaTokenFactory = (await ethers.getContractFactory(
            "contracts/dos-3/ShibaToken.sol:ShibaToken",
            deployer
        )) as ShibaToken__factory;
        token = await ShibaTokenFactory.deploy(INITIAL_SUPPLY);
        const ShibaPoolFactory = (await ethers.getContractFactory(
            "contracts/dos-3/ShibaPool.sol:ShibaPool",
            deployer
        )) as ShibaPool__factory;
        pool = await ShibaPoolFactory.deploy(token.address);

        // Send tokens
        await token.transfer(attacker.address, ATTACKER_TOKENS);
        await token.approve(pool.address, TOKENS_IN_POOL);
        await pool.depositTokens(TOKENS_IN_POOL);

        // Balances Check
        expect(await token.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);

        expect(await token.balanceOf(attacker.address)).to.equal(
            ATTACKER_TOKENS
        );

        // FlashLoan Check
        const FlashLoanUserFactory = await ethers.getContractFactory(
            "contracts/dos-3/FlashLoanUser.sol:FlashLoanUser",
            user
        );
        userContract = await FlashLoanUserFactory.deploy(pool.address);
        await userContract.requestFlashLoan(10);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        await expect(userContract.requestFlashLoan(10)).to.be.reverted;
    });
});
