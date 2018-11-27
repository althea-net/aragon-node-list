const toBN = web3.utils.toBN

async function assertGasCost (receipt) {

  const txn = await web3.eth.getTransaction(receipt.tx)
  const oldBalance = toBN(await web3.eth.getBalance(txn.from, txn.blockNumber - 1))
  const currentBalance = toBN(await web3.eth.getBalance(txn.from, txn.blockNumber))

  const gasPrice = toBN(txn.gasPrice)
  let cost = gasPrice.mul(toBN(receipt.receipt.gasUsed)).add(toBN(txn.value))

  assert.equal(
    oldBalance.sub(currentBalance).toString(),
    cost.toString(),
    "txn cost does not add up"
  )
}

module.exports = {
  assertGasCost,
};
