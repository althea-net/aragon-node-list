var RenewalFeeEscrow = artifacts.require('./RenewalFeeEscrow.sol')
var AltheaDAO = artifacts.require('./AltheaDAO.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(RenewalFeeEscrow, 1*(10**10))
  deployer.deploy(AltheaDAO)
}
