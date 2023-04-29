import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { Auction, Auction__factory } from "../../typechain-types";

describe("DOS Exercise 2", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        attacker: SignerWithAddress;

    const USER1_FIRST_BID = parseEther("5");
    const USER2_FIRST_BID = parseEther("6.5");

    let auction: Auction;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, attacker] = await ethers.getSigners();

        const AuctionFactory = (await ethers.getContractFactory(
            "contracts/dos-2/Auction.sol:Auction",
            deployer
        )) as Auction__factory;
        auction = await AuctionFactory.deploy();

        // Invest
        await auction.connect(user1).bid({ value: USER1_FIRST_BID });
        await auction.connect(user2).bid({ value: USER2_FIRST_BID });

        expect(await auction.highestBid()).to.be.equal(USER2_FIRST_BID);
        expect(await auction.currentLeader()).to.be.equal(user2.address);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Current highest bid
        let highestBid = await auction.highestBid();

        // Even though User1 bids highestBid * 3, transaction is reverted
        await expect(
            auction.connect(user1).bid({ value: highestBid.mul(3) })
        ).to.be.reverted;

        // // User1 and User2 are not currentLeader
        expect(await auction.currentLeader()).to.not.be.equal(user1.address);
        expect(await auction.currentLeader()).to.not.be.equal(user2.address);
    });
});
