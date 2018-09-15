import Aragon from '@aragon/client'
import { of } from 'rxjs/observable/of'

const app = new Aragon()

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const initialState = {
  nodes: [],
  subscribers: [
    {
      nickname: "Lance",
      funds: 12,
      address: "0xb4124ceb3451635dacedd11767f004d8a28c6ee7",
      ip: "fddb:5b43:29f5:7244:13b4:e76b:473e:761a"
    },
    {
      nickname: "Elliott",
      funds: 100,
      address: "0xb4124ceb3451635dacedd11767f004d8a28c6ee7",
      ip: "fddb:5b43:29f5:7244:13b4:e76b:473e:761a"
    },
    {
      nickname: "Kevin",
      funds: -1,
      address: "0xb4124ceb3451635dacedd11767f004d8a28c6ee7",
      ip: "fddb:5b43:29f5:7244:13b4:e76b:473e:761a"
    },
    {
      nickname: "Todd",
      funds: 22.13,
      address: "0xb4124ceb3451635dacedd11767f004d8a28c6ee7",
      ip: "fddb:5b43:29f5:7244:13b4:e76b:473e:761a"
    },
    {
      nickname: "Jackson",
      funds: 34.23,
      address: "0xb4124ceb3451635dacedd11767f004d8a28c6ee7",
      ip: "fddb:5b43:29f5:7244:13b4:e76b:473e:761a"
    }
  ]
}

app.store(async (state, event) => {
  if (state === null) state = initialState
  return initialState 
}, [of({ event: INITIALIZATION_TRIGGER })])
