import React from 'react'
import ReactDOM from 'react-dom'
import QrReader from 'react-qr-reader'
import web3Utils from 'web3-utils'

const handleScan = result => {
  if (web3Utils.isAddress(result)) {
    window.opener.postMessage('qr:' + result, '*')
    self.close()
  } 
} 

ReactDOM.render(
  <QrReader
    onError={e => console.log(e)}
    onScan={handleScan}
    style={{ width: '100%' }}
  />,
  document.getElementById('root')
)
