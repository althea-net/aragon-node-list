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
    ...require("@aragon/os/truffle-config.js").networks
  }
}
