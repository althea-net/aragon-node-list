module.exports = {
  compilers: {
    solc: {
      version: "0.4.24",
      docker: true
    }
  },
  networks: require("@aragon/os/truffle-config.js").networks
}
