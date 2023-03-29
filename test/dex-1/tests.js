const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DEFI Money Markets: DEX Exercise 1 - Chocolate Factory', function () {

    let deployer, user;

    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const RICH_SIGNER = "0x8eb8a3b98659cce290402893d0123abb75e3ab28"
    const ETH_BALANCE = ethers.utils.parseEther('300'); 

    const INITIAL_MINT = ethers.utils.parseEther('1000000'); 
    const INITIAL_LIQUIDITY = ethers.utils.parseEther('100000'); 
    const ETH_IN_LIQUIDITY = ethers.utils.parseEther('100');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user] = await ethers.getSigners();

        // Send ETH from rich signer to our deployer
        this.richSigner = await ethers.getImpersonatedSigner(RICH_SIGNER);
        await this.richSigner.sendTransaction({
            to: deployer.address,
            value: ETH_BALANCE,
        });

        this.weth = await ethers.getContractAt(
            "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
            WETH_ADDRESS
        );
    });

    it('Deployment', async function () {
        
        // TODO: Deploy your smart contract to `this.chocolate`, mint 1,000,000 tokens to deployer

        // TODO: Print newly created pair address and store pair contract to `this.pair`
    });

    it('Deployer add liquidity tests', async function () {

        // TODO: Add liquidity of 100,000 tokens and 100 ETH (1 token = 0.001 ETH)

        // TODO: Print the amount of LP tokens that the deployer owns

    });

    it('User swap tests', async function () {

        let userChocolateBalance = await this.chocolate.balanceOf(user.address);
        let userWETHBalance = await this.weth.balanceOf(user.address);
        
        // TODO: From user: Swap 10 ETH to Chocolate

        // TODO: Make sure user received the chocolates (greater amount than before)

        // TODO: From user: Swap 100 Chocolates to ETH
        
        // TODO: Make sure user received the WETH (greater amount than before)
    });

    it('Deployer remove liquidity tests', async function () {

        let deployerChocolateBalance = await this.chocolate.balanceOf(deployer.address);
        let deployerWETHBalance = await this.weth.balanceOf(deployer.address);
        
        // TODO: Remove 50% of deployer's liquidity

        // TODO: Make sure deployer owns 50% of the LP tokens (leftovers)
        
        // TODO: Make sure deployer got chocolate and weth back (greater amount than before)
    
    });
});
