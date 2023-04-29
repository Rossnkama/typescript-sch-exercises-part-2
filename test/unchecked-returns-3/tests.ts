import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    DAI,
    DAI__factory,
    StableSwap,
    StableSwap__factory,
    USDC,
    USDC__factory,
    UST,
    UST__factory,
} from "../../typechain-types";

describe("Unchecked Returns Exercise 3", function () {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;

    const TOKENS_INITIAL_SUPPLY = parseUnits("100000000", 6); // $100M
    const TOKENS_IN_STABLESWAP = parseUnits("1000000", 6); // $1M
    const CHAIN_ID = 31337;

    let ust: UST;
    let dai: DAI;
    let usdc: USDC;

    let stableSwap: StableSwap;

    let stableSwapDAIBalance: BigNumber;
    let stableSwapUSDCBalance: BigNumber;
    let stableSwapUSTBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        // Deploy Tokens
        // Deploy UST
        const USTFactory = (await ethers.getContractFactory(
            "contracts/unchecked-returns-3/UST.sol:UST",
            deployer
        )) as UST__factory;
        ust = await USTFactory.deploy(
            TOKENS_INITIAL_SUPPLY,
            "Terra USD",
            "UST",
            6
        );
        // Deploy DAI
        const DAIFactory = (await ethers.getContractFactory(
            "contracts/unchecked-returns-3/DAI.sol:DAI",
            deployer
        )) as DAI__factory;
        dai = await DAIFactory.deploy(CHAIN_ID);
        // Deploy USDC
        const USDCFactory = (await ethers.getContractFactory(
            "contracts/unchecked-returns-3/USDC.sol:USDC",
            deployer
        )) as USDC__factory;
        usdc = await USDCFactory.deploy();
        await usdc.initialize(
            "Center Coin",
            "USDC",
            "USDC",
            6,
            deployer.address,
            deployer.address,
            deployer.address,
            deployer.address
        );

        // Mint Tokens to Deployer
        await dai.mint(deployer.address, TOKENS_INITIAL_SUPPLY);
        await usdc.configureMinter(deployer.address, TOKENS_INITIAL_SUPPLY);
        await usdc.mint(deployer.address, TOKENS_INITIAL_SUPPLY);

        // Deploy StableSwap
        const StableSwapFactory = (await ethers.getContractFactory(
            "contracts/unchecked-returns-3/StableSwap.sol:StableSwap",
            deployer
        )) as StableSwap__factory;
        stableSwap = await StableSwapFactory.deploy([
            ust.address,
            usdc.address,
            dai.address,
        ]);

        // Check allowed tokens
        expect(
            await stableSwap.isSupported(usdc.address, dai.address)
        ).to.equal(true);
        expect(
            await stableSwap.isSupported(usdc.address, ust.address)
        ).to.equal(true);

        // Send tokens to StableSwap
        await ust.transfer(stableSwap.address, TOKENS_IN_STABLESWAP);
        await dai.transfer(stableSwap.address, TOKENS_IN_STABLESWAP);
        await usdc.transfer(stableSwap.address, TOKENS_IN_STABLESWAP);

        // Check StableSwap Balance
        expect(await ust.balanceOf(stableSwap.address)).to.equal(
            TOKENS_IN_STABLESWAP
        );
        expect(await dai.balanceOf(stableSwap.address)).to.equal(
            TOKENS_IN_STABLESWAP
        );
        expect(await usdc.balanceOf(stableSwap.address)).to.equal(
            TOKENS_IN_STABLESWAP
        );

        // Swap works, balances are ok
        let amount = parseUnits("100", 6);
        await usdc.approve(stableSwap.address, amount);
        expect(
            stableSwap.swap(usdc.address, dai.address, amount)
        ).to.not.be.reverted;
        expect(await usdc.balanceOf(stableSwap.address)).to.equal(
            TOKENS_IN_STABLESWAP.add(amount)
        );
        expect(await dai.balanceOf(stableSwap.address)).to.equal(
            TOKENS_IN_STABLESWAP.sub(amount)
        );

        // Swap fails without allowance
        expect(
            stableSwap.swap(usdc.address, dai.address, amount)
        ).to.be.reverted;

        stableSwapDAIBalance = await dai.balanceOf(stableSwap.address);
        stableSwapUSDCBalance = await usdc.balanceOf(stableSwap.address);
        stableSwapUSTBalance = await ust.balanceOf(stableSwap.address);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker was able to drain the entire protocol balance!
        expect(await usdc.balanceOf(stableSwap.address)).to.equal(0);
        expect(await dai.balanceOf(stableSwap.address)).to.equal(0);
        expect(await ust.balanceOf(stableSwap.address)).to.equal(0);

        expect(await usdc.balanceOf(attacker.address)).to.equal(
            stableSwapUSDCBalance
        );
        expect(await dai.balanceOf(attacker.address)).to.equal(
            stableSwapDAIBalance
        );
        expect(await ust.balanceOf(attacker.address)).to.equal(
            stableSwapUSTBalance
        );
    });
});
