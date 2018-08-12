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
  if (state === null) state = initialState

  if (event.event) {
    return { state: await getNodesList() }
  }
})

