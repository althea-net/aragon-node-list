import React from 'react'
import {
  AragonApp,
  Button,
  TextInput,
  Field,
} from '@aragon/ui'
import styled from 'styled-components'

const Form = styled.form`
  margin-top: 5mm;
  margin-bottom: 5mm;
  padding-bottom: 5mm;
  padding-top: 5mm;
`

export default class DeleteNode extends React.Component {

  state = {
    ip: ''
  }

  handleIndexChange = event => {
    this.setState({ ip: event.target.value })
  }

  handleSubmit = event => {
    this.props.app.deleteMember(this.state.ip)
    event.preventDefault()
  }

  render() {
    const ip = this.state.ip
    return (
      <Form onSubmit={this.handleSubmit}>
        <Field label='Delete Node IP Address'>
          <TextInput
            innerRef={ip => (this.ipInput= ip)}
            value={this.state.ip}
            onChange={this.handleIndexChange}
            required
          />
        </Field>
        <Button mode='strong' type='submit'>Submit</Button>
      </Form>
    )
  }
}
