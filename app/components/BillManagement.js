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
    this.state = { amount: 1000000001 }
  } 

  addBill = () => {
    this.props.app.addBill({ value: this.state.amount })
  } 

  setAmount = (e) => {
    let amount = e.target.value
    this.setState({ amount })
  } 

  render() {
    let { t } = this.props;
    let { amount } = this.state;

    return (
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
            <Button>{t('withdraw')}</Button>
          </StyledCard>
        </Col>
      </Row>
    );
  }
}

export default translate()(BillManagement)
