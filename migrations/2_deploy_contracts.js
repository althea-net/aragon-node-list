var Althea = artifacts.require('./Althea.sol')

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(Althea)
}
