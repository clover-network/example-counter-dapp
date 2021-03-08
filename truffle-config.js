const pkProvider = require('./private-provider')

const privateKey = '03183f27e9d78698a05c24eb6732630eb17725fcf2b53ee3a6a635d6ff139680'

module.exports = {
  contracts_build_directory: "./src/contract_build",
  compilers: {
    solc: {
      version: '0.5.2'
    }
  },
  networks: {
    development: {
      provider: () => new pkProvider(privateKey, `http://192.168.9.20:9933`, 1023),
      network_id: 1023,
      gas: 55000000,
      gasPrice: 10_000_000_000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
};
