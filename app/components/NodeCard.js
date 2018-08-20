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
      text: '',
      visibility: this.props.visibility
    }
  }

  handleDebug() {
    this.setState({
      visibility: this.state.visibility === 'hidden'
        ? 'visible'
        : 'hidden'
    })
  }

  render() {
    let zero = '0x0000000000000000000000000000000000000000'
    let bg
    let text = 'This node'
    console.log("EEETHER", this.props.ethAddr)
    if (this.props.ethAddr !== zero && this.props.ethAddr !== '') {
      text = text + ' is on list'
      bg = theme.positive
    } 
    else  {
      text = text + ' is not on list'
      bg = theme.negative
    }
    return(
      <div>
        <CardContainer
          visibility={this.state.visibility}
          background={bg}
        >
          <Text>{text}</Text>
        </CardContainer>
        <Button
          mode='strong'
          onClick={() => this.handleDebug()}
          type='submit'
        >
          Debug
        </Button>
      </div>
    )
  }
}
