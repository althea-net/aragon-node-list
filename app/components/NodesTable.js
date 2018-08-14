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
  margin-top: 10px;
  padding-top: 20px;
`

class NodesTable extends React.Component {

  singleRow(index, ether, ip) {
    return (
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
    )
  }

  render() {
    var nodes = []
    var rows = []
    rows.push(this.singleRow(0, "0x22", "0x1"))
    for (var index in this.props.nodes) {
      var n = this.props.nodes[index]
      console.log("NOOOODEE", n)
      rows.push(this.singleRow(index + 1, n[0], n[1]))
    }
    console.log("PROPERTY", this.props)
    console.log("Roooows", rows)
    return (
      <TableContainer>
        <Table
          header={
            <TableRow>
              <TableHeader title="Index" />
              <TableHeader title="Eth Address" />
              <TableHeader title="IP Address" />
            </TableRow>
          }
        >
          {rows}
        </Table>
      </TableContainer>
    )
  }
}

export default NodesTable
