import React from "react"
import { AragonApp } from "@aragon/ui"
import styled from "styled-components"

import NewNodeForm from "./NewNodeForm"
import NodesTables from "./NodesTable"

const AppContainer = styled(AragonApp)`
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {
  render() {
    return (
      <AppContainer>
          <div>
            <NewNodeForm />
          </div>
          <div>
            <NodesTables />
          </div>
      </AppContainer>
    )
  }
}
