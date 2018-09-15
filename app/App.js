import React from 'react'
import { AragonApp, AppBar, observe } from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { Grid } from 'react-flexbox-grid'
import { translate } from 'react-i18next'

import NewNodeForm from './components/NewNodeForm'
import CheckNode from './components/CheckNode'
import DeleteNode from './components/DeleteNode'
import Nav from './components/Nav'

const AppContainer = styled(AragonApp)`
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-direction: column;
  text-align: center;
`

const AltheaAppBar = styled(AppBar)`
  background: #efefef;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 0;
  margin: 0;
  height: 100%;
`

class App extends React.Component {
  constructor() {
    super();
    this.state = { page: null }
  } 

  setPage = page => this.setState({ page })  

  render() {
    const Page = this.state.page;
    const { t } = this.props;

    return (
      <AppContainer>
        <Grid fluid>
          <AltheaAppBar title={t('altheaSubnetDAO')} endContent={<Nav setPage={this.setPage} />} />
          {this.state.page && <Page app={this.props.app} subscribers={this.props.subscribers} />}
        </Grid>
      </AppContainer>
    )
  }
}

export default translate()(observe(
  observable => observable.map(state => ({ ...state })),
  {}
)(App))
