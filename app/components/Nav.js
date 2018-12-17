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
    this.renderOrganizer = this.renderOrganizer.bind(this)
    this.renderUser = this.renderUser.bind(this)
  } 

  componentDidMount() {
    this.props.setPage(BillManagement)
  } 

  componentWillReceiveProps(nextProps) {
    if (this.props.mode !== nextProps.mode) {
      if(this.props.mode === 'organizer'){
        this.props.setPage(BillManagement)
      } else {
        this.props.setPage(SubnetAdmin)
      }
    }
  }

  setLocale = i => {
    let locale = this.locales[i]
    this.props.i18n.changeLanguage(locale.toLowerCase())
    this.setState({ locale })
  }

  active = () => this.locales.findIndex(e => e === this.state.locale)

  renderOrganizer = () => {
    return(
      <React.Fragment>
        <NavButton onClick={() => this.props.setPage(NodeList)}> 
          {this.props.t('nodeList')}
        </NavButton>
        <NavButton onClick={() => this.props.setPage(SubnetAdmin)}>
          {this.props.t('subnetAdmin')}
        </NavButton>
      </React.Fragment>
    )
  }

  renderUser = () => {
    return(
      <NavButton onClick={() => this.props.setPage(BillManagement)}>
        {this.props.t('billManagement')}
      </NavButton>
    )
  }

  render() {
    return (
      <div>
        {this.props.mode === 'organizer' ? this.renderOrganizer() : this.renderUser()}
        <DropDown items={this.locales} onChange={this.setLocale} active={this.active()} />
      </div>
    );
  }
}

export default translate()(Nav)
