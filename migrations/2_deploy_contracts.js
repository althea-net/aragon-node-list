var AltheaDAOFactory = artifacts.require('./AltheaDAOFactory')

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(AltheaDAOFactory, accounts[1], accounts[3], accounts[2])
}
