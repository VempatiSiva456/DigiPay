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
    ],
  },
  paths: {
    artifacts: './client/src/artifacts'
  },
  networks: {
    mumbai: {
      url: process.env.RPC_URL,
      chainId: process.env.CHAIN_ID,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.24",
};
