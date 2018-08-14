import Aragon from '@aragon/client'

const app = new Aragon()

const transposeArray = array => {
  return array[0].map((col, i) => {
    return array.map(row => row[i])
  })
}

const initialState = {
  nodes: []
}

app.store(async (state, event) => {
  if (state === null) state = initialState
  console.log('state', state)
  switch (event.event) {
    case "NewMember":
      return { nodes: await getNodeList() }
    case "MemberRemoved":
      return { nodes: await getNodeList() }
    default:
      return state
  }
})

function getNodeList() {
  console.log("YOOOOOOOOOOOOOO")
  return new Promise(resolve => {
    app
    .call('getNodeList')
    .subscribe(value => {
      return transposeArray([value[0], value[1]])
    })
  })
}

function getIp() {
  return new Promise(resolve => {
    app
    .call('ip')
    .subscribe(resolve)
  })
}

function getAddr() {
  return new Promise(resolve => {
    app
    .call('addr')
    .subscribe(resolve)
  })
}
