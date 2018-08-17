import React from 'react'
import {
  AragonApp,
  Button,
  TextInput,
  Field,
} from '@aragon/ui'
import styled from 'styled-components'

const Form = styled.form`
  margin-top: 10mm;
  margin-bottom: 10mm;
  padding-bottom: 10mm;
  padding-top: 10mm;
`

class DeleteNode extends React.Component {

  state = {
    ip: ''
  }

  handleIndexChange = event => {
    this.setState({ ip: event.target.ip })
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

export default DeleteNode
