import React from 'react'
import { Button, Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { Address6 } from 'ip-address'
import BigInteger from 'jsbn'
import web3Utils from 'web3-utils'


const Abbr = styled.abbr`
  cursor: pointer;
  text-decoration: none;
`

const RemoveButton = ({ app, ip, t }) => {
  let deleteMember = () => app.deleteMember(ip)

  return <Button emphasis="negative" onClick={deleteMember} mode="outline">{t("remove")}</Button>
} 

class NodeList extends React.Component {
  constructor(){
    super()
    this.state = {
      blocknumber: 0
    }
  }

  fundsColor = funds => (funds > 0) ? "green" : "red"

  getLatestBlock = () => {
    return new Promise(resolve => {
      this.props.app.web3Eth('getBlock', 'latest').subscribe(resolve)
    })
  }

  componentDidMount() {
    this.getLatestBlock().then(values => {
      this.setState({blocknumber: values.number})
    })
  }

  render() {
    let {nodes, t, app} = this.props
    if (!nodes || !nodes.length) return <Text>{t('noNodes')}</Text>
    return (
      <div>
        <Table
          header={
            <TableRow>
              <TableHeader title={t('nickname')} />
              <TableHeader title={t('fundsRemaining')} />
              <TableHeader title={t('ethAddress')} />
              <TableHeader title={t('ipAddress')} />
              <TableHeader title={t('removeNode')} />
            </TableRow>
          }
        >
          {nodes.map((d, i) => {
            let {nickname, bill, ethAddress, ipAddress} = d;
            let trunc = (s, n) => `${s.substr(0,n)}...${s.substr(-n)}`
            nickname = web3Utils.toUtf8(nickname)
            let addr = Address6.fromBigInteger(new BigInteger(ipAddress.substr(2), 16))
            let ip = addr.correctForm() + '/64'

            let v = (bill.balance - (this.state.blocknumber - bill.lastUpdated)*bill.perBlock).toString()
            let balance = web3Utils.fromWei(v)

            return (
              <TableRow key={i}>
                <TableCell>
                  <Text>{nickname}</Text>
                </TableCell>
                <TableCell>
                  <Text color={this.fundsColor(balance)}>&Xi;{balance}</Text>
                </TableCell>
                <TableCell>
                  <Text><Abbr title={ethAddress}>{trunc(ethAddress, 6)}</Abbr></Text>
                </TableCell>
                <TableCell>
                  <Text><Abbr>{ip}</Abbr></Text>
                </TableCell>
                <TableCell>
                  <RemoveButton app={app} ip={ipAddress} t={t} />
                </TableCell>
              </TableRow>
            )}
          )}
        </Table>
      </div>
    );
  }
}
export default translate()(NodeList)
