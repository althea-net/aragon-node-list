import React from 'react';
import PropTypes from 'prop-types';
import { Button, Field, SidePanel, Text, TextInput } from '@aragon/ui';
import { translate } from 'react-i18next';
import { Row, Col } from 'react-flexbox-grid';
import styled from 'styled-components';
import QrCode from 'qrcode.react';

const FatTextInput = styled(TextInput)`
  padding: 8px;
`;

class NewNode extends React.Component {
  state = {
    fee: '',
    scanning: false
  };

  startScanning = () => {
    let w = Math.min(screen.height, screen.width);
    let specs = `
      width=${w / 2},
      height=${w / 2},
      left=${w / 4},
      top=${w / 4},
      scrollbar=0,
      menubar=0,
      toolbar=0,
      status=0,
      location=0,
      directories=0,
      scrollbars=0
    `;

    let url = location.href.replace('index.html', '');
    url += 'qrscan.html';

    window.open(url, 'Scan QR Code', specs);

    this.setState({ scanning: true });
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  getIp = () => {
    const subnet48 = '2001:dead:beef:';
    let bytes = new Uint16Array(1);
    crypto.getRandomValues(bytes);

    let block64 = Array.from(bytes)[0].toString(16);
    let ipAddress = subnet48 + block64 + '::/64';

    if (this.ipExists(ipAddress)) {
      return this.getIp();
    }

    return ipAddress;
  }

  ipExists = ip => {
    let { nodes } = this.props;
    if (nodes) {
      return nodes.findIndex(n => n.ipAddress === this.hexIp(ip)) > -1;
    }

    return false;
  }

  messageHandler = ({ data }) => {
    if (data.toString().startsWith('qr:')) { this.setState({ ethAddress: data.replace('qr:', ''), scanning: false }); }
  }

  render () {
    const { opened, t, daoAddress } = this.props;
    const { nickname, ethAddress } = this.state;
    const ipAddress = this.getIp();

    return (
      <SidePanel title={t('newNode')} opened={opened}>
        <Field label={t('nodeNickname')}>
          <FatTextInput
            type="text"
            name="nickname"
            onChange={this.onChange}
            value={nickname}
          />
        </Field>

        <Field label={t('customersEthereumAddress')}>
          <Text>{t('scanTheQR')}</Text>
          <FatTextInput
            type="text"
            name="fee"
            onChange={this.onChange}
            value={ethAddress}
            style={{ marginRight: 15 }}
          />
          <Button mode="outline">Scan QR Code</Button>
        </Field>

        <hr style={{ border: '1px solid #eee' }} />

        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Text size="large" weight="bold">{t('configureSubnet')}</Text>
        </div>

        <Row>
          <Col xs={6}>
            <Text.Block dangerouslySetInnerHTML={{ __html: t('toAssign', { interpolation: { escapeValue: false } }) }}></Text.Block>
          </Col>
          <Col xs={6}>
            <QrCode value={
              JSON.stringify({ daoAddress, ipAddress })}
            size={200}
            style={{ marginTop: 15 }}
            />
          </Col>
        </Row>

        <Field label={t('ipAddress')} style={{ marginTop: 10 }}>
          <Text>{ipAddress}</Text>
        </Field>

        <Field label="Subnet Organization Ethereum Address">
          <Text>{daoAddress}</Text>
        </Field>

        <Button mode="strong" wide style={{ marginTop: 20 }}>{t('addNode')}</Button>
      </SidePanel>
    );
  }
};

NewNode.propTypes = {
  t: PropTypes.object,
  opened: PropTypes.bool,
  daoAddress: PropTypes.string,
  nodes: PropTypes.array
};

export default translate()(NewNode);
