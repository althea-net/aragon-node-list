import React from 'react'
import { Button, Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'
import data from '../MockData'

export default () => {
  let fundsColor = funds => (funds > 0) ? "green" : "red"

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
        let trunc = (s, n) => `${s.substr(0,n)}...${s.substr(-n)}`
        address = trunc(address, 6)
        ip = trunc(ip, 4)

        return (
          <TableRow key={i}>
            <TableCell>
              <Text>{nickname}</Text>
            </TableCell>
            <TableCell>
              <Text color={fundsColor(funds)}>{funds}</Text>
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
