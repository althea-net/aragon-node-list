var RenewalFeeEscrow = artifacts.require('./RenewalFeeEscrow.sol')
var AltheaDAO = artifacts.require('./AltheaDAO.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(RenewalFeeEscrow)
  deployer.deploy(AltheaDAO)
}
