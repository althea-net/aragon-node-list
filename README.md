# Subnet-controller

This repo contains the contracts and Aragon app used by Althea for managing SubnetDAOs.

For more information please read: [https://altheamesh.com/governance-paper](https://altheamesh.com/governance-paper)


## Usage

Global tools:

```
npm i -g truffle@beta //@5.0.0 because it is using web3 @1.0.28 which is awesome
npm i -g ganache-cli

// This package is using truffle@beta
npm i -g git+https://github.com/Sebohe/aragon-cli.git

// You will also now need a docker solc compiler
docker pull ethereum/solc:0.4.18
```

Repo install:

```
yarn install
```

### Running tests

Use the global `truffle` and `ganache-cli` instead of the `aragon contracts` truffle wrapper. Like so:

```
ganache-cli
truffle test
```

### npm Scripts

- **start**: Run the app locally
- **clean-start**: Removes parcel cache
- **compile**: Compile the smart contracts
- **build**: Compiles the contracts and builds the front-end

### Links

[http://aragon.aragonpm.com/#/sasquatch.aragonid.eth/](http://aragon.aragonpm.com/#/sasquatch.aragonid.eth/)

### Deploying with APM

Current NodeList address in Rinkeby: `0x44e3f46d37318d6b608756f48d7a9d86934be624`

`aragon apm publish [CONTRACT ADDRESS DEPLOYED ON RINKEBY] --network rinkeby --apm.ens-registry "0xfbae32d1cde62858bc45f51efc8cc4fa1415447e" --no-ipfs-check --apm.ipfs.rpc "http://ipfs.aragon.network:5001" --files build --only-content` 


Steps:

    npm run clean
    npm run build
    aragon contracts deploy
    ADDRESS=$(cat build/contracts/NodeList.json| jq .networks | grep address | cut -d: -f2 | tr -d \" | tr -d \\n)
    aragon apm publish $ADDRESS
    DAO=$(aragon dao new | grep Created | cut -d' ' -f5)
    aragon dao install $DAO <pacakge name>.aragonpm.eth


#### deploy scrip:
`OWNER=0xb4124ceb3451635dacedd11767f004d8a28c6ee7 npm run deploy:devnet`

### Successful commands

apm: `seabass.open.aragonapm.eth`

`nogara` is just a custom `aragon` I have built. [github.com/Sebohe/aragon-cli](github.com/Sebohe/aragon-cli)

```
nogara apm publish `ADDRESS` --network sasquatch_ws --apm.ens-registry "0xfbae32d1cde62858bc45f51efc8cc4fa1415447e" --no-ipfs-check --apm.ipfs.rpc "http://ipfs.aragon.network:5001" --files build --only-content
```


python3 -m evmlab reproducer --web3 http://localhost:8535 --hash `txn`
alias txn='seth block latest | grep "transactions\ " | cut -d\[ -f2  | tr -d \"\]'

make sure the sources for `kits-beta` and `kits-bare` are not links

`cd contracts && solc @aragon=/home/sebas/githubs/althea/aragon-node-list/node_modules/@aragon  --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,compact-format,devdoc,hashes,interface,metadata,opcodes,srcmap,srcmap-runtime,userdoc  -o ../build AltheaDAOFactory.sol`
