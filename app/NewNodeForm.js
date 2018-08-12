import React from "react";
import { AragonApp, Text, observe, TextInput } from "@aragon/ui";
// import Aragon, { providers } from "@aragon/client";
import styled from "styled-components";

import FormData from "./FormData.js"

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

  render() {
    console.log("shit");
    return (
      <form onSubmit={this.onSubmit}>
        fuck
        <TextInput
          name="eth_addr"
          style={
            this.formData.isFieldValid("eth_addr") === false
              ? { background: "red" }
              : {}
          }
          onChange={this.formData.onFieldChange}
          value={this.state.fields.eth_addr || ""}
          placeholder="Node Ethereum address"
          required
          wide
        />
      </form>
    );
  }
}

export default NewNodeForm
