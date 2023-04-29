import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import {
    MultiSignatureWallet,
    MultiSignatureWallet__factory,
} from "../../typechain-types";

describe("Replay Attack Exercise 1", function () {
    let deployer: SignerWithAddress,
        signer2: SignerWithAddress,
        attacker: SignerWithAddress;

    const ETH_IN_MULTISIG = parseEther("100");
    const ATTACKER_WITHDRAW = parseEther("1");

    let multiSigWallet: MultiSignatureWallet;

    let attackerBalanceBeforeAttack: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, signer2, attacker] = await ethers.getSigners();

        // Deploy multi sig
        const MultiSigWallet = (await ethers.getContractFactory(
            "contracts/replay-attack-1/MultiSignatureWallet.sol:MultiSignatureWallet",
            deployer
        )) as MultiSignatureWallet__factory;
        multiSigWallet = await MultiSigWallet.deploy([
            deployer.address,
            signer2.address,
        ]);

        // Send ETH to multisig Wallet
        await deployer.sendTransaction({
            to: multiSigWallet.address,
            value: ETH_IN_MULTISIG,
        });

        // Prepare withdraw Message
        const message = ethers.utils.solidityPack(
            ["address", "uint256"],
            [attacker.address, ATTACKER_WITHDRAW]
        );
        const messageBuffer = ethers.utils.concat([message]);

        // Sign message
        let signatory1Signature = await deployer.signMessage(messageBuffer);
        let signatory2Signature = await signer2.signMessage(messageBuffer);

        // Split signatures (v,r,s)
        let signatory1SplitSig =
            ethers.utils.splitSignature(signatory1Signature);
        let signatory2SplitSig =
            ethers.utils.splitSignature(signatory2Signature);

        // Call transfer with signatures
        await multiSigWallet.transfer(attacker.address, ATTACKER_WITHDRAW, [
            signatory1SplitSig,
            signatory2SplitSig,
        ]);

        expect(
            await ethers.provider.getBalance(multiSigWallet.address)
        ).to.equal(ETH_IN_MULTISIG.sub(ATTACKER_WITHDRAW));

        attackerBalanceBeforeAttack = await ethers.provider.getBalance(
            attacker.address
        );
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(
            await ethers.provider.getBalance(multiSigWallet.address)
        ).to.equal(0);

        let attackerBalanceAfterAttack = await ethers.provider.getBalance(
            attacker.address
        );

        // Attacker is supposed to own the stolen ETH ( +99 ETH , -0.1 ETH for gas)
        expect(attackerBalanceAfterAttack).to.be.gt(
            attackerBalanceBeforeAttack
                .add(ETH_IN_MULTISIG)
                .sub(parseEther("1.1"))
        );
    });
});
