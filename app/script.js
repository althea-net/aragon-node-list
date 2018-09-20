import Aragon from '@aragon/client'
import { of } from 'rxjs/observable/of'

const app = new Aragon()

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const initialState = {
  nodes: []
}

app.store(async (state, { event, returnValues }) => {
  switch (event) {
    case INITIALIZATION_TRIGGER:
      state = initialState
      let count = await getCountOfSubscribers()
      for (let i; i < count; i++) {
        let node = await getNode(i)
        state.nodes.push({ address: node[0], ip: node[1] })
      } 
    break;
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
  } 

  return state
}, [of({ event: INITIALIZATION_TRIGGER })])


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
