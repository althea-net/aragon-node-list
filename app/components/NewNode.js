import React from 'react';
import PropTypes from 'prop-types';
import { Button, Field, SidePanel, Text, TextInput } from '@aragon/ui';
import { translate } from 'react-i18next';
import styled from 'styled-components';

const FatTextInput = styled(TextInput)`
  padding: 8px;
`;

class SubscriptionFee extends React.Component {
  state = {
    fee: ''
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render () {
    const { opened, t, ipAddress, daoAddress } = this.props;
    const { nickname, ethAddress } = this.state;

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

        <Text.Block dangerouslySetInnerHTML={{ __html: t('toAssign', { interpolation: { escapeValue: false } }) }}></Text.Block>

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

SubscriptionFee.propTypes = {
  t: PropTypes.object,
  opened: PropTypes.bool,
  ipAddress: PropTypes.string,
  daoAddress: PropTypes.string
};

export default translate()(SubscriptionFee);
