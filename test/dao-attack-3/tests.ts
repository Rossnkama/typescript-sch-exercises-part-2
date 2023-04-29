import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    DAOToken,
    DAOToken__factory,
    Governance,
    Governance__factory,
    LendingPool,
    LendingPool__factory,
    Treasury,
    Treasury__factory,
} from "../../typechain-types";

describe("DAO Attack Exercise 3", function () {
    let deployer: SignerWithAddress,
        member1: SignerWithAddress,
        member2: SignerWithAddress,
        attacker: SignerWithAddress;

    // DAO Tokens
    const DEPLOYER_TOKENS = parseEther("2500000"); // 2.5M Tokens
    const MEMBER_1_TOKENS = parseEther("500000"); // 500K Tokens
    const MEMBER_2_TOKENS = parseEther("1000000"); // 1M Tokens
    const TOKENS_IN_POOL = parseEther("2000000"); // 2M tokens

    // Treasury ETH
    const ETH_IN_TREASURY = parseEther("1500"); // 1500 ETH

    let token: DAOToken;
    let pool: LendingPool;
    let treasury: Treasury;
    let governance: Governance;

    let attackerInitialETHBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, member1, member2, attacker] = await ethers.getSigners();

        attackerInitialETHBalance = await ethers.provider.getBalance(
            attacker.address
        );

        // Contract Factories
        const DAOTokenFactory = (await ethers.getContractFactory(
            "contracts/dao-attack-3/DAOToken.sol:DAOToken",
            deployer
        )) as DAOToken__factory;
        const GovernanceFactory = (await ethers.getContractFactory(
            "contracts/dao-attack-3/Governance.sol:Governance",
            deployer
        )) as Governance__factory;
        const LendingPoolFactory = (await ethers.getContractFactory(
            "contracts/dao-attack-3/LendingPool.sol:LendingPool",
            deployer
        )) as LendingPool__factory;
        const TreasuryFactory = (await ethers.getContractFactory(
            "contracts/dao-attack-3/Treasury.sol:Treasury",
            deployer
        )) as Treasury__factory;

        // Deploy and Setup Contracts
        token = await DAOTokenFactory.deploy();
        pool = await LendingPoolFactory.deploy(token.address);
        treasury = await TreasuryFactory.deploy();
        governance = await GovernanceFactory.deploy(
            token.address,
            treasury.address
        );
        await treasury.setGovernance(governance.address);

        // Send ETH to Treasury
        await deployer.sendTransaction({
            to: treasury.address,
            value: ETH_IN_TREASURY,
        });
        expect(await ethers.provider.getBalance(treasury.address)).to.be.equal(
            ETH_IN_TREASURY
        );

        // Mint tokens
        await token.mint(deployer.address, DEPLOYER_TOKENS);
        await token.mint(member1.address, MEMBER_1_TOKENS);
        await token.mint(member2.address, MEMBER_2_TOKENS);
        await token.mint(pool.address, TOKENS_IN_POOL);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // No ETH left in treasury
        expect(await ethers.provider.getBalance(treasury.address)).to.be.equal(
            "0"
        );

        // Attacker has taken all ETH from treasury
        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
            attackerInitialETHBalance
                .add(ETH_IN_TREASURY)
                .sub(parseEther("0.2"))
        );
    });
});
