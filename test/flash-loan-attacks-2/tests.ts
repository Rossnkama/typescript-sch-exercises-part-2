import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { AdvancedVault, AdvancedVault__factory } from "../../typechain-types";

describe("Flash Loan Attacks Exercise 2", function () {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;

    const ETH_IN_VAULT = parseEther("1000"); // 1000 ETH

    let vault: AdvancedVault;

    let attackerInitialBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        const AdvancedVaultFactory = (await ethers.getContractFactory(
            "contracts/flash-loan-attacks-2/AdvancedVault.sol:AdvancedVault",
            deployer
        )) as AdvancedVault__factory;

        vault = await AdvancedVaultFactory.deploy();

        await vault.depositETH({ value: ETH_IN_VAULT });

        attackerInitialBalance = await ethers.provider.getBalance(
            attacker.address
        );

        expect(await ethers.provider.getBalance(vault.address)).to.equal(
            ETH_IN_VAULT
        );
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(await ethers.provider.getBalance(vault.address)).to.be.equal(
            "0"
        );

        // -0.2ETH for tx fees
        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
            attackerInitialBalance.add(ETH_IN_VAULT).sub(parseEther("0.2"))
        );
    });
});
