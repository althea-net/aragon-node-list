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
        <StyledCard width="100%" height="auto">
          <Text size="xlarge">Add node</Text>
          <Field label="Node nickname">
            <TextInput wide
              type="text"
              name="nickname"
              placeholder="Who owns this node?"
            />
          </Field>
          <Button mode="strong">Scan node QR code</Button>
          <Field label="Ethereum address">
            <TextInput wide
              type="text"
              name="address"
              placeholder="Enter node's Ethereum address"
            />
          </Field>
          <Field label="IP address">
            <TextInput wide
              type="text"
              name="ip"
              placeholder="Enter node's IP address"
            />
          </Field>
          <Field>
            <Button mode="strong">Add node</Button>
          </Field>
        </StyledCard>
        <StyledCard width="100%" height="auto">
          <Text size="xlarge">Collect bills</Text>
          <p>You have $123.34 in bills to collect right now</p>
          <Button mode="strong">Collect bills</Button>
        </StyledCard>
      </Col>
      <Col xs="6">
        <StyledCard width="100%" height="auto">
          <Text size="xlarge">Check node</Text>
          <Field label="Ethereum address">
            <TextInput wide
              type="text"
              name="address"
              placeholder="Enter node's Ethereum address"
            />
          </Field>
          <Button mode="strong">Check if node is in subnet DAO</Button>
        </StyledCard>
        <StyledCard width="100%" height="auto">
          <Text size="xlarge">Remove node</Text>
          <Field label="Ethereum address">
            <TextInput wide
              type="text"
              name="address"
              placeholder="Enter node's Ethereum address"
            />
          </Field>
          <Button mode="strong">Remove node from subnet DAO</Button>
        </StyledCard>
      </Col>
    </Row>
  );
}
