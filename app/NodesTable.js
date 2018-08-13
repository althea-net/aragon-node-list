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
  align-items: center;
  justify-content: center;
`

const testValues = [
  [
    "0xf0c5c43e3efc5e0e55529e748ec65bbd590511b4",
    "0xf0c51b8d7868e1bdaa9133d09eda0b0dd6323e1a"
  ],
  ["0x00000001", "0x00000002"]
]

const transposeArray = array => {
  return array[0].map((col, i) => {
    return array.map(row => row[i])
  })
}

class NodesTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  singleRow(index, ether, ip) {
    return (
      <div>
        <TableRow>
          <TableCell>
            <Text>{index}</Text>
          </TableCell>
          <TableCell>
            <Text>{ether}</Text>
          </TableCell>
          <TableCell>
            <Text>{ip}</Text>
          </TableCell>
        </TableRow>
      </div>
    )
  }

  renderRows(nodesArray) {
    let rows = []
    for (var index in nodesArray) {
      rows.push(this.singleRow(
        index, 
        nodesArray[index][0],
        nodesArray[index][1]
      ))
    }
    return rows
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
        {this.renderRows(transposeArray(testValues))}
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
