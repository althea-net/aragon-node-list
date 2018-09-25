const apmMigration = require('@aragon/os/scripts/deploy-beta-apm.js')
const daoFactoryMigration = require('@aragon/os/scripts/deploy-daofactory')
const ipfsHashes = require('./ipfs.js')

const financeIpfs = ipfsHashes.finance
const tokenManagerIpfs = ipfsHashes.tokenManager
const vaultIpfs = ipfsHashes.vault
const votingIpfs = ipfsHashes.voting
const altheaIpfs = ipfsHashes.althea

module.exports = async (deployer, network, accounts, arts = null) => {
  if (arts != null) artifacts = arts // allow running outside 
  const Finance = artifacts.require('@aragon/apps-finance/contracts/Finance.sol')
  const TokenManager = artifacts.require('@aragon/apps-token-manager/contracts/TokenManager.sol')
  const Vault = artifacts.require('@aragon/apps-vault/contracts/Vault.sol')
  const Voting = artifacts.require('@aragon/apps-voting/contracts/Voting.sol')

  const MiniMeTokenFactory = artifacts.require(
    '@aragon/apps-shared-minime/contracts/MiniMeToken.sol'
  )

  const Althea = artifacts.require('./Althea.sol')
  const AltheaDAOFactory = artifacts.require('./AltheaDAOFactory.sol')


  console.log('naaah')
  const { apm, ens } = await apmMigration(deployer, network, accounts, artifacts)
  const { daoFactory } = await daoFactoryMigration(deployer, network, accounts, artifacts)
  console.log('heeeyoo')
  const financeBase = await Finance.new()
  const tokenManagerBase = await TokenManager.new()
  const vaultBase = await Vault.new()
  const votingBase = await Voting.new()
  const altheaBase = await Althea.new()


  const minimeFac = await MiniMeTokenFactory.new()
  const template = await AltheaDAO.new(daoFact.address, minimeFac.address, apm.address)
  await template.apmInit(
    financeBase.address,
    financeIpfs,
    tokenManagerBase.address,
    tokenManagerIpfs,
    vaultBase.address,
    vaultIpfs,
    votingBase.address,
    votingIpfs,
    altheaBase,
    altheaIpfs
  )

  const receipt = await template.createInstance()

  const daoAddr = receipt.logs.filter(l => l.event == 'DeployInstance')[0].args.dao

  const financeId = await template.financeAppId()
  const tokenManagerId = await template.tokenManagerAppId()
  const vaultId = await template.vaultAppId()
  const votingId = await template.votingAppId()
  const altheaId = await template.altheaAppId()

  const installedApps = receipt.logs.filter(l => l.event == 'InstalledApp')
  const financeAddr = installedApps.filter(e => e.args.appId == financeId)[0].args.appProxy
  const tokenManagerAddr = installedApps.filter(e => e.args.appId == tokenManagerId)[0].args.appProxy
  const vaultAddr = installedApps.filter(e => e.args.appId == vaultId)[0].args.appProxy
  const votingAddr = installedApps.filter(e => e.args.appId == votingId)[0].args.appProxy

  console.log('DAO:', daoAddr)
  console.log("DAO's finance app:", financeAddr)
  console.log("DAO's token manager app:", tokenManagerAddr)
  console.log("DAO's vault app:", vaultAddr)
  console.log("DAO's voting app:", votingAddr)
  console.log('ENS:', ensAddr)

  return {
    daoAddr,
    ensAddr,
    financeAddr,
    tokenManagerAddr,
    vaultAddr,
    votingAddr,
  }
}
