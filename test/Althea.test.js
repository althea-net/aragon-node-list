const Althea = artifacts.require('./Althea.sol')
Althea.numberFormat = 'BN'
const BN = web3.utils.BN

require('chai').should()

const expectEvent = require('./helpers/expectEvent.js')
const { assertRevert } = require('./helpers/assertRevert.js')
const { summation } = require('./helpers/summation.js')

const ZERO = '0x0000000000000000000000000000000000000000'

contract('Althea', accounts => {

  let contract
  let paymentAddress

  beforeEach(async () => {
    paymentAddress = await web3.eth.personal.newAccount()
  })

  context('Node List', () => {
    let ipv6 = web3.utils.padRight('0xc0a8010ac0a8010a', 32)
    let nick = web3.utils.padRight(web3.utils.toHex('Nick Hoggle'), 32)
    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Adds a new member to the list', async () => {
      await contract.addMember(accounts[1], ipv6, nick)
      let address = await contract.nodeList(ipv6)
      assert.equal(await contract.nodeList(ipv6), address)
    })

    it('Reverts when adding an existing member to the list', async () => {
      await contract.addMember(accounts[1], ipv6, nick)
      assertRevert(contract.addMember(accounts[1], ipv6, nick))
    })

    it('Removes member from list', async () => {
      await contract.addMember(accounts[1], ipv6, nick)
      let value = await contract.nodeList(ipv6)
      assert.equal(value, accounts[1])

      await contract.deleteMember(ipv6)
      let value2 = await contract.nodeList(ipv6)
      assert.equal(value2, ZERO)
    })

    it('Saves the proper nick name', async () => {
      await contract.addMember(accounts[1], ipv6, nick)
      let value = await contract.nickName(ipv6)
      assert.equal(value, nick)
    })

    it('Deletes nick name from mapping', async () => {
      await contract.addMember(accounts[1], ipv6, nick)
      let value = await contract.nickName(ipv6)
      assert.equal(value, nick)

      await contract.deleteMember(ipv6)
      let value2 = await contract.nickName(ipv6)
      assert.equal(value2, web3.utils.padRight('0x', 32))
    })

    it('Should have a NewMember event', async () => {
      const receipt = await contract.addMember(accounts[1], ipv6, nick)
      const event = await expectEvent.inLogs(receipt.logs, 'NewMember', {
        ethNodeAddress: accounts[1],
        ipAddress: ipv6,
        nickName: nick
      })
      event.args.ethNodeAddress.should.eql(accounts[1])
      event.args.ipAddress.should.eql(ipv6)
      event.args.nickName.should.eql(nick)
    })

    it('Should have a MemberRemoved event', async () => {
      await contract.addMember(accounts[1], ipv6, nick)
      const receipt = await contract.deleteMember(ipv6)
      const event = await expectEvent.inLogs(receipt.logs, 'MemberRemoved', {
        ethNodeAddress: accounts[1],
        ipAddress: ipv6,
        nickName: nick
      })
      event.args.ethNodeAddress.should.eql(accounts[1])
      event.args.ipAddress.should.eql(ipv6)
      event.args.nickName.should.eql(nick)
    })

  })

  describe('addBill', async () => {

    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Revert when no value is sent', async () => {
      assertRevert(contract.addBill())
    })

    it('Adds a new bill to mapping', async () => {

      const receipt = await contract.addBill({value: 2*(10**10)})
      const event = await expectEvent.inLogs(receipt.logs, 'NewBill', { 
        payer: accounts[0],
        collector: paymentAddress
      })
      event.args.payer.should.eql(accounts[0])
      event.args.collector.should.eql(paymentAddress)
    })

    it('Contract ether balance should increase', async () => {
      let balance = 2*(10**10)
      await contract.addBill({value: balance})

      let contractBalance = await web3.eth.getBalance(contract.address)
      contractBalance.should.eql(web3.utils.toBN(balance).toString())
    })

    it('Increase bill by corresponding amount', async () => {
      let account =  2*(10**10)
      await contract.addBill({value: account})
      await contract.addBill({value: account})
      let total = new BN(account*2)
      let bill = await contract.billMapping(accounts[0])
      assert(bill.account.eq(total))
    })
  })


  describe('getCountOfSubscribers', async () => {

    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Should have the right length', async () => {

      let min = Math.ceil(7)
      let max = Math.floor(2)
      let subnetDAOUsers = Math.floor(Math.random() * (max - min)) + min

      for (let i = 0; i < subnetDAOUsers; i++) {
        await contract.addBill({from: accounts[i], value: 2*(10**10)})
      }
      let subscribers = await contract.getCountOfSubscribers()
      subscribers.toNumber().should.eql(subnetDAOUsers)
    })
  })

  describe('setPerBlockFee', async () => {

    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Should set a new perBlockFee', async() => {
      let newFee = 10**7
      await contract.setPerBlockFee(newFee)
      let nn = await contract.perBlockFee()
      nn.toNumber().should.eql(newFee)
    })
  })

  describe('setPaymentAddress', async () => {
    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Should set a new paymentAddress', async() => {
      let newAddress = await web3.eth.personal.newAccount()
      await contract.setPaymentAddress(newAddress)
      let addr = await contract.paymentAddress()
      addr.should.eql(newAddress)
    })

  })

  describe('collectBills', async () => {

    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Bill lastUpdated should equal current block number', async () => {
      await contract.addBill({value: 1*(10**18)})
      await contract.collectBills()
      let bill = await contract.billMapping(accounts[0])
      let blockNumber = new BN(await web3.eth.getBlockNumber())
      bill.lastUpdated.toString().should.eql(blockNumber.toString())
    })

    it('Subnet should have an expected balance for single account', async () => {

      await contract.addBill({value: 1*(10**18)})
      
      let previousBalance = new BN(await web3.eth.getBalance(paymentAddress))
      let bill = await contract.billMapping(accounts[0])

      await contract.collectBills()

      // this block number needs to be after the collectSubetFees call
      let blockDelta = new BN(await web3.eth.getBlockNumber()).sub(bill.lastUpdated)
      let expectedRevenue = bill.perBlock.mul(blockDelta)
      let expectedBalance = expectedRevenue.add(previousBalance)

      new BN(await web3.eth.getBalance(paymentAddress))
        .eq(expectedBalance).should.eql(true)
    })

    it('Collect from multiple bills', async () => {

      let accountOne = 1*(10**17)
      let subscribersCount = 6
      for (var i = 0; i < subscribersCount; i++) {
        await contract.addBill({from: accounts[i], value: accountOne})
      }

      await contract.collectBills()

      const billCount = new BN(summation(subscribersCount))
      const perBlockFee = await contract.perBlockFee()
      let expectedBalance = perBlockFee.mul(billCount).add(new BN(0))

      new BN(await web3.eth.getBalance(paymentAddress))
        .eq(expectedBalance).should.eql(true)
    })

    it('Set bill account to zero', async () => {

      let accountOne = 2*(10**10)
      await contract.addBill({value: accountOne})

      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      await contract.collectBills()
      let bill = await contract.billMapping(accounts[0])
    })
  })

  describe('payMyBills', async () => {

    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Bill should have lastUpdated with same blockNumber', async () => {

      let accountOne = 2*(10**10)
      await contract.addBill({value: accountOne})
      await contract.payMyBills()
      let bill = await contract.billMapping(accounts[0])

      assert(bill.lastUpdated.eq(new BN(await web3.eth.getBlockNumber())))
    })

    it('Payment address should have increased balance', async () => {

      let accountOne = 2*(10**17)
      await contract.addBill({value: accountOne})

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
      const perBlockFee = await contract.perBlockFee()
      let expectedBalance = perBlockFee.mul(new BN(blockCount + 1))
      // the i prefix is for inplace
      await contract.payMyBills()
      let currentBalance = new BN(await web3.eth.getBalance(paymentAddress))
      currentBalance.eq(expectedBalance).should.eql(true)
    })

    it('Account of bill should be zero when it runs out', async () => {

      let accountOne = 2*(10**10)
      await contract.addBill({value: accountOne})

      // extra txns to run up the counter
      for (var i = 0; i < 4; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      await contract.payMyBills()
      let bill = await contract.billMapping(accounts[0])
      bill.account.toString().should.eql('0')
    })
  })

  describe('withdrawFromBill', async () => {
111
    beforeEach(async () => {
      contract = await Althea.new()
      await contract.initialize(paymentAddress, 10**10)
    })

    it('Increases the balance of the subscriber', async () => {

      let accountOne = 1*(10**16)
      await contract.addBill({from: accounts[1], value: accountOne})

      // extra txns to run up the counter
      const blockCount = 5
      for (var i = 0; i < blockCount; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }

      const oldBalance = new BN(await web3.eth.getBalance(accounts[1]))
      let txn = await contract.withdrawFromBill({from: accounts[1]})
      let txnCost = new BN(txn.receipt.gasUsed*(await web3.eth.getGasPrice()))
     
      // for some reason the normal new BN() doesn't work here
      const perBlockFee = await contract.perBlockFee()
      let expectedBalance = web3.utils
        .toBN(accountOne - perBlockFee*(blockCount+1))
        .add(oldBalance).sub(txnCost)
      const current = new BN(await web3.eth.getBalance(accounts[1]))
      expectedBalance.eq(current).should.eql(true)
    })
    
    it('It reverts (saves gas) when the account has 0', async () => {
      let accountOne = 2*(10**10)

      await contract.addBill({from: accounts[1], value: accountOne})

      // extra txns to run up the counter
      for (var i = 0; i < 10; i++) {
        await  web3.eth.sendTransaction({
          from: accounts[1],
          to: ZERO,
          value: 1
        })
      }
      assertRevert(contract.withdrawFromBill({from: accounts[1]}))
    })
  })
})
