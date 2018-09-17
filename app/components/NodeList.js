import React from 'react'
import { Button, Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'
import { translate } from 'react-i18next'

export default translate()(({ app, subscribers, t }) => {
  let fundsColor = funds => (funds > 0) ? "green" : "red"
  if (!subscribers) return null

  return (
    <Table
      header={
        <TableRow>
          <TableHeader title={t("nickname")} />
          <TableHeader title={t("fundsRemaining")} />
          <TableHeader title={t("ethAddress")} />
          <TableHeader title={t("ipAddress")} />
          <TableHeader title={t("removeNode")} />
        </TableRow>
      }
    >
      {subscribers.map((d, i) => {
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
              <Button emphasis="negative">{t("remove")}</Button>
            </TableCell>
          </TableRow>
        )}
      )}
    </Table>
  );
}) 
