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

export default translate()(({ t }) => {
  return (
    <Row>
      <Col xs="6">
        <StyledCard>
          <Text size="xlarge">{t('addFunds')}</Text>
          <Field label={t('amountToAdd')}>
            <TextInput wide
              type="text"
              name="nickname"
              placeholder={t('enterAmount')}
            />
          </Field>
          <Button>{t('addFunds')}</Button>
        </StyledCard>
      </Col>
      <Col xs="6">
        <StyledCard>
          <Text.Block size="xlarge">{t('withdrawAllFunds')}</Text.Block>
          <Button>{t('withdraw')}</Button>
        </StyledCard>
      </Col>
    </Row>
  );
})
