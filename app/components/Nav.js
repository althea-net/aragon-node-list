import React from 'react'
import { Button } from '@aragon/ui'
import styled from 'styled-components'

import BillManagement from './BillManagement'
import NodeList from './NodeList'
import SubnetAdmin from './SubnetAdmin'

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
`

NavButton.defaultProps = { mode: 'outline' }

export default ({ setPage }) => {
  return (
    <div>
      <NavButton onClick={() => setPage(NodeList)}>Node list</NavButton>
      <NavButton onClick={() => setPage(SubnetAdmin)}>Subnet admin</NavButton>
      <NavButton onClick={() => setPage(BillManagement)}>Bill management</NavButton>
    </div>
  );
} 
