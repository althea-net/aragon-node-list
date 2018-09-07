var NodeList = artifacts.require('./NodeList.sol')
var RenewalFeeEscrow = artifacts.require('./RenewalFeeEscrow.sol')
var SubnetController = artifacts.require('./SubnetController.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(NodeList)
  deployer.deploy(RenewalFeeEscrow, accounts[9])
  deployer.deploy(SubnetController)
}
