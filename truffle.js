const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  compilers: {
    solc: {
      version: "0.4.24",
      docker: true
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      host: 'sasquatch.network',
      port: 9545,
      network_id: '4'
    },
    sasquatch_rpc: {
      provider: function() {
       return new HDWalletProvider(
         process.env.MNEMONIC,
         "http://sasquatch.network:9545"
        )
      },
      network_id: '4'
    },
    infura: {
      provider: function() {
       return new HDWalletProvider(
         process.env.MNEMONIC,
         "https://rinkeby.infura.io/" + process.env.INFURA_API
        )
      },
      network_id: '4'
    }
  }
}
