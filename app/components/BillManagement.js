import React from 'react'
import { Card, TextInput, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'
import { translate } from 'react-i18next'

const StyledCard = styled(Card)`
  width: 100%;
  height: auto;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
`

const BLOCKS_PER_DAY = 6000

class BillManagement extends React.Component {
  constructor() {
    super()
    this.state = { 
      amount: '',
      account: 0,
      balance: 0,
      days: 0
    }
  } 

  async componentDidMount() {
    let address = (await this.getAccounts())[0]
    let balance = await this.getBalance(address)
    let currentBlock = (await this.getLatestBlock()).number
    let bill = await this.getBill(address)
    let { account, lastUpdated, perBlock } = bill
    let blocksElapsed = currentBlock - lastUpdated
    if (blocksElapsed > 0) blocksElapsed++
    let days = (account / (perBlock * BLOCKS_PER_DAY)).toFixed(4)
    if (isNaN(days)) days = 0
    this.setState({ account, balance, days })
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
    let { amount, account, balance, days } = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <StyledCard>
              <Text.Block>
                Your current balance is <strong>&Xi;{account}</strong>.
                This will pay your subnet DAO fees for <strong>{days} days</strong>.
              </Text.Block>
            </StyledCard>
          </Col>
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
