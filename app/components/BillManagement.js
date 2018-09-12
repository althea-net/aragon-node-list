import React from 'react'
import { Card, TextInput, Field, Button, Text } from '@aragon/ui'
import { Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  width: 100%;
  height: auto;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
`

export default () => {
  return (
    <Row>
      <Col xs="6">
        <StyledCard>
          <Text size="xlarge">Add funds</Text>
          <Field label="Amount to add">
            <TextInput wide
              type="text"
              name="nickname"
              placeholder="Enter amount to add"
            />
          </Field>
          <Button mode="strong">Add funds</Button>
        </StyledCard>
      </Col>
      <Col xs="6">
        <StyledCard>
          <Text.Block size="xlarge">Withdraw all funds</Text.Block>
          <Button mode="strong">Withdraw</Button>
        </StyledCard>
      </Col>
    </Row>
  );
}
