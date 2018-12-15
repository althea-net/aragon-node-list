import '@babel/polyfill'

import Aragon from '@aragon/client'
import { of } from 'rxjs/observable/of'

const app = new Aragon()

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const initialState = {
  nodes: []
}

app.store(async (state, {event, address, returnValues}) => {

  console.log('STATE', state)
  console.log('EVENT', event)
  let bill = {}
  switch (event) {
    case INITIALIZATION_TRIGGER:
      console.log('INIT TRIGGER')
      state = initialState
      break
    case 'NewMember':
      let { nickname, ethAddress, ipAddress } = returnValues
      bill = await getBill(ethAddress)
      state.nodes.push(
        {
          nickname,
          ethAddress,
          ipAddress,
          bill
        }
      )
      break
    case 'MemberRemoved':
      let i = state.nodes.findIndex(n => n.ipAddress === returnValues.ipAddress)
      state.nodes.splice(i, 1)
      break
    case 'BillUpdated':
      let { payer, collector } = returnValues
      bill = await getBill(payer)
      let node = state.nodes.find(n => n.ethAddress === payer)
      node.funds = bill.balance
      break
  }

  state.appAddress = address
  return state
}, [of({ event: INITIALIZATION_TRIGGER })])

function getBill(address) {
  return new Promise(resolve => {
    app
    .call('billMapping', address)
    .subscribe(resolve)
  })
}

function getUser(ip) {
  return new Promise(resolve => {
    app
    .call('userMapping', ip)
    .subscribe(resolve)
  })
}

function getIp(index) {
  return new Promise(resolve => {
    app
    .call('subnetSubscribers', index)
    .subscribe(resolve)
  })
}

function getCountOfSubscribers() {
  return new Promise(resolve => {
    app
    .call('getCountOfSubscribers')
    .subscribe(resolve)
  })
}

async function getEverythingFromUser(index) {
  let ipAddress = await getIp(index)
  let {ethAddr, nick } = await getUser(ipAddress)
  let {balance, lastUpdated, perBlock } = await getBill(ethAddr)
  return {
    ethAddress: ethAddr,
    nickname: nick,
    ipAddress,
    bill: {balance, lastUpdated, perBlock}
  }
}
