var Althea = artifacts.require('./Althea.sol')

module.exports = async (deployer, network, accounts) => {
  paymentAddress = await web3.eth.personal.newAccount()
  deployer.deploy(Althea, paymentAddress)
}
