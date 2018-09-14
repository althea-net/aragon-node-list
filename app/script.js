import Aragon from '@aragon/client'

const app = new Aragon()

const initialState = {
  nodes: []
}

app.store(async (state, event) => {
  console.log('hiiiiiiii')
  if (state === null) state = initialState
  return state
})
