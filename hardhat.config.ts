import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
dotenv.config();

// Constants
const FRONTRUNNING_MINING_INTERVAL = 10000; // 10 seconds
const MAINNET_FORK_BLOCK_NUMBER = 15969633;
const MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET = 16776127;
const GOERLI_FORK_BLOCK_NUMBER = 8660077;

const MAINNET_URL = process.env.MAINNET;
if (!MAINNET_URL) console.log("Warning: MAINNET not found in .env\n");

const GOERLI_URL = process.env.GOERLI;
if (!GOERLI_URL) console.log("Warning: GOERLI not found in .env\n");

const COMPILERS = [
    {
        version: "0.8.13",
    },
    {
        version: "0.6.12",
    },
    {
        version: "0.6.0",
    },
    {
        version: "0.5.12",
    },
    {
        version: "0.4.24",
    },
];

const config: HardhatUserConfig = {
    solidity: {
        compilers: COMPILERS,
    },
};

let scriptName;

if (process.argv[3] != undefined) {
    scriptName = process.argv[3];
} else {
    scriptName = "";
}

if (
    scriptName.includes("dex-1") ||
    scriptName.includes("dex-2") ||
    scriptName.includes("flash-loans-3") ||
    scriptName.includes("flash-loans-2") ||
    scriptName.includes("oracle-manipulation-2")
) {
    console.log(`Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER}`);
    config.networks = {
        hardhat: {
            forking: {
                url: MAINNET_URL!,
                blockNumber: MAINNET_FORK_BLOCK_NUMBER,
            },
        },
    };
} else if (scriptName.includes("frontrunning")) {
    // Frontrunning exercises are with "hardhat node mode", mining interval is 10 seconds
    console.log(
        `Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER}, Manual Mining Mode with interval of 10 seconds`
    );
    config.networks = {
        hardhat: {
            mining: {
                auto: false,
                interval: FRONTRUNNING_MINING_INTERVAL,
            },
            forking: {
                url: MAINNET_URL!,
                blockNumber: MAINNET_FORK_BLOCK_NUMBER,
            },
        },
    };
} else if (scriptName.includes("money-markets")) {
    console.log(
        `Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET}`
    );
    config.networks = {
        hardhat: {
            forking: {
                url: MAINNET_URL!,
                blockNumber: MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET,
            },
        },
    };
} else if (
    scriptName.includes("sensitive-on-chain-data-2") ||
    scriptName.includes("sensitive-on-chain-data-3")
) {
    console.log(`Forking Goerli Block Height ${GOERLI_FORK_BLOCK_NUMBER}`);
    config.networks = {
        hardhat: {
            forking: {
                url: process.env.GOERLI!,
                blockNumber: GOERLI_FORK_BLOCK_NUMBER,
            },
        },
    };
} else {
    config.networks = {
        hardhat: {
            // loggingEnabled: true
        },
    };
}

export default config;
