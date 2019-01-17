import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropDown, Text, TextInput } from '@aragon/ui';
import { translate } from 'react-i18next';

const locales = ['EN', 'ES'];

class Settings extends React.Component {
  state = {
    language: 0,
    threshold: 0.3
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setLocale = i => {
    let locale = locales[i];
    this.props.i18n.changeLanguage(locale.toLowerCase());
    this.setState({ locale: i });
  }

  render () {
    const { t } = this.props;
    const { locale, threshold } = this.state;

    return (
      <div>
        <Text size="large">{t('language')}</Text>
        <Text.Paragraph>This will be the default language for display purposes.</Text.Paragraph>

        <DropDown
          items={locales}
          active={locale}
          onChange={this.setType}
        />
        <Button mode="strong">Submit Changes</Button>
        <Text size="large">Low Balance Threshold</Text>
        <Text.Paragraph>When a nodes balance is equal to or below this level, it will be considered a low balance.</Text.Paragraph>
        <TextInput
          type="text"
          name="threshold"
          onChange={this.onChange}
          value={threshold}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  i18n: PropTypes.object,
  t: PropTypes.func
};

export default translate()(Settings);
