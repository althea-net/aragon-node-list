import React from "react"
import {
  AragonApp,
  Button,
  TextInput,
  Field,
} from "@aragon/ui"
import styled from "styled-components"
import { Row, Col } from 'react-flexbox-grid'

const Form = styled.form`
  margin-top: 10mm;
  margin-bottom: 10mm;
  padding-top: 10mm;
  padding-bottom: 10mm;
  display: inline-flex;
  align-items: center;
`

class NewNodeForm extends React.Component {

  state = {
      ethAddr: "0xb4124ceb3451635dacedd11767f004d8a28c6ee7",
      ipAddr: "0x04be12ec"
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
      <div>
        <Row around="xs">
          <Form onSubmit={this.handleSubmit}>
              <Col lg >
                <Field label="Ethereum address">
                  <TextInput
                    innerRef={ethAddr => (this.ethAddrInput = ethAddr)}
                    value={ethAddr}
                    onChange={this.handleEthAddrChange}
                    required
                    wide
                    style={{width: "450px"}}
                  />
                </Field>
              </Col>
              <Col xs >
                <Field label="IP address">
                  <TextInput
                    innerRef={ipAddr => (this.ipAddrInput = ipAddr)}
                    value={ipAddr}
                    onChange={this.handleIpAddrChange}
                    required
                    wide
                  />
                </Field>
              </Col>
              <Col xs>
                <Button mode="strong" type="submit" wide>Submit</Button>
              </Col>
          </Form>
        </Row>
      </div>
    )
  }
}

export default NewNodeForm
