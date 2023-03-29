const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Oracle Manipulation Exercise 1', function () {

    const sources = [
        '0x4aC89064Fa0d03De57f802feC722925b4502572A',
        '0x96574c0392112CbEe134eb77e76A183d54A7c18f',
        '0xA7804BB057EBB7D0c0a3C7F4B8710AE854525fd4'
    ];

    let deployer, attacker;
    const EXCHANGE_INITIAL_BALANCE = ethers.utils.parseEther('1800');
    const INITIAL_GOLD_PRICE = ethers.utils.parseEther('1.5');

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

         // Attacker starts with 1 ETH
         await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xDE0B6B3A7640000", // 1 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ethers.utils.parseEther('1'));
        this.initialAttackerBalance = await ethers.provider.getBalance(attacker.address);

        // Sources starts with 10 ETH
        for (let i = 0; i < sources.length; i++) {
            await ethers.provider.send("hardhat_setBalance", [
                sources[i],
                "0x8AC7230489E80000", // 10 ETH
            ]);
            expect(
                await ethers.provider.getBalance(sources[i])
            ).to.equal(ethers.utils.parseEther('10'));
        }

        // Factories
        const ExchangeFactory = await ethers.getContractFactory(
            'contracts/oracle-manipulation-1/GoldExchange.sol:GoldExchange',
            deployer
        );
        const TokenFactory = await ethers.getContractFactory(
            'contracts/oracle-manipulation-1/GoldToken.sol:GoldToken',
            deployer
        );
        const OracleFactory = await ethers.getContractFactory(
            'contracts/oracle-manipulation-1/GoldOracle.sol:GoldOracle',
            deployer
        );

        // Deploy contracts
        this.token = await TokenFactory.deploy();
        this.oracle = await OracleFactory.deploy(sources, [INITIAL_GOLD_PRICE, INITIAL_GOLD_PRICE, INITIAL_GOLD_PRICE]);
        this.exchange = await ExchangeFactory.deploy(
            this.token.address,
            this.oracle.address,
            { value: EXCHANGE_INITIAL_BALANCE }
        );

        // Transfer token ownership to exchange
        await this.token.transferOwnership(this.exchange.address);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Exchange lost almost all ETH
        expect(
            await ethers.provider.getBalance(this.exchange.address)
        ).to.be.lt(ethers.utils.parseEther('0.1'));
        
        // Attacker's earned a lot of ETH on top of the exchange
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(this.initialAttackerBalance.add(EXCHANGE_INITIAL_BALANCE).sub(ethers.utils.parseEther('0.2')));

        // Gold price shouldn't have changed
        expect(
            await this.oracle.getPrice()
        ).to.eq(INITIAL_GOLD_PRICE);
    });
});
