import React from 'react'
import { AragonApp, observe, Button, Text } from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { Grid, Row, Col } from 'react-flexbox-grid'

import NewNodeForm from './components/NewNodeForm'
import CheckNode from './components/CheckNode'
import DeleteNode from './components/DeleteNode'

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
        <Row center='xs' top>
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
