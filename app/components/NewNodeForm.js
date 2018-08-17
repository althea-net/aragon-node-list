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
  display: flex;
  flex-direction: column; 
  width: 350px;
`
const ButtonContainer = styled(Button)`
  margin-top: 10mm;
  margin-bottom: 10mm;
  display: flex;
  flex-direction: column; 
  width: 150px;
`
class NewNodeForm extends React.Component {

  state = {
      ethAddr: '',
      ipAddr: ''
    }

  handleEthAddrChange = event => {
    this.setState({ ethAddr: event.target.value })
  }

  handleIpAddrChange = event => {
    this.setState ({ ipAddr: event.target.value })
  }

  handleSubmit = event => {
    this.props.app.addMember(this.state.ethAddr, this.state.ipAddr)
    event.preventDefault()
  }

  render() {
    const { ethAddr, ipAddr } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <Field label='Ethereum address'>
          <TextInput
            innerRef={ethAddr => (this.ethAddrInput = ethAddr)}
            value={ethAddr}
            onChange={this.handleEthAddrChange}
            required
            wide
          />
        </Field>
        <Field label='IP address'>
          <TextInput
            innerRef={ipAddr => (this.ipAddrInput = ipAddr)}
            value={ipAddr}
            onChange={this.handleIpAddrChange}
            required
            wide
          />
        </Field>
        <ButtonContainer>
          <Button mode='strong' type='submit'>Submit</Button>
        </ButtonContainer>
      </Form>
    )
  }
}

export default NewNodeForm
