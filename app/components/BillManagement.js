import React from 'react'
import { Card, TextInput, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'
import { translate } from 'react-i18next'
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


//https://api.etherscan.io/api?module=stats&action=ethprice
const BLOCKS_PER_DAY = 6000

class BillManagement extends React.Component {
  constructor() {
    super()
    this.state = { 
      amount: '',
      escrowBalance: 0,
      ethBalance: 0,
      days: 0,
      paymentAddr: ''
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
      ethBalance: await this.getBalance(address),
      days,
      paymentAddr: await this.getPaymentAddress()
    }
  }

  async componentDidMount() { 
    console.log('DIDMOUNT')
    this.setState(await this.getValues())
  } 

  componentWillUpdate = async () => {
    console.log('DIDUPDATE')
    this.setState(await this.getValues())
  }

  addBill = async () => {
    await new Promise(resolve => {
      this.props.app.addBill({ value: this.state.amount }).subscribe(resolve)
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

  getPaymentAddress = async () => {
    return new Promise(resolve =>{
      this.props.app.call('paymentAddress').subscribe(resolve)
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

  render() {
    let { t } = this.props;
    let {
      amount,
      escrowBalance,
      ethBalance,
      days,
      paymentAddr,
    } = this.state;

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
          <QrCard>
            <Col md={6}>
              <Text size="xlarge">
                {t('paymentAddress')}: {paymentAddr}
              </Text>
            </Col>
            <Col md={6}>
              <QrCode
                value={paymentAddr}
                size={250}
                style={{height: 250, marginTop: 15}}
              />
            </Col>
          </QrCard>
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
