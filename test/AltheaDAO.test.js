const AltheaDAO = artifacts.require('./AltheaDAO.sol')

const { assertRevert } = require('./helpers/assertRevert.js')

const ZERO = '0x0000000000000000000000000000000000000000'

contract('AltheaDAO', (accounts) => {
  let contract
  let ipv6 = '0xc0a8010ac0a8010a'

  beforeEach(async function() {
    contract = await AltheaDAO.new()
  })

  it('Adds a new member to the list', async function() {
    await contract.addMember(accounts[1], ipv6)
    let address = await contract.nodeList(ipv6)
    assert(contract.nodeList(ipv6), address)
  })

  it('Reverts when adding an existing member to the list', async function() {
    await contract.addMember(accounts[1], ipv6)
    assertRevert(contract.addMember(accounts[1], ipv6))
  })

  it('Removes member from list', async function() {
    await contract.addMember(accounts[1], ipv6)
    assert(await contract.nodeList(ipv6), accounts[1])

    await contract.deleteMember(ipv6)
    assert(await contract.nodeList(ipv6), ZERO)
  })
})
