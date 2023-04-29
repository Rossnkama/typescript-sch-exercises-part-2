import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    Pool__factory,
    Token__factory,
} from "../../typechain-types/factories/contracts/flash-loan-attacks-1";
import {
    Pool,
    Token,
} from "../../typechain-types/contracts/flash-loan-attacks-1";

describe("Flash Loan Attacks Exercise 1", function () {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;

    const POOL_TOKENS = parseEther("100000000"); // 100M tokens

    let token: Token;
    let pool: Pool;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        // Deploy token & pool
        const Token = (await ethers.getContractFactory(
            "contracts/flash-loan-attacks-1/Token.sol:Token",
            deployer
        )) as Token__factory;
        const Pool = (await ethers.getContractFactory(
            "contracts/flash-loan-attacks-1/Pool.sol:Pool",
            deployer
        )) as Pool__factory;
        token = await Token.deploy();
        pool = await Pool.deploy(token.address);

        // Transfer tokens to pool
        await token.transfer(pool.address, POOL_TOKENS);

        // Pool should have 100M, attacker should have 0 tokens
        expect(await token.balanceOf(pool.address)).to.equal(POOL_TOKENS);
        expect(await token.balanceOf(attacker.address)).to.equal("0");
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker successfully stole all tokens form the pool
        expect(await token.balanceOf(attacker.address)).to.equal(POOL_TOKENS);
        expect(await token.balanceOf(pool.address)).to.equal("0");
    });
});
