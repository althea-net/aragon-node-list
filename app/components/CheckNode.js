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
  padding: 10mm;
  padding-bottom: 50mm;
  margin-top: 10mm;
  margin-bottom: 10mm;
  display: inline-flex;
  heigh: 100px;
`

export default class CheckNode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      existingNode: false,
      query: ''
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
    this.getMember().then(address => {
      console.log("BOOOOH", address)
      let node = address !== '0x0000000000000000000000000000000000000000'
      console.log("NOOODE", node)
      this.setState({
        existingNode: node
      })
    })
    event.preventDefault()
  }

  render() {
    return (
      <div>
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
          <Button mode='strong' type='submit'>Submit</Button>
        </Form>
        <NodeCard
          existingNode={this.state.existingNode}
        />
      </div>
    )
  }
}
