import React from 'react'
import { AragonApp, observe, AppBar, Button, Text } from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { Grid, Row, Col } from 'react-flexbox-grid'

import NewNodeForm from './components/NewNodeForm'
import CheckNode from './components/CheckNode'
import DeleteNode from './components/DeleteNode'
import NodeList from './components/NodeList'
import Nav from './components/Nav'

const AppContainer = styled(AragonApp)`
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-direction: column;
  text-align: center;
`

export default class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <AppBar style={{background: "#efefef", border: "3px solid #ddd"}} title="Althea Subnet DAO" endContent={<Nav />} />
        <NodeList />
        <Row center='xs'>
          <Col>
            <CheckNode app={this.props.app} />
          </Col>
        </Row>
        <Row center='xs' around='xs'>
          <Col xs={6} md={6} sm={6} lg={6}>
            <NewNodeForm app={this.props.app} />
          </Col>
          <Col xs={6} md={6} sm={6} lg={6}>
            <DeleteNode app={this.props.app} />
          </Col>
        </Row>
      </AppContainer>
    )
  }
}
