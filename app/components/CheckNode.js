import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  TextInput,
  Field,
  Card,
  theme,
} from '@aragon/ui'
import styled from 'styled-components'

const Form = styled.form`
  padding: 10mm;
  padding-bottom: 50mm;
  margin-top: 10mm;
  margin-bottom: 10mm;
  display: inline-flex;
`

const CardContainer = styled(Card)`
  display: flex;
  visibility: ${props => props.visibility}
`

class CheckNode extends React.Component {

  state = {
    existingNode: false,
    query: '',
    visibility: 'hidden'
  }

  handleQueryChange = event => {
    this.setState({ query: event.target.query })
  }

  renderCard() {

    let bg = theme.gradientStart
    if (this.state.existingNode) {
      bg = theme.badgeAppForeground
    } else if(!this.state.existingNode) {
      bg = theme.negative
    }

    let style={
      height: "100px",
      width: "450px",
      top: "10px",
      backgroundColor: bg
    }

    return(
      <CardContainer 
        style={style}
        visibility={this.state.visibility}
      >
        <Text>This node exists</Text>
      </CardContainer>
    )
  }

  handleSubmit = event => {
    console.log("CANADA", this.state)
    let address = this.props.app.nodeList(this.state.query)
    console.log("MEXICO", address)
    if (address !== '0x0000000000000000000000000000000000000000') {
      this.setState({ existingNode: true })
    } else {
      this.setState({ existingNode: false })
    }
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Field label='Query for an existing node'>
            <TextInput
              innerRef={query => (this.queryInput = query )}
              value={this.state.query}
              onChange={this.handleQueryChange}
              required
              wide
            />
          </Field>
          <Button mode='strong' type='submit'>Submit</Button>
        </Form>
        {this.renderCard()}
      </div>
    )
  }
}

export default CheckNode
