#!/bin/bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x72d9e579f691d62aa7e0703840db6dd2fa9fae21", "latest"],"id":1}' https://eth.althea.org
