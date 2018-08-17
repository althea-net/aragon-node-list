import Aragon from '@aragon/client'

const app = new Aragon()

const initialState = {
  nodes: []
}

app.store(async (state, event) => {
  if (state === null) state = initialState
  return state
})
