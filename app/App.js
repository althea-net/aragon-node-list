import React from "react"
import { AragonApp, observe, Button, Text } from "@aragon/ui"
import Aragon, { providers } from "@aragon/client"
import styled from "styled-components"
import { Grid, Row, Col } from 'react-flexbox-grid';

import NewNodeForm from "./components/NewNodeForm"
import NodesTable from "./components/NodesTable"

const AppContainer = styled(AragonApp)`
  display: flex;
  justify-content: center;
`

export default class App extends React.Component {
  render() {
    return (
      <AragonApp className="app">
        <AppContainer>
          <Col top>
            <Row><NewNodeForm app={this.props.app} /></Row>
            <Row>
              <ObservedNodesTable observable={this.props.observable} />
            </Row>
          </Col>
        </AppContainer>
      </AragonApp>
    )
  }
}

const ObservedNodesTable = observe((state$) => state$, { nodes: [] })
(NodesTable)
