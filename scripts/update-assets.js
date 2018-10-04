const fs = require('fs')
const file = require('./assets.json')
process.stdin.resume()
process.stdin.on('data', async (chunk) => {
  let input = await chunk.toString('utf8')
  input = input.split(' ')
  file.contracts.devnet.ens = input[1].split('\n')[0]
  file.contracts.devnet.daoFactory = input[3].split('\n')[0]
  file.contracts.devnet.apmRegistry = input[5].split('\n')[0]
  await fs.writeFileSync('./scripts/assets.json', JSON.stringify(file, null, 2))
})

