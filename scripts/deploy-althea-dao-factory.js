const ipfs = require('./assets.json').ipfs
const fs = require('fs')
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

const saveAddresses = async assets => {

}

module.exports = async (
  truffleExecCallback,
  {
    artifacts = this.artifacts,
    owner = process.env.OWNER,
    verbose = true
  } = {}
) => {
  try {
    if(!owner) {
      console.log('Owner not set')
      console.log('OWNER=<owner address> npm run deploy:devnet')
      truffleExecCallback()
    }
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

    const { aragonId } = await deployId(null, {
      artifacts: this.artifacts,
      ensAddress: ens.address,
      owner: owner,
      verbose: true
    })

    const newRepo = async(name, address, ipfs, ) => {
      log(`Creating Repo for ${name}`)
      log(`with apm address ${apm.address}`)
      let inputs = [name, owner, [1, 0, 0], address, ipfs]
      return await apm.newRepoWithVersion(...inputs)
    }

    // Aragon Apps deploys
    log('Deploying finance app...')
    const financeBase = await artifacts.require('Finance').new()
    log(financeBase.address)
    await newRepo('finance', financeBase.address, ipfs.finance)

    log('Deploying token manager app...')
    const tokenManagerBase = await artifacts.require('TokenManager').new()
    log(tokenManagerBase.address)
    await newRepo('token-manager', tokenManagerBase.address, ipfs.tokenManager)

    log('Deploying vault app...')
    const vaultBase = await artifacts.require('Vault').new()
    log(vaultBase.address)
    await newRepo('vault', vaultBase.address, ipfs.vault)


    log('Deploying voting app...')
    p = '@aragon/apps-voting/contracts/Voting.sol'
    const votingBase = await artifacts.require('Voting').new()
    log(votingBase.address)
    await newRepo('voting', votingBase.address, ipfs.voting)


    log('Deploying mime token factory...')
    const minimeFac = await artifacts.require('MiniMeTokenFactory').new()
    log(minimeFac.address)


    log('Deploying althea app...')
    const altheaBase = await artifacts.require('Althea').new()
    log(altheaBase.address)
    await newRepo('althea', altheaBase.address, ipfs.althea)

    // Make sure that these addresses are correct for the corresponding network
    
    const apps = ['althea', 'finance', 'token-manager', 'vault', 'voting']
    let inputs = [
      daoFactory.address,
      ens.address,
      minimeFac.address,
      aragonId.address,
      apps.map(a => namehash(a)),
    ]
    log('AltheaDAOFactory inputs..\n', inputs)
    log('Deploying AltheaDAOFactory...')
    let altheaFac = await artifacts.require('AltheaDAOFactory').new(...inputs)
    log(altheaFac.address)

    //Dao creation steps
    log('Creating newToken in tokenCache...')
    let receipt = await altheaFac.newToken('XDT', 'DEV')
    log('txn: ', receipt.tx)

    log('Creating new dao Instance...')
    receipt = await altheaFac.newInstance('factory', [owner], 1)
    log(receipt)
    log('txn: ', receipt.tx)

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
