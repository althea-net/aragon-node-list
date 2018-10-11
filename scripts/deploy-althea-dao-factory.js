const ipfs = require('./assets.json').ipfs
const w3Utils = require('web3-utils')
const namehash = require('eth-ens-namehash').hash

const deployApm = require('@aragon/os/scripts/deploy-beta-apm.js')
const deployId = require('@aragon/id/scripts/deploy-beta-aragonid.js')


const toBytes32 = s => w3Utils.toHex(s)

ipfs.finance = toBytes32(ipfs.finance)
ipfs.tokenManager = toBytes32(ipfs.tokenManager)
ipfs.vault = toBytes32(ipfs.vault)
ipfs.voting = toBytes32(ipfs.voting)
ipfs.althea = toBytes32(ipfs.althea)


module.exports = async (
  truffleExecCallback,
  {
    artifacts = this.artifacts,
    owner = process.env.OWNER,
    verbose = true
  } = {}
) => {
  try {

    const log = (...args) => { if (verbose) console.log(...args) }


    const { apmFactory,
      ens,
      apm,
      daoFactory
    } = await deployApm(null, {
      artifacts: this.artifacts,
      ensAddress: null,
      owner: owner,
      verbose: true
    })

    const newRepo = async(name, owner, address, ipfs, version) => {
      log(`Creating Repo for ${name}`)
      log(`with apm address ${apm.address}`)
      log('vars', name, owner, address, ipfs, version)
      return await apm.newRepoWithVersion(name, owner, version, address, ipfs)
    }

    const { aragonId } = await deployId(null, {
      artifacts: this.artifacts,
      ensAddress: ens.address,
      owner: owner,
      verbose: true
    })


    appIds = {}
    // Aragon Apps deploys
    log('Deploying finance app...')
    const financeBase = await artifacts.require('Finance').new()
    log(financeBase.address)
    appIds.finance = namehash('finance')
    await newRepo(apm, 'finance', owner, [1, 0, 0], financeBase.address, ipfs.finance)

    log('Deploying token manager app...')
    const tokenManagerBase = await artifacts.require('TokenManager').new()
    appIds.finance = namehash('finance')
    log(tokenManagerBase.address)
    await newRepo(apm, 'token-manager', owner, [1, 0, 0], tokenManagerBase.address, ipfs.tokenManager)

    log('Deploying vault app...')
    const vaultBase = await artifacts.require('Vault').new()
    log(vaultBase.address)
    await newRepo(apm, 'vault', owner, [1, 0, 0], vaultBase.address, ipfs.vault)


    log('Deploying voting app...')
    p = '@aragon/apps-voting/contracts/Voting.sol'
    const votingBase = await artifacts.require('Voting').new()
    log(votingBase.address)
    await newRepo(apm, 'voting', owner, [1, 0, 0], votingBase.address, ipfs.voting)


    log('Deploying mime token factory...')
    const minimeFac = await artifacts.require('MiniMeTokenFactory').new()
    log(minimeFac.address)


    log('Deploying althea app...')
    const altheaBase = await artifacts.require('Althea').new()
    log(altheaBase.address)
    await newRepo(apm, 'althea', owner, [1, 0, 0], altheaBase.address, ipfs.althea)

    // Make sure that these addresses are correct for the corresponding network
    
    const apps = ['althea', 'finance', 'token-manager', 'vault', 'voting']
    let inputs = [
      daoFactory.address,
      ens.address,
      minimeFac.address,
      aragonId.address,
      [apps.map(a => namehash(a))],
    ]
    log('AltheaDAOFactory inputs..\n', inputs, '\n')
    log('Deploying AltheaDAOFactory...')
    let altheaFac = await artifacts.require('AltheaDAOFactory').new(...inputs)
    log(altheaFac.address)

    if (! typeof truffleExecCallback === 'function') {
      return { daoAddr }
    }
    truffleExecCallback()
  }
  catch (e) {
    console.error(e)
    truffleExecCallback()
  }
}
