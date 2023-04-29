import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    GoldExchange,
    GoldExchange__factory,
    GoldOracle,
    GoldOracle__factory,
    GoldToken,
    GoldToken__factory,
} from "../../typechain-types";

describe("Oracle Manipulation Exercise 1", function () {
    const sources = [
        "0x4aC89064Fa0d03De57f802feC722925b4502572A",
        "0x96574c0392112CbEe134eb77e76A183d54A7c18f",
        "0xA7804BB057EBB7D0c0a3C7F4B8710AE854525fd4",
    ];

    let deployer: SignerWithAddress, attacker: SignerWithAddress;

    const EXCHANGE_INITIAL_BALANCE = parseEther("1800");
    const INITIAL_GOLD_PRICE = parseEther("1.5");

    let token: GoldToken;
    let oracle: GoldOracle;
    let exchange: GoldExchange;

    let initialAttackerBalance: BigNumber;

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
        initialAttackerBalance = await ethers.provider.getBalance(
            attacker.address
        );

        // Sources starts with 10 ETH
        for (let i = 0; i < sources.length; i++) {
            await ethers.provider.send("hardhat_setBalance", [
                sources[i],
                "0x8AC7230489E80000", // 10 ETH
            ]);
            expect(await ethers.provider.getBalance(sources[i])).to.equal(
                parseEther("10")
            );
        }

        // Factories
        const ExchangeFactory = (await ethers.getContractFactory(
            "contracts/oracle-manipulation-1/GoldExchange.sol:GoldExchange",
            deployer
        )) as GoldExchange__factory;
        const TokenFactory = (await ethers.getContractFactory(
            "contracts/oracle-manipulation-1/GoldToken.sol:GoldToken",
            deployer
        )) as GoldToken__factory;
        const OracleFactory = (await ethers.getContractFactory(
            "contracts/oracle-manipulation-1/GoldOracle.sol:GoldOracle",
            deployer
        )) as GoldOracle__factory;

        // Deploy contracts
        token = await TokenFactory.deploy();
        oracle = await OracleFactory.deploy(sources, [
            INITIAL_GOLD_PRICE,
            INITIAL_GOLD_PRICE,
            INITIAL_GOLD_PRICE,
        ]);
        exchange = await ExchangeFactory.deploy(token.address, oracle.address, {
            value: EXCHANGE_INITIAL_BALANCE,
        });

        // Transfer token ownership to exchange
        await token.transferOwnership(exchange.address);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Exchange lost almost all ETH
        expect(await ethers.provider.getBalance(exchange.address)).to.be.lt(
            parseEther("0.1")
        );

        // Attacker's earned a lot of ETH on top of the exchange
        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
            initialAttackerBalance
                .add(EXCHANGE_INITIAL_BALANCE)
                .sub(parseEther("0.2"))
        );

        // Gold price shouldn't have changed
        expect(await oracle.getPrice()).to.eq(INITIAL_GOLD_PRICE);
    });
});
