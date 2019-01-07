const ethers = require('ethers')

//new ethers . providers . JsonRpcProvider( [ urlOrInfo = “http://localhost:8545” ] [ , network ] )
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

async function mineBlock() {
  console.log('hi')
  await provider.send("evm_mine")
}

async function mineBlocks(count) {
  let i = 0;
  while (i < count) {
    await mineBlock();
    i++;
  }
}

mineBlocks(50)
