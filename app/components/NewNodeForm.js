import React from "react"
import { AragonApp, Button, TextInput } from "@aragon/ui"
import Aragon, { providers } from '@aragon/client'
import styled from "styled-components"

const FormContainer = styled(AragonApp)`
  padding: 5% 10px;
`

const NewNodeContainer = styled(AragonApp)`
  display: inline-flex;
  padding: 2%;
  margin-top: 10px;
  align-items: center;
`

const BasicForm = (props) => {
  return(
      <TextInput
        name={props.name}
        placeholder={props.placeholder}
        type="text"
        required
        wide
      />
  )
}

const SubmitButton = (props) => {
  return(
    <Button
      onClick={props.onClick}
    >
      Submit
    </Button>
  )
}

class NewNodeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ethAddr: "",
      ipAddr: ""
    }
  }

  handleSubmit(ethAddr, ipAddr) {
  }

  renderForm(type, nameInput, value, handleSubmit) {
    return (
      <BasicForm
        name={nameInput}
        value={value}
        onSubmit={handleSubmit()}
        placeholder ={type}
      />
    )
  }

  render() {
    return (
      <div>
        <NewNodeContainer>
          <FormContainer>
            {
              this.renderForm(
                "ETH",
                "ethereum",
                this.state.ethAddr,
                this.handleSubmit
              )
            }
          </FormContainer>
          <FormContainer>
            {
              this.renderForm(
                "IP",
                "ip",
                this.state.ipAddr,
                this.handleSubmit
              )
            }
          </FormContainer>
          <FormContainer>
            <SubmitButton 
              onClick={() => this.props.addMember()}
            />
          </FormContainer>
        </NewNodeContainer>
      </div>
    )
  }
}

export default NewNodeForm
