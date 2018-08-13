import React from "react"
import {
  AragonApp,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Text
} from "@aragon/ui"
import Aragon, { providers } from "@aragon/client"
import styled from "styled-components"

const TableContainer = styled(AragonApp)`
  align-items: center;
  justify-content: center;
`

const transposeArray = array => {
  return array[0].map((col, i) => {
    return array.map(row => row[i])
  })
}

class NodesTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ethArray: [],
      ipArray: []
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
        {
          this.renderRows([
            () => this.props.getEthAddr(),
            () => this.props.getIpAddr()
          ])
        }
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
