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
    value: 0
  }

  handleIndexChange = event => {
    this.setState({ value: event.target.value })
  }

  handleSubmit = event => {
    this.props.app.deleteMember(this.state.value)
  }

  render() {
    value = this.value
    return (
      <div>
        <Row around="xs">
          <Form onSubmit={this.handleSubmit}>
              <Col xs >
                <Field label="Index">
                  <TextInput
                    innerRef={value => (this.valueInput= value)}
                    value={value}
                    onChange={this.handleIndexChange}
                    required
                    type="number"
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
