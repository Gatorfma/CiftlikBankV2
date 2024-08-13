require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, INFURA_PROJECT_ID } = process.env;

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`
      ),
      
      network_id: 11155111,  // Sepolia network ID
      confirmations: 2,      // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200,    // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true       // Skip dry run before migrations? (default: false for public nets)
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.9",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true.
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
