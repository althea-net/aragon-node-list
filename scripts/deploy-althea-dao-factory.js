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
  

  log('Deploying finance app...')
  let p = '@aragon/apps-finance/contracts/Finance.sol'
  const financeBase = await artifacts.require(p).new()
  log(financeBase.address)

  log('Deploying token manager app...')
  p = '@aragon/apps-token-manager/contracts/TokenManager.sol'
  const tokenManagerBase = await artifacts.require(p).new()
  log(tokenManagerBase.address)

  log('Deploying vault app...')
  p = '@aragon/apps-vault/contracts/Vault.sol'
  const vaultBase = await artifacts.require(p).new()
  log(vaultBase.address)

  log('Deploying voting app...')
  p = '@aragon/apps-voting/contracts/Voting.sol'
  const votingBase = await artifacts.require(p).new()
  log(votingBase.address)

  log('Deploying mime token factory...')
  p =  '@aragon/apps-shared-minime/contracts/MiniMeTokenFactory.sol'
  const minimeFac = await artifacts.require(p).new()
  log(minimeFac.address)

  log('Deploying althea app...')
  p = '../contracts/Althea.sol'
  const altheaBase = await artifacts.require(p).new()
  log(altheaBase.address)

  const network = artifacts.options._values.network
  // Make sure that these addresses are correct for the corresponding network
  const {daoFactory, apm} = require('./assets.js').contracts[network]
  log('Deploying AltheaDAOFactory...')
  p = './AltheaDAOFactory.sol'
  const altheaFac = artifacts.require(p).new(daoFactory, minimeFac.address, apm)
  log(altheaFactory.address)

  log('Calling apmInit...')
  const receipt = await altheaFac.apmInit(
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
  log(receipt)

  log('Creating Althea DAO...')
  receipt = await altheaFac.createInstance()
  const daoAddr = receipt.logs.filter(l => l.event == 'DeployInstance')[0].args.dao

  const financeId = await altheaFac.financeAppId()
  const tokenManagerId = await altheaFac.tokenManagerAppId()
  const vaultId = await altheaFac.vaultAppId()
  const votingId = await altheaFac.votingAppId()
  const altheaId = await altheaFac.altheaAppId()

  const installedApps = receipt.logs.filter(l => l.event == 'InstalledApp')
  const financeAddr = installedApps.filter(e => e.args.appId == financeId)[0].args.appProxy
  const tokenManagerAddr = installedApps.filter(e => e.args.appId == tokenManagerId)[0].args.appProxy
  const vaultAddr = installedApps.filter(e => e.args.appId == vaultId)[0].args.appProxy
  const votingAddr = installedApps.filter(e => e.args.appId == votingId)[0].args.appProxy
  const altheaAddr = installedApps.filter(e => e.args.appId == altheaId)[0].args.appProxy

  console.log('DAO:', daoAddr)
  console.log("DAO's finance app:", financeAddr)
  console.log("DAO's token manager app:", tokenManagerAddr)
  console.log("DAO's vault app:", vaultAddr)
  console.log("DAO's voting app:", votingAddr)
  console.log("DAO's althea app:", votingAddr)

  if (! typeof truffleExecCallback === 'function') {
    return { daoAddr }
  }

  truffleExecCallback()
}
