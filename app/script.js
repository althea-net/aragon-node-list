import Aragon from '@aragon/client'
import { of } from 'rxjs/observable/of'

const app = new Aragon()

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const initialState = {
  nodes: []
}

app.store(async (state, { event }) => {
  console.log('hi', state, event)
  if (state === null) state = initialState

  switch (event) {
    case INITIALIZATION_TRIGGER:
      console.log('getting count')
      let count = await getCountOfSubscribers()
      console.log('got count', count)
      for (let i; i < count; i++) {
        state.nodes.push(await getNode(i))
      } 
    break;
    case 'NewMember':
      state.nodes.push(
        {
          nickname: "Crackson",
          funds: 66.23,
          address: "0xb4124ceb3451635dacedd11767f004d8a28c6ee8",
          ip: "fddb:5b43:29f5:7244:13b4:e76b:473e:761b"
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
