import React from "react"
import { AragonApp, observe, Button, Text } from "@aragon/ui"
import Aragon, { providers } from "@aragon/client"
import styled from "styled-components"
import { Grid, Row, Col } from 'react-flexbox-grid';

import NewNodeForm from "./components/NewNodeForm"
import NodesTables from "./components/NodesTable"

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
          APP CONTRACT CALL
          <Button 
            onClick={() => this.props.app.addMember(
              '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7', '0x01020304'
            )}
          >
            Add Member
          </Button>
        </div>
        <div>
          <NewNodeForm 
            app={this.props.app}
          />
        </div>
        <div>
          <NodesTables 
            app={this.props.app}
          />
        </div>
      </AppContainer>
    )
  }
}
