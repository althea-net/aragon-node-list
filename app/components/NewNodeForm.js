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
  flex-direction: column; 
  width: 400px;
`

const TextInputContainer = styled(TextInput)`
  width: 450px;
`
const ButtonContainer = styled(Button)`
  margin-top: 10mm;
  margin-bottom: 10mm;
  flex-direction: column; 
  width: 150px;
`

class NewNodeForm extends React.Component {

  state = {
      ethAddr: '0xb4124ceb3451635dacedd11767f004d8a28c6ee7',
      ipAddr: '0xc0a8010ac0a8010a'
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
          <TextInputContainer
            innerRef={ethAddr => (this.ethAddrInput = ethAddr)}
            value={ethAddr}
            onChange={this.handleEthAddrChange}
            required
            wide
          />
        </Field>
        <Field label='IP address'>
          <TextInputContainer
            innerRef={ipAddr => (this.ipAddrInput = ipAddr)}
            value={ipAddr}
            onChange={this.handleIpAddrChange}
            required
            wide
          />
        </Field>
          <ButtonContainer mode='strong' type='submit'>
            Submit
          </ButtonContainer>
      </Form>
    )
  }
}

export default NewNodeForm
