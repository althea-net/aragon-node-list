
const ipfsHashes = require('./assets.json').ipfs
const w3Utils = require('web3-utils')

const deployApm = require('@aragon/os/scripts/deploy-beta-apm.js')
const deployId = require('@aragon/id/scripts/deploy-beta-aragonid.js')

const owner = process.env.OWNER

const toBytes32 = s => w3Utils.toHex(s)

const financeIpfs = toBytes32(ipfsHashes.finance)
const tokenManagerIpfs = toBytes32(ipfsHashes.tokenManager)
const vaultIpfs = toBytes32(ipfsHashes.vault)
const votingIpfs = toBytes32(ipfsHashes.voting)
const altheaIpfs = toBytes32(ipfsHashes.althea)

module.exports = async (
  truffleExecCallback,
  {
    artifacts = this.artifacts,
    verbose = true} = {}
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

    const { aragonId } = await deployId(null, {
      artifacts: this.artifacts,
      ensAddress: ens.address,
      owner: owner,
      verbose: true
    })

    // Aragon Apps deploys
    log('Deploying finance app...')
    const financeBase = await artifacts.require('Finance').new()
    log(financeBase.address)

    log('Deploying token manager app...')
    const tokenManagerBase = await artifacts.require('TokenManager').new()
    log(tokenManagerBase.address)

    log('Deploying vault app...')
    const vaultBase = await artifacts.require('Vault').new()
    log(vaultBase.address)

    log('Deploying voting app...')
    p = '@aragon/apps-voting/contracts/Voting.sol'
    const votingBase = await artifacts.require('Voting').new()
    log(votingBase.address)

    log('Deploying mime token factory...')
    const minimeFac = await artifacts.require('MiniMeTokenFactory').new()
    log(minimeFac.address)

    log('Deploying althea app...')
    const altheaBase = await artifacts.require('Althea').new()
    log(altheaBase.address)

    // Make sure that these addresses are correct for the corresponding network
    
    let inputs = [
      daoFactory.address,
      ens.address,
      minimeFac.address,
      aragonId.address,
      [
        altheaIpfs,
        financeIpfs,
        tokenManagerIpfs,
        vaultIpfs,
        votingIpfs,
      ],
    ]
    log('AltheaDAOFactory inputs..\n', inputs, '\n')
    log('Deploying AltheaDAOFactory...')
    let altheaFac = await artifacts.require('AltheaDAOFactory').new(...inputs)
    log(altheaFac.address)

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
