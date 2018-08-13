import React from "react"
import { AragonApp, observe, Button, Text } from "@aragon/ui"
import Aragon, { providers } from "@aragon/client"
import styled from "styled-components"

import NewNodeForm from "./NewNodeForm"
import NodesTables from "./NodesTable"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <div>
          <Text>
          </Text> 
        </div>
        <div>
          <NewNodeForm 
            contractCall={this.props.app.addMember}
          />
        </div>
        <div>
          <NodesTables 
            getEthAddr={this.props.app.getEthAddr}
            getIpAddr={this.props.app.getIpAddr}
          />
        </div>
      </AppContainer>
    )
  }
}
