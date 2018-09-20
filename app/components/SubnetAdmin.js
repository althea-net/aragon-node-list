import React from 'react'
import { Card, TextInput, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import web3Utils from 'web3-utils'

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
    let { ethAddress, ipAddress, nickname } = this.state
    nickname = web3Utils.padRight(web3Utils.toHex(nickname), 32)
    this.props.app.addMember(
      ethAddress,
      ipAddress,
      nickname
    )
  } 

  render() {
    let { t } = this.props;
    let { nickname, ethAddress, ipAddress} = this.state
    /*
    const billCount = new BN(summation(subscribersCount))
    const perBlockFee = await contract.perBlockFee()
    let expectedBalance = perBlockFee.mul(billCount).add(new BN(0))
    */
    let bills = 125.23

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
                value={nickname}
              />
            </Field>
            <Button>Scan node QR code</Button>
            <Field label={t('ethAddress')}>
              <TextInput wide
                type="text"
                name="address"
                placeholder={t('enterEthAddress')}
                onChange={this.setEthAddress}
                value={ethAddress}
              />
            </Field>
            <Field label={t('ipAddress')}>
              <TextInput wide
                type="text"
                name="ip"
                placeholder={t('enterIpAddress')}
                onChange={this.setIpAddress}
                value={ipAddress}
              />
            </Field>
            <Field>
              <Button onClick={this.addNode}>{t('addNode')}</Button>
            </Field>
          </StyledCard>
          <StyledCard>
            <Text size="xlarge">{t('collectBills')}</Text>
            <p>{t('youHave', { bills })}</p>
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
