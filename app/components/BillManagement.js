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

class BillManagement extends React.Component {
  constructor() {
    super()
    this.state = { 
      amount: 1000000001,
      account: 0,
      balance: 0,
      days: 0,
      owing: 0
    }
  } 

  async componentDidMount() {
    let address = (await this.getAccounts())[0]
    let balance = await this.getBalance(address)
    let currentBlock = (await this.getLatestBlock()).number
    let bill = await this.getBill(address)
    let { account, lastUpdated, perBlock } = bill
    let blocksPerDay = 6000
    let blocksElapsed = currentBlock - lastUpdated
    if (blocksElapsed > 0) blocksElapsed++
    let owing = blocksElapsed * perBlock
    let days = (account / (perBlock * blocksPerDay)).toFixed(6)
    this.setState({ account, balance, days, owing })
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
    let { amount, account, balance, days, owing } = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <StyledCard>
              <Text.Block>Address balance: <strong>&Xi;{balance}</strong></Text.Block>
              <Text.Block>DAO balance: <strong>&Xi;{account}</strong></Text.Block>
              <Text.Block>Outstanding payment: <strong>&Xi;{owing}</strong></Text.Block>
              <Text.Block>Estimated days paid up: <strong>{days}</strong></Text.Block>
              <Text.Block>Address balance after withdrawal: <strong>{parseInt(balance) + parseInt(account - owing)}</strong></Text.Block>
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
              <Button onClick={this.addBill}>{t('addFunds')}</Button>
            </StyledCard>
          </Col>
          <Col xs={6}>
            <StyledCard>
              <Text.Block size="xlarge">{t('withdrawAllFunds')}</Text.Block>
              <Button onClick={this.withdraw}>{t('withdraw')}</Button>
            </StyledCard>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default translate()(BillManagement)
