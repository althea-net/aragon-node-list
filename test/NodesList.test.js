const NodesList = artifacts.require('./NodesList.sol');

const { assertRevert } = require('./helpers/assertRevert.js')

const tranposeArray = array => {
  return array[0].map((col, i) => {
      return array.map(row => row[i])
  });
}

contract('NodesList', (accounts) => {
  let contract;
  let allNodes = [
    [accounts[1], '0xc0a8010a'],
    [accounts[2], '0xc0a8010b'],
    [accounts[3], '0xc0a8010c'],
    [accounts[4], '0xc0a8010d'],
    [accounts[5], '0xc0a8010e'],
    [accounts[6], '0xc0a8010f'],
  ]

  beforeEach(async function() {
    contract = await NodesList.new();
  });

  it('Adds a new member to the list', async function() {
    await contract.addMember(accounts[1], '0xc0a8010a');
    await contract.addMember(accounts[2], '0xc0a8010b');
    let nodes = await contract.getNodeList(); 
    assert(nodes[0].includes(accounts[1]))
  });

  it('Returns all of the members of the nodes list', async function() {
    await contract.addMember(...allNodes[0]);
    await contract.addMember(...allNodes[1]);
    await contract.addMember(...allNodes[2]);
    await contract.addMember(...allNodes[3]);
    await contract.addMember(...allNodes[4]);
    await contract.addMember(...allNodes[5]);

    let nodes = await contract.getNodeList();
    nodes = tranposeArray(nodes);
    assert.deepEqual(allNodes, nodes, "Should be the same values");
  });

  it('Removes member from list', async function() {
    await contract.addMember(...allNodes[0]);
    await contract.addMember(...allNodes[1]);
    await contract.addMember(...allNodes[2]);
    await contract.addMember(...allNodes[3]);

    await contract.deleteMember(1);
    let nodes = await contract.getNodeList(); 
    nodes = tranposeArray(nodes);
    
    assert(nodes[0].length === nodes[1].length);
    assert.deepEqual([allNodes[0], allNodes[2], allNodes[3]], nodes);
  });

  it('Reverts on index outside of range', async function() {

    await contract.addMember(...allNodes[0]);
    await contract.addMember(...allNodes[1]);
    await contract.addMember(...allNodes[2]);
    await contract.addMember(...allNodes[3]);
    await contract.addMember(...allNodes[4]);
    await contract.addMember(...allNodes[5]);

    await contract.deleteMember(1);
    await contract.deleteMember(3);
      
    let nodes = await contract.getNodeList(); 
    assert(nodes[0].length === nodes[1].length);
    assert(nodes[0].length === 4);
    assertRevert(contract.deleteMember(5));
  });

});
