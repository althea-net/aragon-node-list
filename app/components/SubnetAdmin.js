import React from 'react'
import { Card, TextInput, Info, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import web3Utils from 'web3-utils'
import { Address6 } from 'ip-address'
import QrReader from 'react-qr-reader'
import QrCode from 'qrcode.react'

const StyledCard = styled(Card)`
  width: 100%;
  height: auto;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
`

const QrCard = styled(Card)`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  height: auto;
  padding: 15px;
  margin: 15px 0;
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
      ipAddress: '',
      ipValid: true,
      nickname: '',
      scanning: false
    } 
  } 

  generateIp = () => {
    const subnet48 = '2001:dead:beef:'
    let bytes = new Uint16Array(1)
    crypto.getRandomValues(bytes)

    let block64 = Array.from(bytes)[0].toString(16)
    let ipAddress = subnet48 + block64 + '::/64' 

    if (this.ipExists(ipAddress)) {
      return this.generateIp()
    }

    this.setState({ ipAddress })
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

    this.generateIp()
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

    let checkResult = false

    if (nodes)
      checkResult = nodes.findIndex(n => n.ethAddress.toLowerCase() === checkAddress.toLowerCase()) > -1

    this.setState({ checkResult })
  } 

  removeNode = async () => {
    let { nodes } = this.props
    let { removeAddress } = this.state

    let node

    if (nodes)
      node = nodes.find(n => n.ethAddress.toLowerCase() === removeAddress.toLowerCase())

    if (!node) return this.setState({ removeResult: false })

    try {
      await new Promise((resolve, reject) => {
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

  hexIp = ip =>
    '0x' + (new Address6(ip)).canonicalForm().replace(new RegExp(':', 'g'), '')


  ipExists = ip => {
    let { nodes } = this.props

    if (nodes)
      return nodes.findIndex(n => n.ipAddress === this.hexIp(ip)) > -1

    return false
  } 

  setIpAddress = e => { 
    let ipAddress = e.target.value
    let ipValid = (new Address6(ipAddress)).isValid()

    let ipExists = this.ipExists()

    this.setState({ ipAddress, ipExists, ipValid })
  }

  addNode = async () => {
    let { ethAddress, ipAddress, nickname } = this.state
    nickname = web3Utils.padRight(web3Utils.toHex(nickname), 32)
    ipAddress = this.hexIp(ipAddress)

    try {
      let res = await new Promise((resolve, reject) => {
        this.props.app.addMember(
          ethAddress,
          ipAddress,
          nickname
        ).subscribe(resolve, reject)
      }) 

    } catch (e) { console.log(e) }
  } 

  formatIp = async e => {
    let addr = new Address6(e.target.value)
    if (addr.isValid()) this.setState({ ipAddress: addr.correctForm() + addr.subnet })
  } 

  startScanning = () => this.setState({ scanning: true })

  handleScan = result => {
    if (web3Utils.isAddress(result)) {
      this.setState({ ethAddress: result, scanning: false })
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
      removeResult,
      scanning
    } = this.state

    /*
    const billCount = new BN(summation(subscribersCount))
    const perBlockFee = await contract.perBlockFee()
    let expectedBalance = perBlockFee.mul(billCount).add(new BN(0))
    */

    return (
      <React.Fragment>
        <Row>
          <Col md={6}>
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
              {ipValid || <Info>Enter a valid ipv6 address</Info>}
              {ipExists && <Info>IP has already been added</Info>}
              <Field label={t('ipAddress')}>
                <Row>
                  <Col md={8}>
                    <TextInput wide
                      type="text"
                      name="ip"
                      placeholder={t('enterIpAddress')}
                      onChange={this.setIpAddress}
                      onBlur={this.formatIp}
                      value={ipAddress}
                    />
                  </Col>
                  <Col md={4} style={{ textAlign: 'center' }}>
                    <Button mode="outline" onClick={this.generateIp}>Generate IP</Button>
                  </Col>
                </Row>
                <QrCard>
                  <Text.Block>To assign this IP to a router, go to Networking Settings -> Subnet DAOs in the Althea Dashboard web interface and click the Scan QR button, then position this QR code in the center of the camera.</Text.Block>
                  <QrCode value={ipAddress} size={250} style={{height: 250, marginTop: 15}} />
                </QrCard>
              </Field>
              <Field label={t('ethAddress')}>
                <Row>
                  <Col md={8}>
                    <TextInput wide
                      type="text"
                      name="address"
                      placeholder={t('enterEthAddress')}
                      onChange={this.setEthAddress}
                      value={ethAddress}
                    />
                  </Col>
                  <Col md={4} style={{ textAlign: 'center' }}>
                    <React.Fragment>
                      {scanning || <Button mode="outline" onClick={() => this.setState({ scanning: true })}>Scan QR</Button>}
                      {scanning && <Button mode="outline" onClick={() => this.setState({ scanning: false })}>Stop Scanning</Button>}
                    </React.Fragment>
                  </Col>
                </Row>
              </Field>
              {scanning && 
                <QrCard>
                  <QrReader
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '300px' }}
                  />
                </QrCard>
              }
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
          <Col md={6}>
            <StyledCard>
              <Text size="xlarge">{t('checkNode')}</Text>
              {checkResult && <Info title="Yes, the node exists" />}
              {checkResult !== null && !checkResult && <Info title="The node could not be found" />}
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
              {removeResult && <Info title="Node successfully removed" />}
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
