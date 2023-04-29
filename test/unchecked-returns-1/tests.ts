import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    DonationMaster,
    DonationMaster__factory,
    MultiSigSafe,
    MultiSigSafe__factory,
} from "../../typechain-types";

describe("Unchecked Returns Exercise 1", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress;

    const ONE_ETH = parseEther("1"); // 100 ETH
    const HUNDRED_ETH = parseEther("100"); // 100 ETH
    const THOUSAND_ETH = parseEther("1000"); // 100 ETH

    let donationMaster: DonationMaster;
    let multiSig: MultiSigSafe;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3] = await ethers.getSigners();

        // Deploy DonationMaster contract
        const DonationMasterFactory = (await ethers.getContractFactory(
            "contracts/unchecked-returns-1/DonationMaster.sol:DonationMaster",
            deployer
        )) as DonationMaster__factory;
        donationMaster = await DonationMasterFactory.deploy();

        // Deploy MultiSigSafe contract (2 signatures out of 3)
        const MultiSigSafeFactory = (await ethers.getContractFactory(
            "contracts/unchecked-returns-1/MultiSigSafe.sol:MultiSigSafe",
            deployer
        )) as MultiSigSafe__factory;
        multiSig = await MultiSigSafeFactory.deploy(
            [user1.address, user2.address, user3.address],
            2
        );
    });

    it("Donation tests", async function () {
        /* SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        // New donation works
        await donationMaster.newDonation(multiSig.address, HUNDRED_ETH);
        let donationId = (await donationMaster.donationsNo()).sub(1);

        // Donating to multisig wallet works
        await donationMaster.donate(donationId, { value: ONE_ETH });

        // Validate donation details
        let donationInfo = await donationMaster.donations(donationId);
        expect(donationInfo.id).to.equal(donationId);
        expect(donationInfo.to).to.equal(multiSig.address);
        expect(donationInfo.goal).to.equal(HUNDRED_ETH);
        expect(donationInfo.donated).to.equal(ONE_ETH);

        // Too big donation fails (goal reached)
        expect(donationMaster.donate(donationId, { value: THOUSAND_ETH })).to.be
            .reverted;
    });

    it("Fixed tests", async function () {
        /* CODE YOUR SOLUTION HERE */
        /* Write the correct tests here */
    });
});
