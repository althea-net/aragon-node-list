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
class DeleteNode extends React.Component {

  state = {
    index: 0
  }

  handleIndexChange = event => {
    this.setState({ index: event.target.index })
  }

  handleSubmit = event => {
    console.log("TYPER", typeof this.state.index)
    console.log("Value", this.state.index)
    //Integer.parseInt(myString);
    this.props.app.deleteMember(this.state.index)
    event.preventDefault()
  }

  render() {
    const index = this.state.index
    return (
      <div>
        <Row around="xs">
          <Form onSubmit={this.handleSubmit}>
              <Col xs >
                <Field label="Index">
                  <TextInput
                    innerRef={index => (this.indexInput= index)}
                    value={this.state.index}
                    onChange={this.handleIndexChange}
                    required
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

export default DeleteNode
