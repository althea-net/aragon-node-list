var IPLeasingEscrow = artifacts.require('./IPLeasingEscrow.sol')
var AltheaDAO = artifacts.require('./AltheaDAO.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(IPLeasingEscrow, 1*(10**10))
  deployer.deploy(AltheaDAO)
}
