import React from 'react'
import {
  Button,
  Text,
  Field,
  TextInput,
} from '@aragon/ui'
import styled from 'styled-components'

import NodeCard from './NodeCard'

const Form = styled.form`
  display: inline-flex;
  align-items: center;
`
const ButtonContainer = styled(Button)`
  height: 50px;
`
const CheckNodeContainer = styled.section`
  justify-content: center;
  align-items: center;
  heigth: 50%;
  width: 75%;
`
export default class CheckNode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      existingNode: false,
      displayCard: false,
      query: '',
      ethAddr: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getMember = this.getMember.bind(this)
  }

  handleQueryChange = event => {
    this.setState({ query: event.target.value })
  }

  getMember = async () => {
    return await new Promise(resolve => {
      this.props.app.call('nodeList', this.state.query)
      .subscribe(resolve)
    }).then(a => {return a})
  }

  handleSubmit = event => {
    var zero = '0x0000000000000000000000000000000000000000'
    this.getMember().then(address => {
      console.log("SPAAACE", address)
      this.setState({
        existingNode: address !== zero,
        ethAddr: address,
        displayCard: true
      })
    })
    event.preventDefault()
  }

  render() {
    console.log("EXISTING NODE", this.state.existingNode)
    console.log("DISPLAAAAAAAY", this.state.displayCard)
    return (
      <CheckNodeContainer>
        <Form onSubmit={this.handleSubmit} >
          <Field label='Query for an existing node'>
            <TextInput
              innerRef={query => (this.queryInput = query)}
              value={this.state.query}
              onChange={this.handleQueryChange}
              required
              wide
            />
          </Field>
          <ButtonContainer mode='strong' type='submit'>
            Submit
          </ButtonContainer>
        </Form>
        <NodeCard
          visibility={this.state.displayCard ? 'visible' : 'hidden'}
          ip={this.state.query}
          ethAddr={this.state.ethAddr}
        />
      </CheckNodeContainer>
    )
  }
}
