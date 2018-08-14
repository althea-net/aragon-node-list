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

  switch (event.event) {
    case "NewMember":
      return { nodes: transposeArray(getNodeList()) }
    case "MemberRemoved":
      return { nodes: transposeArray(getNodeList()) }
    default:
      return state
  }
})

function getNodeList() {
  return new Promise(resolve => {
    app.call('getNodeList').subscribe(resolve)
  })
}
