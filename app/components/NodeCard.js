import React from 'react'
import {
  Button,
  Text,
  Card,
  theme,
} from '@aragon/ui'
import styled from 'styled-components'

const Form = styled.form`
  padding: 10mm;
  padding-bottom: 50mm;
  margin-top: 10mm;
  margin-bottom: 10mm;
  display: inline-flex;
  heigh: 100px;
`

const CardContainer = styled(Card)`
  display: flex;
  visibility: ${props => props.visibility};
  background-color: ${props => props.background};
`

export default class CardComponent extends React.Component {

  state = {
    visibility: 'hidden',
  }

  handleDebugToggle() {
    console.log("BEEEEEESS", this.state)
    this.setState({
      visibility: this.state.visibility === 'hidden' ? 'visible' : 'hidden'
    })
  }

  render() {
    let bg = theme.gradientStart
    let text = 'This node'
    if (this.props.existingNode) {
      bg = theme.badgeAppForeground
      text.concat(' is in list')
    } else {
      bg = theme.negative
      text.concat(' is not in list')
    }
    return(
      <div>
        <CardContainer
          visibility={this.props.visibility}
          background={this.props.bg}
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
