import React from 'react'
import { Card, TextInput, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import QrCode from 'qrcode.react'
import web3Utils from 'web3-utils'

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


//https://api.etherscan.io/api?module=stats&action=ethprice
const BLOCKS_PER_DAY = 6000

class BillManagement extends React.Component {
  constructor() {
    super()
    this.state = { 
      amount: '',
      escrowBalance: '0',
      days: 0,
    }
  } 

  async getValues() {
    let address = (await this.getAccounts())[0]
    let currentBlock = (await this.getLatestBlock()).number
    let bill = await this.getBill(address)
    let { balance, lastUpdated, perBlock } = bill
    let blocksElapsed = currentBlock - lastUpdated
    if (blocksElapsed > 0) blocksElapsed++
    let days = (balance / (perBlock * BLOCKS_PER_DAY)).toFixed(4)
    if (isNaN(days)) days = 0
    return {
      escrowBalance: balance,
      days
    }
  }

  componentDidMount = async () => this.setState(await this.getValues())
  componentDidUpdate = async () => this.setState(await this.getValues())

  addBill = async () => {
    await new Promise(resolve => {
      this.props.app.addBill({ value: web3Utils.toWei(this.state.amount)}).subscribe(resolve)
    })

    this.componentDidMount()
  } 

  getAccounts = () => {
    return new Promise(resolve => {
      this.props.app.accounts().subscribe(resolve)
    }) 
  } 

  getBill = async address => {
    return new Promise(resolve => {
      this.props.app.call('billMapping', address).subscribe(resolve)
    }) 
  } 

  getLatestBlock = () => {
    return new Promise(resolve => {
      this.props.app.web3Eth('getBlock', 'latest').subscribe(resolve)
    }) 
  } 

  getBalance = address => {
    return new Promise(resolve => {
      this.props.app.web3Eth('getBalance', address).subscribe(resolve)
    }) 
  } 
  setAmount = (e) => {
    let amount = e.target.value
    this.setState({ amount })
  } 

  withdraw = async () => {
    await new Promise(resolve => {
      this.props.app.withdrawFromBill().subscribe(resolve)
    })

    this.componentDidMount()
  }

  renderQR(t, appAddress) {
    // This just checks if the address exist.
    // When there are no events ever on the contract
    // the address cannot be acquired in script.js
    if(appAddress !== '') {
      return(
        <QrCard>
          <Col md={6}>
            <Text size="xlarge">
              {t('paymentAddress')}: {appAddress}
            </Text>
          </Col>
          <Col md={6}>
            <QrCode
              value={appAddress}
              size={250}
              style={{height: 250, marginTop: 15}}
            />
          </Col>
        </QrCard>
      )
    }
    return(<div></div>)
  }

  render() {
    let { t, appAddress} = this.props;
    if(!appAddress) appAddress = ''
    let {
      amount,
      escrowBalance,
      days,
    } = this.state;

    escrowBalance = web3Utils.fromWei(escrowBalance)

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <StyledCard>
              <Text.Block>
                Your current balance is <strong>&Xi;{escrowBalance}</strong>.
                This will pay your subnet DAO fees for <strong>{days} days</strong>.
              </Text.Block>
            </StyledCard>
          </Col>
        </Row>
        <Row>
        {this.renderQR(t, appAddress)}
        </Row>
        <Row>
          <Col xs={6}>
            <StyledCard>
              <Text size="xlarge">{t('addFunds')}</Text>
              <Field label={t('amountToAdd')}>
                <TextInput wide
                  type="text"
                  name="amount"
                  placeholder={t('enterAmount')}
                  value={amount}
                  onChange={this.setAmount}
                />
              </Field>
              <Button onClick={this.addBill} mode="outline">{t('addFunds')}</Button>
            </StyledCard>
          </Col>
          <Col xs={6}>
            <StyledCard>
              <Text.Block size="xlarge">{t('withdrawAllFunds')}</Text.Block>
              <Button onClick={this.withdraw} mode="outline">{t('withdraw')}</Button>
            </StyledCard>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default translate()(BillManagement)
