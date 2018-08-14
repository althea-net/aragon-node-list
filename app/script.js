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
  let value = await getNodeList()
  let nodes = transposeArray([value[0], value[1]])
  console.log("VALUEEEEEEEEEES", nodes[0], nodes[1])

  switch (event.event) {
    case "NewMember":
      return { nodes: nodes }
    case "MemberRemoved":
      return { nodes: nodes }
    default:
      return state
  }
})

function getNodeList() {
  console.log("YOOOOOOOOOOOOOO")
  return new Promise(resolve => {
    app
    .call('getNodeList')
    .subscribe(resolve)
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
