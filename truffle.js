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
    rinkeby2: {
      provider: new HDWalletProvider(
         process.env.MNEMONIC,
         "http://sasquatch.network:19545"
      ),
      network_id: '4',
      gas: 6.9e5,
      gasPrice: 150000000
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
