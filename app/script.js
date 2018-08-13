import Aragon from '@aragon/client'

const app = new Aragon()


function getIpAddr() {
  console.log("BUUUYAAA")
  return new Promise(resolve => {
    app
      .call('ip')
      .subscribe(resolve)
  })
}

function getEthAddr() {
  console.log("BOWOWOW")
  return new Promise(resolve => {
    app
      .call('addr')
      .subscribe(resolve)
  })
}

function getNodeList() {
  console.log("FUUCK")
  return new Promise(resolve => {
    app
      .call('getNodeList')
      .subscribe(resolve)
  })
}

export default app
