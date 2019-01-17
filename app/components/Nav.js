import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@aragon/ui';
import styled from 'styled-components';
import { translate } from 'react-i18next';

import NodeList from './NodeList';
import Settings from './Settings';

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-bottom: ${props => props.active ? '5px solid #37CFCB' : 'none'}
`;

const pages = {
  nodeList: NodeList,
  settings: Settings
};

class Nav extends React.Component {
  state = {
    page: 'nodeList'
  }

  componentDidMount () {
    this.props.setPage(NodeList);
  }

  setPage = p => {
    this.setState({ page: p });
    this.props.setPage(pages[p]);
  }

  render () {
    const { page } = this.state;

    return (
      <div>
        {Object.keys(pages).map(p => {
          return (
            <NavButton key={p} onClick={() => { this.setPage(p); }} active={page === p}>
              {this.props.t(p)}
            </NavButton>
          );
        })}
      </div>
    );
  }
}

Nav.propTypes = {
  i18n: PropTypes.object,
  setPage: PropTypes.func,
  mode: PropTypes.string,
  t: PropTypes.func
};

export default translate()(Nav);
