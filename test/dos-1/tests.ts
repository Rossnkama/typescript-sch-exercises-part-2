import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { TokenSale, TokenSale__factory } from "../../typechain-types";

describe("DOS Exercise 1", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress,
        attacker: SignerWithAddress;

    const USER1_INVESTMENT = parseEther("5");
    const USER2_INVESTMENT = parseEther("15");
    const USER3_INVESTMENT = parseEther("23");

    let tokenSale: TokenSale;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        const tokenSaleFactory = (await ethers.getContractFactory(
            "contracts/dos-1/TokenSale.sol:TokenSale",
            deployer
        )) as TokenSale__factory;
        tokenSale = await tokenSaleFactory.deploy();

        // Invest
        await tokenSale.connect(user1).invest({ value: USER1_INVESTMENT });
        await tokenSale.connect(user2).invest({ value: USER2_INVESTMENT });
        await tokenSale.connect(user3).invest({ value: USER3_INVESTMENT });

        expect(await tokenSale.claimable(user1.address, 0)).to.be.equal(
            USER1_INVESTMENT.mul(5)
        );
        expect(await tokenSale.claimable(user2.address, 0)).to.be.equal(
            USER2_INVESTMENT.mul(5)
        );
        expect(await tokenSale.claimable(user3.address, 0)).to.be.equal(
            USER3_INVESTMENT.mul(5)
        );
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    }).timeout(100000000);

    after(async function () {
        /** SUCCESS CONDITIONS */

        // DOS to distributeTokens
        await expect(tokenSale.distributeTokens()).to.be.reverted;
    });
});
