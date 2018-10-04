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
      port: 8535,
      network_id: '*'
    },
    sasquatch_rpc: {
      host: 'sasquatch.network',
      port: 9545,
      network_id: '4'
    },
    sasquatch_ws: {
      host: 'sasquatch.network',
      port: 19546,
      network_id: '4'
    },
    ...require("@aragon/os/truffle-config.js").networks
  }
}
