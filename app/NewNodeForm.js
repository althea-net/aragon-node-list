import React from "react";
import { AragonApp, Button, observe, TextInput } from "@aragon/ui";
import styled from "styled-components";

const FormContainer = styled(AragonApp)`
  padding: 5% 10px;
`

const NewNodeContainer = styled(AragonApp)`
  display: inline-flex;
  padding-top: 2%;
  margin-top: 10px;
`

const BasicForm = (props) => {
  return(
    <form onSubmit={props.onSubmit}>
      <TextInput
        name={props.name}
        placeholder={props.placeholder}
        required
        wide
      />
    </form>
  )
}

const SubmitButton = (props) => {
  return(
    <Button>
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

  handleSubmit() {
    alert("SUBMITTEDD")
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
            <SubmitButton />
          </FormContainer>
        </NewNodeContainer>
      </div>
    );
  }
}

export default NewNodeForm
