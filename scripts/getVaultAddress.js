const Web3 = require('web3')
const kernelABI = require('../build/contracts/Kernel.json').abi
const namehash = require('eth-ens-namehash').hash

const w3 = new Web3('https://sasquatch.network/rinkeby')
const address = '0xBF6879f5f9AdD7D36b5c5B4f63E59fd4E32A6A1c'
log = console.log

async function main() {
  log('connected ', await w3.eth.getBlockNumber())
  const DAO = await new w3.eth.Contract(kernelABI, address)
  let vaultId = namehash('vault.aragonpm.eth')
  let namespace = await DAO.methods.APP_BASES_NAMESPACE().call()
  let result = await DAO.methods.getApp(namespace, vaultId).call()
  console.log('Vault: ', result)
}

main()
