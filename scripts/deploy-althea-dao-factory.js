const ipfsHashes = require('./assets.js').ipfs

const financeIpfs = ipfsHashes.finance
const tokenManagerIpfs = ipfsHashes.tokenManager
const vaultIpfs = ipfsHashes.vault
const votingIpfs = ipfsHashes.voting
const altheaIpfs = ipfsHashes.althea

module.exports = async (
  truffleExecCallback,
  {artifacts = this.artifacts, verbose = true} = {}
) => {

  const log = (...args) => { if (verbose) console.log(...args) }


  log('1')
  const financeBase = await artifacts.require('@aragon/apps-finance/contracts/Finance.sol').new()

  log('2')
  const tokenManagerBase = await artifacts.require('@aragon/apps-token-manager/contracts/TokenManager.sol').new()

  log('3')
  const vaultBase = await artifacts.require('@aragon/apps-vault/contracts/Vault.sol').new()

  log('4')
  const votingBase = await artifacts.require('@aragon/apps-voting/contracts/Voting.sol')

  log('5')
  const minimeFac = await artifacts.require(
    '@aragon/apps-shared-minime/contracts/MiniMeToken.sol'
  ).new()
  log('5.5')

  log('6')
  const altheaBase = await artifacts.require('./Althea.sol').new()

  /*
   *
  const { apm, ens } = await apmMigration()
  const { daoFactory } = await daoFactoryMigration()
  */

  onsole.log('naaah')
  onsole.log('aye')

  let daoFactory = 0xc8f466ffef9e9788fb363c2f4fbddf2cae477805
  let apm = 0xd33824d26df396f04dba40e709f130d86a2f5ddd
  const AltheaDAOFactory = artifacts.require('./AltheaDAOFactory.sol')
  const template = await AltheaDAOFactory.new(daoFactory, minimeFac.address, apm)
  await template.apmInit(
    financeBase.address,
    financeIpfs,

    tokenManagerBase.address,
    tokenManagerIpfs,

    vaultBase.address,
    vaultIpfs,

    votingBase.address,
    votingIpfs,

    altheaBase.address,
    altheaIpfs
  )

  console.log('SUCCESS')
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

  if (typeof truffleExecCallback === 'function') {
    truffleExecCallback()
  } else {
    return { daoAddr }
  }
}
