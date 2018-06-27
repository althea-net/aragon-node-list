import React from "react";
import { AragonApp, Text, observe, TextInput } from "@aragon/ui";
// import Aragon, { providers } from "@aragon/client";
import styled from "styled-components";

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

class FormData {
  constructor(validators, that) {
    this.validators = validators;
    this.that = that;
  }

  onFieldChange = e => {
    const { name, value } = e.target;

    this.that.setState({
      fields: {
        ...this.that.state.fields,
        [name]: value
      },

      valid: {
        ...this.that.state.valid,
        [name]: this.validators[name] && this.validators[name](value)
      }
    });
  };

  isFieldValid = name => {
    return this.that.state.fields && this.that.state.fields[name]
      ? this.that.state.valid && this.that.state.valid[name]
      : undefined;
  };
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

export default class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <div>fuck that</div>
        <NewNodeForm />
      </AppContainer>
    );
  }
}

const ObservedCount = observe(state$ => state$, { count: 0 })(({ count }) => (
  <Text.Block style={{ textAlign: "center" }} size="xxlarge">
    {count}
  </Text.Block>
));
