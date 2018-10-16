#!/usr/bin/env bash

rpc='http://localhost:8535'
lastTxn=$(seth block latest | grep "transactions\ " | cut -d\[ -f2  | tr -d \"\])
traceFile=$(
  python -m evmlab reproducer -x $lastTxn --web3 $rpc |
  grep web3 |
  cut -d' ' -f4
  )
echo $traceFile

python3 -m evmlab opviewer -f $traceFile --web3 $rpc -s contracts -j ./build/combined.json --hash $lastTxn


