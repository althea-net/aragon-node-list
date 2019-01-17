import React from 'react';
import PropTypes from 'prop-types';
import { Button, Field, Info, SidePanel, Text, TextInput } from '@aragon/ui';
import { translate } from 'react-i18next';

class SubscriptionFee extends React.Component {
  state = {
    fee: ''
  };

  onChange = e => {
    console.log(e);
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render () {
    const { opened, t } = this.props;
    const { fee } = this.state;
    const currentFee = 0.2;

    return (
      <SidePanel title={t('updateSubscriptionFee')} opened={opened}>
        <Info.Action title={t('nodesPay')}>
          <Text>Updating the subscription fee impacts the amount that each node is required to pay for being part of your organization.</Text>
        </Info.Action>

        <div style={{ marginTop: 15, marginBottom: 15 }}>
          <Text>The current subscription fee is &Xi; {currentFee} per month.</Text>
        </div>

        <Field label={t('newSubscriptionFee')}>
          <TextInput
            type="text"
            name="fee"
            onChange={this.onChange}
            value={fee}
          />
          <Text style={{ color: '#ccc', fontSize: '12px', marginLeft: 10 }}>ETH</Text>
        </Field>

        <Button mode="strong" wide style={{ marginTop: 20 }}>{t('updateSubscriptionFee')}</Button>
      </SidePanel>
    );
  }
};

SubscriptionFee.propTypes = {
  t: PropTypes.object,
  opened: PropTypes.bool
};

export default translate()(SubscriptionFee);
