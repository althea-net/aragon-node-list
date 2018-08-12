import Aragon from '@aragon/client'

const app = new Aragon()

function getNodesList() {
  return new Promise(resolve => {
    app
      .call('getNodesList')
      .subscribe(resolve)
  })
}

app.store(async (state, event) => {
  if (state === null) state = getNodesList()

  if (event.event) {
    return { state: await getNodesList() }
  }
  return state
})

