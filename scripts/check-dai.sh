#!/bin/bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x6b483dfe56a54b21054e0c5930001a1fb28f33aa", "latest"],"id":1}' https://dai.althea.org
