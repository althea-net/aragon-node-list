var fs = require("fs")
var PrivateKeyProvider = require("truffle-privatekey-provider")
var pk = fs.readFileSync("./rinkeby", "utf8")

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      host: 'http://sasquatch.netowork',
      port: 9545,
      network_id: '4',
      from: "0x7e57506cb56d8c862466fc1bd5efdd82a3c9ad41"
    },
    infura: {
      provider: new PrivateKeyProvider(pk, "https://rinkeby.infura.io/" + process.env.INFURA_API),
      network_id: '4',
    }
  }
}
