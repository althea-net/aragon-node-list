import React from 'react'
import { Button, Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'
import { translate } from 'react-i18next'
import styled from 'styled-components'

const Abbr = styled.abbr`
  cursor: pointer;
  text-decoration: none;
`

export default translate()(({ app, nodes, t }) => {
  let fundsColor = funds => (funds > 0) ? "green" : "red"
  if (!nodes) return null

  return (
    <div>
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
        {nodes.map((d, i) => {
          let {nickname, funds, ethAddress, ipAddress} = d;
          let trunc = (s, n) => `${s.substr(0,n)}...${s.substr(-n)}`
          nickname = web3.toUtf8(nickname)

          return (
            <TableRow key={i}>
              <TableCell>
                <Text>{nickname}</Text>
              </TableCell>
              <TableCell>
                <Text color={fundsColor(funds)}>{funds}</Text>
              </TableCell>
              <TableCell>
                <Text><Abbr title={ethAddress}>{trunc(ethAddress, 6)}</Abbr></Text>
              </TableCell>
              <TableCell>
                <Text><Abbr title={ipAddress}>{trunc(ipAddress, 4)}</Abbr></Text>
              </TableCell>
              <TableCell>
                <Button emphasis="negative">{t("remove")}</Button>
              </TableCell>
            </TableRow>
          )}
        )}
      </Table>
    </div>
  );
}) 
