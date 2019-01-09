const Web3 = require('web3')
const w3 = new Web3('http://localhost:8545')

async function mineBlocks(count, cb) {
  let i = 0;
  console.log('Start: ', await w3.eth.getBlockNumber())
  while (i < count) {
    w3.currentProvider.send({
      method:"evm_mine"
    }, (error, result) => {
      if(error) {
        console.log('error', error)
      }
      return
    })
    i++;
  }
  console.log('End: ', await w3.eth.getBlockNumber())
  console.log('Done')
}

mineBlocks(50)
