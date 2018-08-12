import React from "react";
import { AragonApp, Text, observe, TextInput } from "@aragon/ui";
import styled from "styled-components";

import FormData from "./FormData.js"

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
        placeholder={props.addressType}
        required
        wide
      />
    </form>
  )
}

class NewNodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        eth_addr: "ope"
      }
    };
    this.formData = new FormData(
      {
        eth_addr: value => {
          return value.length > 8;
        }
      },
      this
    );
  }

  handleSubmit() {
    alert("SUBMITTED")
  }

  renderForms(type, nameInput) {
    return (
      <BasicForm
        name="NAME"
        value="hi"
        onSubmit={() => this.handleSubmit()}
        addressType="TYPE"
      />
    )
  }

  render() {
    return (
      <div>
        <NewNodeContainer>
          <FormContainer>
            {this.renderForms("ETH", "ethereum")}
          </FormContainer>
          <FormContainer>
            {this.renderForms("IP", "ip")}
          </FormContainer>
        </NewNodeContainer>
      </div>
    );
  }
}

export default NewNodeForm
