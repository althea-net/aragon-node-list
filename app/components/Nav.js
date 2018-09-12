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

export default translate()(({ i18n, setPage, t }) => {
  let locales = ['EN', 'ES'];
  let setLocale = i => i18n.changeLanguage(locales[i].toLowerCase())
  let active = locales.findIndex(e => e === i18n.language.toUpperCase())

  return (
    <div>
      <NavButton onClick={() => setPage(NodeList)}>{t('nodeList')}</NavButton>
      <NavButton onClick={() => setPage(SubnetAdmin)}>{t('subnetAdmin')}</NavButton>
      <NavButton onClick={() => setPage(BillManagement)}>{t('billManagement')}</NavButton>
      <DropDown items={locales} onChange={setLocale} active={active} />
    </div>
  );
})
