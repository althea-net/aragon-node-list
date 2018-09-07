import React from 'react'
import { Button } from '@aragon/ui'

export default () => {
  return (
    <div>
      <Button style={{borderLeft: "none", borderRight: "none", borderRadius: 0, background: "#ccc" }} mode="outline">Node list</Button>
      <Button style={{borderLeft: "none", borderRight: "none", borderRadius: 0 }} mode="outline">Subnet admin</Button>
      <Button style={{borderLeft: "none", borderRight: "none", borderRadius: 0 }} mode="outline">Bill management</Button>
    </div>
  );
} 
