var IPLeasingEscrow = artifacts.require('./IPLeasingEscrow.sol')
var AltheaDAO = artifacts.require('./AltheaDAO.sol')

module.exports = function (deployer, network, accounts) {
  let perBlockFee = 1*(10**10)
  let paymentAddress = accounts[1]
  deployer.deploy(IPLeasingEscrow, perBlockFee, paymentAddress)
  deployer.deploy(AltheaDAO, perBlockFee, paymentAddress)
}
