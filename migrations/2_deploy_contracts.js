var Althea = artifacts.require('./Althea.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Althea)
}
