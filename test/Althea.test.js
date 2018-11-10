const Althea = artifacts.require('./Althea.sol')
Althea.numberFormat = 'BN'
const toBN = web3.utils.toBN

require('chai').should()

const expectEvent = require('./helpers/expectEvent.js')
const { assertRevert } = require('./helpers/assertRevert.js')
const { summation } = require('./helpers/summation.js')
const getContract = name => artifacts.require(name)


const ZERO = '0x0000000000000000000000000000000000000000'

contract('Althea', accounts => {

  let daoFact, altheaBase, althea, paymentAddress, perBlockFee
  let MANAGER
  const root = accounts[0]

  before(async () => {
    const kernelBase = await getContract('Kernel').new(true) // petrify immediately
    const aclBase = await getContract('ACL').new()
    daoFact = await getContract('DAOFactory').new(
      kernelBase.address,
      aclBase.address,
      ZERO,
    )
    altheaBase = await getContract('Althea').new()

    // Setup constants
    ANY_ENTITY = await aclBase.ANY_ENTITY()
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
    MANAGER = await altheaBase.MANAGER()
  })

  beforeEach(async () => {
    const r = await daoFact.newDAO(root)
    const dao = await getContract('Kernel').at(r.logs.filter(
      l => l.event == 'DeployDAO')[0].args.dao
    )
    const acl = await getContract('ACL').at(await dao.acl())
    await acl.createPermission(
      root, dao.address, APP_MANAGER_ROLE, root, { from: root }
    )
    const receipt = await dao.newAppInstance(
      '0x1234', altheaBase.address, { from: root }
    )
    althea = await getContract('Althea').at(
      receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy
    )

    await acl.createPermission(
      ANY_ENTITY,
      althea.address,
      MANAGER,
      root,
      { from: root }
    )
    paymentAddress = await web3.eth.personal.newAccount()
    perBlockFee = toBN(web3.utils.toWei('0.0000001', 'gwei'))
    await althea.initialize(paymentAddress)
    await althea.setPerBlockFee(perBlockFee)
  })

  context('Node List', () => {
    let ipv6 = web3.utils.padRight('0xc0a8010ac0a8010a', 32)
    let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)

    it('Adds a new member to the list', async () => {
      //console.log('vault', await althea.vaultAddress())
      let init = await althea.hasInitialized()
      let petri = await althea.isPetrified()
      await althea.addMember(accounts[1], ipv6, nick)
      let address = await althea.nodeList(ipv6)
      assert.equal(await althea.nodeList(ipv6), address)
    })

    it('Reverts when adding an existing member to the list', async () => {
      await althea.addMember(accounts[1], ipv6, nick)
      assertRevert(althea.addMember(accounts[1], ipv6, nick))
    })

    it('Removes member from list', async () => {
      await althea.addMember(accounts[1], ipv6, nick)
      let value = await althea.nodeList(ipv6)
      assert.equal(value, accounts[1])

      await althea.deleteMember(ipv6)
      let value2 = await althea.nodeList(ipv6)
      assert.equal(value2, ZERO)
    })

    it('Saves the proper nick name', async () => {
      await althea.addMember(accounts[1], ipv6, nick)
      let value = await althea.nickName(ipv6)
      assert.equal(value, nick)
    })

    it('Deletes nick name from mapping', async () => {
      await althea.addMember(accounts[1], ipv6, nick)
      let value = await althea.nickName(ipv6)
      assert.equal(value, nick)

      await althea.deleteMember(ipv6)
      let value2 = await althea.nickName(ipv6)
      assert.equal(value2, web3.utils.padRight('0x', 32))
    })

    it('Should have a NewMember event', async () => {
      const receipt = await althea.addMember(accounts[1], ipv6, nick)
      const event = await expectEvent.inLogs(receipt.logs, 'NewMember', {
        ethAddress: accounts[1],
        ipAddress: ipv6,
        nickname: nick
      })
      event.args.ethAddress.should.eql(accounts[1])
      event.args.ipAddress.should.eql(ipv6)
      event.args.nickname.should.eql(nick)
    })

    it('Should have a MemberRemoved event', async () => {
      await althea.addMember(accounts[1], ipv6, nick)
      const receipt = await althea.deleteMember(ipv6)
      const event = await expectEvent.inLogs(receipt.logs, 'MemberRemoved', {
        ethAddress: accounts[1],
        ipAddress: ipv6,
        nickname: nick
      })
      event.args.ethAddress.should.eql(accounts[1])
      event.args.ipAddress.should.eql(ipv6)
      event.args.nickname.should.eql(nick)
    })

  })

  describe('addBill', async () => {
    it('Revert when no value is sent', async () => {
      assertRevert(althea.addBill())
    })

    it('Adds a new bill to mapping', async () => {

      const receipt = await althea.addBill({value: 2*(10**10)})
      const event = await expectEvent.inLogs(receipt.logs, 'NewBill', { 
        payer: accounts[0],
        collector: paymentAddress
      })
      event.args.payer.should.eql(accounts[0])
      event.args.collector.should.eql(paymentAddress)
    })

    it('Contract ether balance should increase', async () => {
      let balance = 2*(10**10)
      await althea.addBill({value: balance})

      let altheaBalance = await web3.eth.getBalance(althea.address)
      altheaBalance.should.eql(web3.utils.toBN(balance).toString())
    })

    it('Increase bill by corresponding amount', async () => {
      let account =  2*(10**10)
      await althea.addBill({value: account})
      await althea.addBill({value: account})
      let total = toBN(account*2)
      let bill = await althea.billMapping(accounts[0])
      assert(bill.account.eq(total))
    })
  })


  describe('getCountOfSubscribers', async () => {

    it('Should have the right length', async () => {

      let min = Math.ceil(7)
      let max = Math.floor(2)
      let subnetDAOUsers = Math.floor(Math.random() * (max - min)) + min

      for (let i = 0; i < subnetDAOUsers; i++) {
        await althea.addBill({from: accounts[i], value: 2*(10**10)})
      }
      let subscribers = await althea.getCountOfSubscribers()
      subscribers.toNumber().should.eql(subnetDAOUsers)
    })
  })

  describe('setPerBlockFee', async () => {

    it('Should set a new perBlockFee', async() => {
      let newFee = 10**7
      await althea.setPerBlockFee(newFee)
      nn = await althea.perBlockFee()
      nn.toNumber().should.eql(newFee)
    })
  })

  describe('collectBills', async () => {

    it('Bill lastUpdated should equal current block number', async () => {
      await althea.addBill({value: 1*(10**18)})
      await althea.collectBills()
      let bill = await althea.billMapping(accounts[0])
      let blockNumber = toBN(await web3.eth.getBlockNumber())
      bill.lastUpdated.toString().should.eql(blockNumber.toString())
    })

    it('Subnet should have an expected balance for single account', async () => {

      await althea.addBill({value: 1*(10**18)})
      
      let previousBalance = toBN(await web3.eth.getBalance(paymentAddress))
      let bill = await althea.billMapping(accounts[0])

      await althea.collectBills()

      // this block number needs to be after the collectSubetFees call
      let blockDelta = toBN(await web3.eth.getBlockNumber()).sub(bill.lastUpdated)
      let expectedRevenue = bill.perBlock.mul(blockDelta)
      let expectedBalance = expectedRevenue.add(previousBalance)

      toBN(await web3.eth.getBalance(paymentAddress))
        .eq(expectedBalance).should.eql(true)
    })

    it('Collect from multiple bills', async () => {

      let accountOne = 1*(10**17)
      let subscribersCount = 6
      for (var i = 0; i < subscribersCount; i++) {
        await althea.addBill({from: accounts[i], value: accountOne})
      }

      await althea.collectBills()

      const billCount = toBN(summation(subscribersCount))
      let expectedBalance = perBlockFee.mul(billCount)

      toBN(await web3.eth.getBalance(paymentAddress))
        .eq(expectedBalance).should.eql(true)
    })

    it('Set bill account to zero', async () => {

      let accountOne = 2*(10**10)
      await althea.addBill({value: accountOne})

      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      await althea.collectBills()
      let bill = await althea.billMapping(accounts[0])
    })
  })

  describe('payMyBills', async () => {
    it('Bill should have lastUpdated with same blockNumber', async () => {

      let accountOne = 2*(10**10)
      await althea.addBill({value: accountOne})
      await althea.payMyBills()
      let bill = await althea.billMapping(accounts[0])
      assert(bill.lastUpdated.eq(toBN(await web3.eth.getBlockNumber())))
    })

    it('Payment address should have increased balance', async () => {

      let accountOne = 2*(10**17)
      await althea.addBill({value: accountOne})

      // extra txns to run up the counter
      let blockCount = 5
      for (var i = 0; i < blockCount; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      // the +1 is for the payMyBills txn block number
      let expectedBalance = perBlockFee.mul(toBN(blockCount + 1))
      let txn = await althea.payMyBills()
      let currentBalance = toBN(await web3.eth.getBalance(paymentAddress))
      currentBalance.eq(expectedBalance).should.eql(true)
    })

    it('Account of bill should be zero when it runs out', async () => {

      // the two is the amount of blocks to pass
      let accountOne = toBN(2).mul(perBlockFee)
      await althea.addBill({value: accountOne})

      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      await althea.payMyBills()
      let bill = await althea.billMapping(accounts[0])
      bill.account.toString().should.eql('0')
    })
  })

  describe('withdrawFromBill', async () => {
    it('Increases the balance of the subscriber', async () => {

      let accountOne = toBN(10).mul(perBlockFee)
      await althea.addBill({from: accounts[1], value: accountOne})

      // extra txns to run up the counter
      const blockCount = 5
      for (var i = 0; i < blockCount; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      const oldBalance = toBN(await web3.eth.getBalance(accounts[1]))
      let txn = await althea.withdrawFromBill({from: accounts[1]})
      let txnCost = toBN(txn.receipt.gasUsed*(await web3.eth.getGasPrice()))
     
      // for some reason the normal new BN() doesn't work here
      let expectedBalance = web3.utils
        .toBN(accountOne - perBlockFee*(blockCount+1))
        .add(oldBalance).sub(txnCost)
      const current = toBN(await web3.eth.getBalance(accounts[1]))
      expectedBalance.eq(current).should.eql(true)
    })
    
    it('It reverts (saves gas) when the account has 0', async () => {
      let accountOne = 2*(10**10)

      await althea.addBill({from: accounts[1], value: accountOne})

      // extra txns to run up the counter
      for (var i = 0; i < 10; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }
      assertRevert(althea.withdrawFromBill({from: accounts[1]}))
    })
  })
})
