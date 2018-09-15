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
    this.pages = {
      nodeList: NodeList,
      subnetAdmin: SubnetAdmin, 
      billManagement: BillManagement 
    } 
  } 

  componentDidMount() {
    this.props.setPage(this.pages['nodeList'])
  } 

  setLocale = i => {
    let locale = this.locales[i]
    this.props.i18n.changeLanguage(locale.toLowerCase())
    this.setState({ locale })
  }

  active = () => this.locales.findIndex(e => e === this.state.locale)

  render() {
    let { setPage, t } = this.props;
    let pages = Object.keys(this.pages);

    return (
      <div>
        {pages.map((p, i) => {
          return <NavButton onClick={() => setPage(this.pages[p])} key={i}>{t(p)}</NavButton>
        })}
        <DropDown items={this.locales} onChange={this.setLocale} active={this.active()} />
      </div>
    );
  }
}

export default translate()(Nav)
