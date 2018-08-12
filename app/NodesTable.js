import React from "react"
import {
  AragonApp,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Text
} from "@aragon/ui"
import styled from "styled-components"

const TableContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5% 10px;
`

const testValues = [
  [
    "0xf0c5c43e3efc5e0e55529e748ec65bbd590511b4",
    "0xf0c51b8d7868e1bdaa9133d09eda0b0dd6323e1a"
  ],
  ["0x00000001", "0x00000002"]
]


class NodesTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  renderRows() {
    const rows = testValues
    return (
      <div>
        <TableRow>
          <TableCell>
            <Text>HI!</Text>
          </TableCell>
          <TableCell>
            <Text>Bye!</Text>
          </TableCell>
        </TableRow>
      </div>
    )
  }

  renderTable() {
    return (
      <div>
        <Table
          header={
            <TableRow>
              <TableHeader title="Existing Nodes" />
            </TableRow>
          }
        />
        {this.renderRows()}
      </div>
    )
  }

  render() {
    return (
        <TableContainer>
           {this.renderTable()}
        </TableContainer
      >
    )
  }
}

export default NodesTable
