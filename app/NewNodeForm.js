import React from "react"
import { AragonApp, Button, observe, TextInput } from "@aragon/ui"
import Aragon, { providers } from '@aragon/client'
import styled from "styled-components"

const app = new AragonApp()

const FormContainer = styled(AragonApp)`
  padding: 5% 10px;
`

const NewNodeContainer = styled(AragonApp)`
  display: inline-flex;
  padding: 2%;
  margin-top: 10px;
`

const BasicForm = (props) => {
  return(
      <TextInput
        name={props.name}
        onSubmit={props.onSubmit}
        placeholder={props.placeholder}
        type="text"
        required
        wide
      />
  )
}

const SubmitButton = (props) => {
  return(
    <button
      onClick={props.onClick}
    >
      Submit
    </button>
  )
}

class NewNodeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        ethAddr: "",
        ipAddr: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
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
              onClick={this.handleSubmit}
            />
          </FormContainer>
        </NewNodeContainer>
      </div>
    );
  }
}

export default NewNodeForm
