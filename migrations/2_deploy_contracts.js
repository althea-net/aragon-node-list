var NodeList = artifacts.require('./NodeList.sol')
var RenewalFeeEscrow = artifacts.require('./RenewalFeeEscrow.sol')

let SUBNETDAO_FOR_RECEIVING_PAYMENTS = ''

module.exports = function (deployer, network, accounts) {
  deployer.deploy(NodeList)
  if (network === 'development') {
    SUBNETDAO_FOR_RECEIVING_PAYMENTS = accounts[accounts.length-1]
  }
  console.log("Constructor arguments: ", SUBNETDAO_FOR_RECEIVING_PAYMENTS)
  deployer.deploy(RenewalFeeEscrow, SUBNETDAO_FOR_RECEIVING_PAYMENTS)
}
