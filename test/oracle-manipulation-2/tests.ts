import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { IERC20, IWETH9, Lendly, Lendly__factory } from "../../typechain-types";

describe("Oracle Manipulation Exercise 2", function () {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;

    // Addresses
    const PAIR_ADDRESS = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"; // DAI/WETH
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const IMPERSONATED_ACCOUNT_ADDRESS =
        "0xf977814e90da44bfa03b6295a0616a897441acec"; // Binance Hot Wallet

    // Amounts
    const WETH_LIQUIDITY = parseEther("180"); // 180 ETH
    const DAI_LIQUIDITY = parseEther("270000"); // 270K USD

    let lendly: Lendly;

    let weth: IWETH9;
    let dai: IERC20;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        // Attacker starts with 1 ETH
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xDE0B6B3A7640000", // 1 ETH
        ]);
        expect(await ethers.provider.getBalance(attacker.address)).to.equal(
            parseEther("1")
        );

        // Deploy Lendly with DAI/WETH contract
        const LendlyFactory = (await ethers.getContractFactory(
            "contracts/oracle-manipulation-2/Lendly.sol:Lendly",
            deployer
        )) as Lendly__factory;
        lendly = await LendlyFactory.deploy(PAIR_ADDRESS);

        // Load Tokens contract
        weth = (await ethers.getContractAt(
            "contracts/interfaces/IWETH9.sol:IWETH9",
            WETH_ADDRESS
        )) as IWETH9;
        dai = (await ethers.getContractAt(
            "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
            DAI_ADDRESS
        )) as IERC20;

        // Convert ETH to WETH
        await weth.deposit({ value: WETH_LIQUIDITY });
        expect(await weth.balanceOf(deployer.address)).to.equal(WETH_LIQUIDITY);

        // Deposit WETH from Deployer to Lendly
        await weth.approve(lendly.address, WETH_LIQUIDITY);
        await lendly.deposit(weth.address, WETH_LIQUIDITY);
        // WETH despoit succeded
        expect(await weth.balanceOf(lendly.address)).to.equal(WETH_LIQUIDITY);
        expect(await lendly.deposited(weth.address, deployer.address)).to.equal(
            WETH_LIQUIDITY
        );

        // Depsit DAI on Lendly (from Binance hot wallet)
        let impersonatedSigner = await ethers.getImpersonatedSigner(
            IMPERSONATED_ACCOUNT_ADDRESS
        );
        await dai
            .connect(impersonatedSigner)
            .approve(lendly.address, DAI_LIQUIDITY);
        await lendly
            .connect(impersonatedSigner)
            .deposit(dai.address, DAI_LIQUIDITY);
        // DAI despoit succeded
        expect(await dai.balanceOf(lendly.address)).to.equal(DAI_LIQUIDITY);
        expect(
            await lendly.deposited(dai.address, impersonatedSigner.address)
        ).to.equal(DAI_LIQUIDITY);

        // Didn't deposit WETH so can't borrow DAI
        expect(
            lendly
                .connect(impersonatedSigner)
                .borrow(dai.address, DAI_LIQUIDITY)
        ).to.be.reverted;

        // WETH depositor can borrow some DAI
        await lendly.borrow(dai.address, parseEther("100"));
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Protocol Liquidity
        console.log(
            "Lendly DAI balance: ",
            ethers.utils.formatUnits(await dai.balanceOf(lendly.address))
        );
        console.log(
            "Lendly WETH balance: ",
            ethers.utils.formatUnits(await weth.balanceOf(lendly.address))
        );

        console.log(
            "Attacker DAI balance: ",
            ethers.utils.formatUnits(await dai.balanceOf(attacker.address))
        );
        console.log(
            "Attacker WETH balance: ",
            ethers.utils.formatUnits(await weth.balanceOf(attacker.address))
        );

        // Pool liquidity should be at least -95%
        expect(await dai.balanceOf(lendly.address)).to.be.lessThan(
            DAI_LIQUIDITY.mul(5).div(100)
        );
        expect(await weth.balanceOf(lendly.address)).to.be.lessThan(
            WETH_LIQUIDITY.mul(5).div(100)
        );

        // Attacker stole the liquidity - at least +88%
        expect(await dai.balanceOf(attacker.address)).to.be.greaterThan(
            DAI_LIQUIDITY.mul(88).div(100)
        );
        expect(await weth.balanceOf(attacker.address)).to.be.greaterThan(
            WETH_LIQUIDITY.mul(88).div(100)
        );
    });
});
