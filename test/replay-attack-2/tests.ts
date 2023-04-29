import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    RealtySale,
    RealtySale__factory,
    RealtyToken,
    RealtyToken__factory,
} from "../../typechain-types";

describe("Replay Attack Exercise 2", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        attacker: SignerWithAddress;

    let realtySale: RealtySale;
    let realtyToken: RealtyToken;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, attacker] = await ethers.getSigners();

        // Attacker starts with 1 ETH in balance
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xde0b6b3a7640000", // 1 ETH
        ]);

        // Deploy RealtySale
        const RealtySaleFactory = (await ethers.getContractFactory(
            "contracts/replay-attack-2/RealtySale.sol:RealtySale",
            deployer
        )) as RealtySale__factory;
        realtySale = await RealtySaleFactory.deploy();

        // Attach to deployed RealtyToken
        const ShareTokenFactory = (await ethers.getContractFactory(
            "contracts/replay-attack-2/RealtyToken.sol:RealtyToken"
        )) as RealtyToken__factory;
        const shareTokenAddress = await realtySale.getTokenContract();
        realtyToken = await ShareTokenFactory.attach(shareTokenAddress);

        // Buy without sending ETH reverts
        expect(realtySale.connect(user1).buy()).to.be.reverted;

        // Some users buy tokens (1 ETH each share)
        await realtySale.connect(user1).buy({ value: parseEther("1") });
        await realtySale.connect(user2).buy({ value: parseEther("1") });

        // 2 ETH in contract
        expect(await ethers.provider.getBalance(realtySale.address)).to.equal(
            parseEther("2")
        );

        // Buyer got their share token
        expect(await realtyToken.balanceOf(user1.address)).to.equal(1);
        expect(await realtyToken.balanceOf(user2.address)).to.equal(1);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker bought all 98 shares
        expect(await realtyToken.balanceOf(attacker.address)).to.equal(98);

        // No more shares left :(
        let maxSupply = await realtyToken.maxSupply();
        expect(await realtyToken.lastTokenID()).to.equal(maxSupply);
    });
});
