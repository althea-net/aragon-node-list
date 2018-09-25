var Althea = artifacts.require('./Althea.sol')

module.exports = async (deployer, network, accounts) => {
  const receipt = await Althea.new()
  console.log("Althea contract: ", receipt.address)
}
