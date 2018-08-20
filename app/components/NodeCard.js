import React from 'react'
import {
  Button,
  Text,
  Card,
  theme,
} from '@aragon/ui'
import styled from 'styled-components'

const CardContainer = styled(Card)`
  visibility: ${props => props.visibility};
  background-color: ${props => props.background};
  height: 50px;
  width: 500px;
`

export default class CardComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bg: theme.gradientStart
    }
  }

  handleDebugToggle() {
    this.setState({
      visibility: this.state.visibility === 'hidden' ? 'visible' : 'hidden'
    })
  }

  render() {
    let text = 'This node'
    if (this.props.existingNode) {
      this.state.bg = theme.badgeAppForeground
      text.concat('', ' is in list')
    } else {
      this.state.bg = theme.negative
      text.concat('', ' is not in list')
    }
    return(
      <div>
        <CardContainer
          visibility={this.props.visibility}
          background={this.state.bg}
        >
          <Text>{text}</Text>
        </CardContainer>
        <Button 
          mode='strong'
          onClick={() => this.handleDebugToggle()}
          type='submit'
        >
          Debug
        </Button>
      </div>
    )
  }
}
