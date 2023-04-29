import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    Chocolate__factory,
    IUniswapV2Pair,
    IWETH9,
} from "../../typechain-types";
import { Chocolate } from "../../typechain-types/contracts/frontrunning-3/Chocolate.sol";

describe("Frontrunning Attack Exercise 3", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        attacker: SignerWithAddress;

    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

    const INITIAL_MINT = parseEther("1000000");
    const INITIAL_LIQUIDITY = parseEther("100000");
    const ETH_IN_LIQUIDITY = parseEther("100");
    const USER1_SWAP = parseEther("120");
    const USER2_SWAP = parseEther("100");

    let chocolate: Chocolate;
    let weth: IWETH9;
    let pair: IUniswapV2Pair;

    let attackerInitialETHBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, attacker] = await ethers.getSigners();
        let signers = [deployer, user1, user2, attacker];

        // Everyone starts with 300 ETH
        for (let i = 0; i < signers.length; i++) {
            await ethers.provider.send("hardhat_setBalance", [
                signers[i].address,
                "0x1043561A8829300000", // 300 ETH
            ]);
        }

        attackerInitialETHBalance = await ethers.provider.getBalance(
            attacker.address
        );

        weth = (await ethers.getContractAt(
            "contracts/interfaces/IWETH9.sol:IWETH9",
            WETH_ADDRESS
        )) as IWETH9;
    });

    it("Deployment", async function () {
        const ChocolateFactory = (await ethers.getContractFactory(
            "contracts/frontrunning-3/Chocolate.sol:Chocolate",
            deployer
        )) as Chocolate__factory;
        chocolate = await ChocolateFactory.deploy(INITIAL_MINT);

        let pairAddress = await chocolate.uniswapV2Pair();
        pair = (await ethers.getContractAt(
            "contracts/interfaces/IUniswapV2.sol:IUniswapV2Pair",
            pairAddress
        )) as IUniswapV2Pair;
    });

    it("Deployer adds liquidity", async function () {
        await chocolate.approve(chocolate.address, INITIAL_LIQUIDITY);
        await chocolate.addChocolateLiquidity(INITIAL_LIQUIDITY, {
            value: ETH_IN_LIQUIDITY,
        });
    });

    it("User swap", async function () {
        // User1 swaps 120 ETH to Chocolate
        await chocolate
            .connect(user1)
            .swapChocolates(weth.address, USER1_SWAP, {
                value: USER1_SWAP,
                gasPrice: 0x4133810a0,
            });

        // User2 swaps 100 ETH to Chocolate
        await chocolate
            .connect(user2)
            .swapChocolates(weth.address, USER2_SWAP, {
                value: USER2_SWAP,
                gasPrice: 0x4133110a0,
            });
    });

    it("Did someone ask for noise?", async function () {
        for (let i = 0; i < 10; i++) {
            await deployer.sendTransaction({
                to: ethers.Wallet.createRandom().address,
                value: parseEther("0.01"),
            });
        }
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        // Mine all the transactions
        await ethers.provider.send("evm_mine", []);

        // Attacker suppose to make more than 110 ETH in profit!
        const attackerETHBalance = await ethers.provider.getBalance(
            attacker.address
        );
        console.log("attackerETHBalance after: ", attackerETHBalance);
        expect(attackerETHBalance).to.be.greaterThan(
            attackerInitialETHBalance.add(parseEther("200"))
        );
    });
});
