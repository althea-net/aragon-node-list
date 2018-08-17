import React from 'react'
import {
  AragonApp,
  Button,
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

class CheckNode extends React.Component {

  state = {
    existingNode: false,
    query: ''
  }

  handleQueryChange = event => {
    this.setState({ query: event.target.query })
  }

  renderCard() {
    let style = { backgroundColor: theme.gradientStart }
    if (this.state.existingNode) {
      style = { backgroundColor: theme.badgeAppForeground }
    }
    else if(!this.state.existingNode && this.state.query !== '') {
      style = { backgroundColor: theme.negative }
    }
    return(
      <Card style={style} />
    )
  }
  handleSubmit = () => {
    let address = this.props.app.nodeList(this.state.query)
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
