require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {

  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },

  paths: {
    artifacts: "./src/backend/artifacts",
    cache: "./src/backend/cache",
    sources: "./src/backend/contracts",
  },

  namedAccounts: {
    // By default, it will take the first Hardhat account as the deployer  
    deployer: {
      default: 0
    }
  },

  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    }
  }
  
};