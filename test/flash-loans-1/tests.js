const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Flash Loan Exercise 1', function () {

    let deployer, user;
    const POOL_BALANCE = ethers.utils.parseEther('1000');

    it('Flash Loan Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deploy Pool.sol contract with 1,000 ETH

        // TODO: Deploy Receiver.sol contract
        
        // TODO: Successfuly execute a Flash Loan of all the balance using Receiver.sol contract

        // TODO: Deploy GreedyReceiver.sol contract
        
        // TODO: Fails to execute a flash loan with GreedyReceiver.sol contract
        
    });

});
