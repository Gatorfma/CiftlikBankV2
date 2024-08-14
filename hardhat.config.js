require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { INFURA_PROJECT_ID, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/5bb1b0ecbcda40fd892d4914faa49105',
      chainid: 11155111,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
