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
      days: 0
    }
  } 

  async componentDidMount() {
    let bill = await this.getBill()
    let { account, perBlock } = bill
    let blocksPerDay = 6000
    let days = (account / (perBlock * blocksPerDay)).toFixed(6)
    this.setState({ account, days })
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

  getBill = async () => {
    let address = (await this.getAccounts())[0]
    console.log(address)
    return new Promise(resolve => {
      this.props.app.call('billMapping', address).subscribe(resolve)
    }) 
  } 

  setAmount = (e) => {
    let amount = e.target.value
    this.setState({ amount })
  } 

  withdraw = () => {
    this.props.app.withdrawFromBill()
  }

  render() {
    let { t } = this.props;
    let { amount, account, days } = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <StyledCard>
              <Text>Your current balance is <strong>&Xi;{account}</strong>. This will pay your subnet DAO fees for <strong>{days} days</strong>.</Text>
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
