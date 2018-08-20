var fs = require("fs")
var PrivateKeyProvider = require("truffle-privatekey-provider")
var pk

try {
  pk = fs.readFileSync("./rinkeby", "utf8")
  console.log("using rinkeby pk")
} catch (error) {
  pk = 'f1b16ba87253e44fa96281e5991765d4ea0164959b021efd62724b7c97d7f9d4'
}

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      host: 'http://sasquatch.network',
      port: 9545,
      network_id: '4',
      from: "0x7e57506cb56d8c862466fc1bd5efdd82a3c9ad41"
    },
    infura: {
      provider: new PrivateKeyProvider(pk, "https://rinkeby.infura.io/" + process.env.INFURA_API),
      network_id: '4'
    }
  }
}
