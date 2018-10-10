import React from 'react'
import { Card, TextInput, Info, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import web3Utils from 'web3-utils'
import { Address6 } from 'ip-address'
import QrReader from 'react-qr-reader'

const StyledCard = styled(Card)`
  width: 100%;
  height: auto;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
`


class SubnetAdmin extends React.Component {
  constructor() {
    super()

    this.state = {
      bills: 0,
      delay: 300,
      currentBlock: 0,
      checkAddress: '',
      checkResult: null,
      ipExists: false,
      removeAddress: '',
      removeResult: null,
      ethAddress: '',
      ipAddress: this.generateIp(),
      ipValid: true,
      nickname: '',
      result: 'No result'
    } 
  } 

  generateIp = () => {
    let prefix = '2001:dead:beef:'
    let bytes = new Uint16Array(1)
    crypto.getRandomValues(bytes)

    let suffix = ('0000' + Array.from(bytes).toString(16)).substr(-4)
    return prefix + suffix + '::/64'
  } 

  async componentDidMount() {
    let currentBlock = (await this.getLatestBlock()).number
    let { nodes } = this.props

    let bills = 0

    if (nodes && nodes.length) {
      await Promise.all(nodes.map(async node => {
        bills += await this.getOwing(currentBlock, node)
      }))
    }

    this.setState({ bills, currentBlock })
  } 

  collectBills = async () => {
    await new Promise(resolve => {
      this.props.app.collectBills().subscribe(resolve)
    }) 

    this.componentDidMount()
  } 

  checkNode = () => {
    let { nodes } = this.props
    let { checkAddress } = this.state

    let checkResult = nodes.findIndex(n => n.ethAddress.toLowerCase() === checkAddress.toLowerCase()) > -1
    this.setState({ checkResult })
  } 

  removeNode = async () => {
    let { nodes } = this.props
    let { removeAddress } = this.state

    let node = nodes.find(n => n.ethAddress.toLowerCase() === removeAddress.toLowerCase())

    if (!node) return this.setState({ removeResult: false })
    console.log(node)

    try {
      await new Promise((resolve, reject) => {
        console.log(node.ipAddress)
        this.props.app.deleteMember(node.ipAddress).subscribe(resolve, reject)
      }) 
      this.setState({ removeResult: true })
    } catch (e) {
      console.log(e)
    } 
  } 

  getOwing = async (currentBlock, node) => {
    let bill = await this.getBill(node.ethAddress)
    let { lastUpdated, perBlock } = bill
    let blocksElapsed = currentBlock - lastUpdated
    if (blocksElapsed > 0) blocksElapsed++
    return blocksElapsed * perBlock
  }

  getLatestBlock = () => {
    return new Promise(resolve => {
      this.props.app.web3Eth('getBlock', 'latest').subscribe(resolve)
    }) 
  } 

  getBill = address => {
    return new Promise(resolve => {
      this.props.app.call('billMapping', address).subscribe(resolve)
    }) 
  } 

  setNickname = e => { 
    let nickname = e.target.value
    this.setState({ nickname })
  }

  setEthAddress = e => { 
    let ethAddress = e.target.value
    this.setState({ ethAddress })
  }

  setIpAddress = e => { 
    let ipAddress = e.target.value
    let ipValid = (new Address6(ipAddress)).isValid()

    let hexIp = '0x' + ipAddress.replace(new RegExp(':', 'g'), '')
    let ipExists = false
    let { nodes } = this.props

    if (nodes)
      ipExists = nodes.findIndex(n => n.ipAddress === hexIp) > -1

    this.setState({ ipAddress, ipExists, ipValid })
  }

  addNode = async () => {
    let { ethAddress, ipAddress, nickname } = this.state
    nickname = web3Utils.padRight(web3Utils.toHex(nickname), 32)
    ipAddress = '0x' + ipAddress.replace(new RegExp(':', 'g'), '')
    this.props.app.addMember(
      ethAddress,
      ipAddress,
      nickname
    )
  } 

  formatIp = async e => {
    let addr = new Address6(e.target.value)
    if (addr.isValid()) this.setState({ ipAddress: addr.correctForm() + addr.subnet })
  } 

  handleScan = result => {
    if (result) {
      this.setState({ result })
    }
  }

  handleError = err => {
    console.error(err)
  }

  render() {
    let { t } = this.props;
    let { 
      bills, 
      checkResult, 
      currentBlock, 
      nickname, 
      ethAddress, 
      ipAddress, 
      ipValid,
      ipExists,
      removeResult 
    } = this.state

    /*
    const billCount = new BN(summation(subscribersCount))
    const perBlockFee = await contract.perBlockFee()
    let expectedBalance = perBlockFee.mul(billCount).add(new BN(0))
    */

    return (
      <React.Fragment>
        <Row>
          <Col xs={6}>
            <StyledCard>
              <Text size="xlarge">{t('addNode')}</Text>
              <Field label={t('nodeNickname')}>
                <TextInput wide
                  type="text"
                  name="nickname"
                  placeholder={t('whoOwns')}
                  onChange={this.setNickname}
                  value={nickname}
                />
              </Field>
              <Button>Scan node QR code</Button>
              <div>
                <QrReader
                  delay={this.state.delay}
                  onError={this.handleError}
                  onScan={this.handleScan}
                  style={{ width: '300px' }}
                  />
                <p>{this.state.result}</p>
              </div>
              <Field label={t('ethAddress')}>
                <TextInput wide
                  type="text"
                  name="address"
                  placeholder={t('enterEthAddress')}
                  onChange={this.setEthAddress}
                  value={ethAddress}
                />
              </Field>
              {ipValid || <Info>Enter a valid ipv6 address</Info>}
              {ipExists && <Info>IP has already been added</Info>}
              <Field label={t('ipAddress')}>
                <TextInput wide
                  type="text"
                  name="ip"
                  placeholder={t('enterIpAddress')}
                  onChange={this.setIpAddress}
                  onBlur={this.formatIp}
                  value={ipAddress}
                />
              </Field>
              <Field>
                <Button onClick={this.addNode} mode="outline">{t('addNode')}</Button>
              </Field>
            </StyledCard>
            <StyledCard>
              <Text size="xlarge">{t('collectBills')}</Text>
              <p>{t('youHave', { bills })}</p>
              <Button onClick={this.collectBills} mode="outline">{t('collectBills')}</Button>
            </StyledCard>
          </Col>
          <Col xs={6}>
            <StyledCard>
              <Text size="xlarge">{t('checkNode')}</Text>
              {checkResult && <Info title="Yup!" />}
              {checkResult !== null && !checkResult && <Info title="Nope" />}
              <Field label={t('ethAddress')}>
                <TextInput wide
                  type="text"
                  placeholder={t('enterEthAddress')}
                  onChange={e => { this.setState( { checkAddress: e.target.value }) }}
                  value={this.state.checkAddress}
                />
              </Field>
              <Button onClick={this.checkNode} mode="outline">{t('checkNodeInSubnetDAO')}</Button>
            </StyledCard>
            <StyledCard>
              <Text size="xlarge">{t('removeNode')}</Text>
              {removeResult && <Info title="Gone!" />}
              {removeResult !== null && !removeResult && <Info title="Can't find node" />}
              <Field label={t('ethAddress')}>
                <TextInput wide
                  type="text"
                  name="address"
                  placeholder={t('enterEthAddress')}
                  onChange={e => { this.setState( { removeAddress: e.target.value }) }}
                  value={this.state.removeAddress}
                />
              </Field>
              <Button onClick={this.removeNode} mode="outline">{t('removeNodeFromSubnetDAO')}</Button>
            </StyledCard>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default translate()(SubnetAdmin)
