require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
  },
  paths: {
    artifacts: './client/src/artifacts'
  },
  networks: {
    mumbai: {
      url: process.env.RPC_URL_MUMBAI,
      accounts: [process.env.PRIVATE_KEY_1],
    },
    polygon_mainnet: {
      url: process.env.RPC_URL_POLYGON_MAINNET,
      accounts: [process.env.PRIVATE_KEY_1],
    },
    mainnet: {
      url: process.env.RPC_URL_ETHEREUM_MAINNET,
      accounts: [process.env.PRIVATE_KEY_1],
    },
    goerli: {
      url: process.env.RPC_URL_ETHEREUM_GOERLI,
      accounts: [process.env.PRIVATE_KEY_1],
    },
    sepolia: {
      url: process.env.RPC_URL_ETHEREUM_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY_1],
    },
    linea_mainnet: {
      url: process.env.RPC_URL_LINEA_MAINNET,
      accounts: [process.env.PRIVATE_KEY_1],
    }

  }
};
