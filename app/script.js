import Aragon from '@aragon/client'
import { of } from 'rxjs/observable/of'

const app = new Aragon()

const initialState = {
  nodes: []
}

app.store(async (state, { event, returnValues }) => {
  switch (event) {
    case 'NewMember':
      let { nickname, ethAddress, ipAddress } = returnValues
      state.nodes.push(
        {
          nickname,
          ethAddress,
          ipAddress,
          funds: 0
        }
      )
    break;
    case 'MemberRemoved':
      let i = state.nodes.findIndex(n => n.ipAddress === returnValues.ipAddress)
      state.nodes.splice(i, 1)
    break;
    case 'NewBill':
    case 'BillUpdated':
      let { payer, collector } = returnValues
      let bill = await getBill(payer)
      let node = state.nodes.find(n => n.ethAddress === payer)
      node.funds = bill.account
    break;
  } 

  return state
})

function getBill(address) {
  return new Promise(resolve => {
    app
    .call('billMapping', address)
    .subscribe(resolve)
  })
}

function getNode(i) {
  return new Promise(resolve => {
    app
    .nodeList(i)
    .subscribe(resolve)
  })
}

function getCountOfSubscribers(i) {
  return new Promise(resolve => {
    app
    .getCountOfSubscribers()
    .subscribe(resolve)
  })
}
