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
  visibility: ${props => props.visibility};
  background-color: ${props => props.background};
`

class CheckNode extends React.Component {

  state = {
    existingNode: false,
    query: '',
    visibility: 'hidden'
  }

  handleQueryChange = event => {
    this.setState({ query: event.target.value })
    console.log("SSSATE", this.state)
  }

  renderCard() {
    let bg = theme.gradientStart
    if (this.state.existingNode) {
      bg = theme.badgeAppForeground
    } else if(!this.state.existingNode) {
      bg = theme.negative
    }

    return(
      <CardContainer 
        visibility={this.state.visibility}
        background={bg}
      >
        <Text>This node exists</Text>
      </CardContainer>
    )
  }

  handleSubmit = event => {
    let address = this.props.app.getNodeList(this.state.query)
    console.log("MEXICO", Object.keys(this.props.app))
    if (address !== '0x0000000000000000000000000000000000000000') {
      this.setState({ existingNode: true })
    } else {
      this.setState({ existingNode: false })
    }
    event.preventDefault()
  }

  render() {
    return (
      <div>
        <Form onSubmit={() => this.handleSubmit()}>
          <Field label='Query for an existing node'>
            <TextInput
              innerRef={query => (this.queryInput = query)}
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
