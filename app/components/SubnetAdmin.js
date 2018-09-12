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
          <Text size="xlarge">{t('addNode')}</Text>
          <Field label={t('nodeNickname')}>
            <TextInput wide
              type="text"
              name="nickname"
              placeholder={t('whoOwns')}
            />
          </Field>
          <Button>Scan node QR code</Button>
          <Field label={t('ethAddress')}>
            <TextInput wide
              type="text"
              name="address"
              placeholder={t('enterEthAddress')}
            />
          </Field>
          <Field label={t('ipAddress')}>
            <TextInput wide
              type="text"
              name="ip"
              placeholder={t('enterIpAddress')}
            />
          </Field>
          <Field>
            <Button>{t('addNode')}</Button>
          </Field>
        </StyledCard>
        <StyledCard>
          <Text size="xlarge">{t('collectBills')}</Text>
          <p>{t('youHave', { bills: 123.34 })}</p>
          <Button>{t('collectBills')}</Button>
        </StyledCard>
      </Col>
      <Col xs="6">
        <StyledCard>
          <Text size="xlarge">{t('checkNode')}</Text>
          <Field label={t('ethAddress')}>
            <TextInput wide
              type="text"
              name="address"
              placeholder={t('enterEthAddress')}
            />
          </Field>
          <Button>{t('checkNodeInSubnetDAO')}</Button>
        </StyledCard>
        <StyledCard>
          <Text size="xlarge">{t('removeNode')}</Text>
          <Field label={t('ethAddress')}>
            <TextInput wide
              type="text"
              name="address"
              placeholder={t('enterEthAddress')}
            />
          </Field>
          <Button>{t('removeNodeFromSubnetDAO')}</Button>
        </StyledCard>
      </Col>
    </Row>
  );
})
