import React from 'react'
import { Button, Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'
import data from '../MockData'

export default () => {
  return (
    <Table
      header={
        <TableRow>
          <TableHeader title="Nickname" />
          <TableHeader title="Funds Remaining" />
          <TableHeader title="Ethereum Address" />
          <TableHeader title="IP Address" />
          <TableHeader title="Remove Node" />
        </TableRow>
      }
    >
      {data.map((d, i) => {
        let {nickname, funds, address, ip} = d;
        return (
          <TableRow key={i}>
            <TableCell>
              <Text>{nickname}</Text>
            </TableCell>
            <TableCell>
              <Text>{funds}</Text>
            </TableCell>
            <TableCell>
              <Text>{address}</Text>
            </TableCell>
            <TableCell>
              <Text>{ip}</Text>
            </TableCell>
            <TableCell>
              <Button emphasis="negative">Remove</Button>
            </TableCell>
          </TableRow>
        )})}
    </Table>
  );
} 
