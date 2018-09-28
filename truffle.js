var HDWalletProvider = require("truffle-hdwallet-provider");

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
    devnet: {
      host: 'localhost',
      port: 8535,
      network_id: '*'
    },
    sasquatch_rpc: {
      host: 'sasquatch.network',
      port: 19545,
      network_id: '4'
    },
    sasquatch_ws: {
      host: 'sasquatch.network',
      port: 19546,
      network_id: '4'
    },
    rinkeby: {
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
