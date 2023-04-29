import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import fs from "fs";

describe("Sensitive On-Chain Data Exercise 2", function () {
    let muggle: SignerWithAddress;

    const SECRET_DOOR_ABI = fs
        .readFileSync("./test/sensitive-on-chain-data-2/SecretDoorABI.json")
        .toString();
    const SECRET_DOOR_ADDRESS = "0x148f340701D3Ff95c7aA0491f5497709861Ca27D";

    let secretDoor: Contract;

    before(async () => {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [muggle] = await ethers.getSigners();
        // Load SecretDoor Contract
        secretDoor = new ethers.Contract(
            SECRET_DOOR_ADDRESS,
            SECRET_DOOR_ABI,
            muggle
        );

        await secretDoor.unlockDoor(
            ethers.utils.formatBytes32String("EatSlugs")
        );
    });

    it("Exploit", async () => {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async () => {
        /** SUCCESS CONDITIONS */

        expect(await secretDoor.isLocked()).to.eq(false);
    });
});
