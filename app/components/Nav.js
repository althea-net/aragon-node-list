import React from 'react'
import { Button, DropDown, Icon } from '@aragon/ui'
import styled from 'styled-components'

import BillManagement from './BillManagement'
import NodeList from './NodeList'
import SubnetAdmin from './SubnetAdmin'
import { translate } from 'react-i18next'

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
`

NavButton.defaultProps = { 
  mode: 'outline'
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locale: 'EN' }
    this.locales = ['EN', 'ES']
  } 

  setLocale = i => {
    let locale = this.locales[i]
    this.props.i18n.changeLanguage(locale.toLowerCase())
    this.setState({ locale })
  }

  active = () => this.locales.findIndex(e => e === this.state.locale)

  render() {
    let { setPage, t } = this.props;

    return (
      <div>
        <NavButton onClick={() => setPage(NodeList)}>{t('nodeList')}</NavButton>
        <NavButton onClick={() => setPage(SubnetAdmin)}>{t('subnetAdmin')}</NavButton>
        <NavButton onClick={() => setPage(BillManagement)}>{t('billManagement')}</NavButton>
        <DropDown items={this.locales} onChange={this.setLocale} active={this.active()} />
      </div>
    );
  }
}

export default translate()(Nav)
