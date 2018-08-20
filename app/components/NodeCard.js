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
      bg: theme.gradientStart,
      visibility: 'hidden',
      text: 'This node'
    }
  }

  handleDebugToggle() {
    this.setState({
      visibility: this.state.visibility === 'hidden' ? 'visible' : 'hidden'
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.existingNode !== prevProps.existingNode) {
      this.setState({
        visibility: this.visibility,
        bg: this.props.existingNode 
          ? theme.positive
          : theme.negative,
        text: this.props.existingNode
          ? text + ' is on list'
          : text + ' is not on list'
      })
    }
  }

  render() {
    return(
      <div>
        <CardContainer
          visibility={this.state.visibility}
          background={this.state.bg}
        >
          <Text>{this.state.text}</Text>
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
