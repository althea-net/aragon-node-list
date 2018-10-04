const ipfsHashes = require('./assets.js').ipfs
const w3Utils = require('web3-utils')


const toBytes32 = s => {
  return w3Utils.toHex(s)
}

const financeIpfs = toBytes32(ipfsHashes.finance)
const tokenManagerIpfs = toBytes32(ipfsHashes.tokenManager)
const vaultIpfs = toBytes32(ipfsHashes.vault)
const votingIpfs = toBytes32(ipfsHashes.voting)
const altheaIpfs = toBytes32(ipfsHashes.althea)

module.exports = async (
  truffleExecCallback,
  {artifacts = this.artifacts, verbose = true} = {}
) => {

  try {

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
    const altheaBase = await artifacts.require('Althea').new()
    log(altheaBase.address)

    // Make sure that these addresses are correct for the corresponding network
    const network = artifacts.options._values.network
    let {daoFactory, apmRegistry} = require('./assets.js').contracts[network]
    log('Deploying AltheaDAOFactory...')
    const altheaFac = await artifacts.require('AltheaDAOFactory').new(
      daoFactory,
      minimeFac.address,
      apmRegistry
    )
    log(altheaFac.address)

    let inputs = [
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
    ]

    log('inputs\n', inputs)
    log('Calling apmInit...')
    let receipt = await altheaFac.apmInit(
      altheaBase.address,
      altheaIpfs,
      apmRegistry
    )
    log('txn: ', receipt.tx)
    /*

    log('Creating Althea DAO...')
    receipt = await altheaFac.createInstance()
    const daoAddr = receipt.logs.filter(l => l.event == 'DeployInstance')[0].args.dao
    log('daoAddr', daoAddr)

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
    */

    truffleExecCallback()
  }
  catch (e) {
    console.error(e)
    truffleExecCallback()
  }
}
