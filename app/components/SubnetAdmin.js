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

class SubnetAdmin extends React.Component {
  constructor() {
    super()
    this.state = {
      nickname: 'tony',
      ethAddress: '0x09c4d1f918d3c02b390765c7eb9849842c8f7997',
      ipAddress: '0xc0a8010ac0a8010a'
    } 
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
    this.setState({ ipAddress })
  }

  addNode = async () => {
    console.log('adding', this.state.ethAddress, this.state.ipAddress, this.state.nickname)
    this.props.app.call('addMember',
      this.state.ethAddress,
      this.state.ipAddress,
      this.state.nickname
    )
  } 

  render() {
    let { t } = this.props;

    return (
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
                value={this.state.nickname}
              />
            </Field>
            <Button>Scan node QR code</Button>
            <Field label={t('ethAddress')}>
              <TextInput wide
                type="text"
                name="address"
                placeholder={t('enterEthAddress')}
                onChange={this.setEthAddress}
                value={this.state.ethAddress}
              />
            </Field>
            <Field label={t('ipAddress')}>
              <TextInput wide
                type="text"
                name="ip"
                placeholder={t('enterIpAddress')}
                onChange={this.setIpAddress}
                value={this.state.ipAddress}
              />
            </Field>
            <Field>
              <Button onClick={this.addNode}>{t('addNode')}</Button>
            </Field>
          </StyledCard>
          <StyledCard>
            <Text size="xlarge">{t('collectBills')}</Text>
            <p>{t('youHave', { bills: 123.34 })}</p>
            <Button>{t('collectBills')}</Button>
          </StyledCard>
        </Col>
        <Col xs={6}>
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
  }
}

export default translate()(SubnetAdmin)
