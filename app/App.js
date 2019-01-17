import React from 'react';
import PropTypes from 'prop-types';
import { AragonApp, Button, observe, Text } from '@aragon/ui';
import styled from 'styled-components';
import { Grid } from 'react-flexbox-grid';
import { translate } from 'react-i18next';

import Nav from './components/Nav';

import GenerateReport from './components/GenerateReport';
import SubscriptionFee from './components/SubscriptionFee';
import NewNode from './components/NewNode';

const AppContainer = styled(AragonApp)`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
`;

class App extends React.Component {
  state = { page: null }

  render () {
    const Page = this.state.page;
    const { app, nodes, appAddress, daoAddress } = this.props;

    return (
      <AppContainer>
        <GenerateReport opened={false} />
        <SubscriptionFee opened={false} />
        <NewNode opened={false} daoAddress={daoAddress} nodes={nodes} />
        <Grid fluid>
          <div style={{ background: 'white', borderBottom: '1px solid #ddd' }}>
            <Text size="xxlarge">Althea</Text>
            <Button mode="strong" style={{ float: 'right' }}>New Node</Button>
            <Nav setPage={page => this.setState({ page })} />
          </div>
          {this.state.page &&
           <Page
             app={app}
             nodes={nodes}
             appAddress={appAddress}
             daoAddress={daoAddress}
           />
          }
        </Grid>
      </AppContainer>
    );
  }
}

App.propTypes = {
  app: PropTypes.object,
  nodes: PropTypes.array,
  appAddress: PropTypes.string,
  daoAddress: PropTypes.string,
  t: PropTypes.func
};

export default translate()(observe(
  observable => observable.map(state => ({ ...state })),
  {}
)(App));
