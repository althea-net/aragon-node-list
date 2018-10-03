# Subnet-controller

This repo contains two pieces of software that work together. The contracts and Aragon app used by Althea for managing SubnetDAOs and an Aragon DAO Factory.

For more information please read: [https://altheamesh.com/governance-paper](https://altheamesh.com/governance-paper)


## Usage

Global tools:

```
npm i -g truffle@beta //@5.0.0 because it is using web3 @1.0.28 which is awesome
npm i -g ganache-cli

// You will also now need a docker solc compiler
docker pull ethereum/solc:0.4.24
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

- **start**: Run the Aragon app locally
- **start:aragon:ipfs**: Run Aragon Althea app locally with
- **start:aragon:http**: Starts aragon app locally but serves app from local rather than ipfs
- **start:app**: 
- **test**: Runs truffle test
- **compile**: 
- **devnet**:
- **sync-assets**:
- **build:app**:
- **build:script**:
- **build**:
- **publish**:
- **deploy:rpc**:
- **deploy:devnet:apm**:
- **get-addresses**:
- **deploy:rinkeby**:
- **deploy:devnet**:
- **publish:devnet**:
- **publish:rpc**:
- **publish:rinkeby**:
- **start**: 
- **start:aragon:ipfs**:

### Links

[http://aragon.aragonpm.com/#/sasquatch.aragonid.eth/](http://aragon.aragonpm.com/#/sasquatch.aragonid.eth/)


## Deploying contracts

AragonOS has a nice `trufle-config.js` that moves the configuration file of mnemonics to `~/.aragon`. Each file is a different configuration for each network. There are currently two types:

- One is `~/.aragon/mnemonic.json` that contains the mnemoic and is a json file with a single key, `mnemonic`
- Two is a `~/.aragon/devnet_key.json` with two keys, `rpc`, and `keys`. In which `keys` valye is an array of ethereum private keys. The first part of the file name before the underscore must match the networks of `truffle-config.js`. If no `keys` key exists in the network json file, then truffle will default to the mnemonic in `~/.aragon/mnemonic.json`

This project imports the networks of `@aragon/os/truffle-config.js`.

#### Deploying AragonOS

AragonOS has multiple contracts. For now there are a few contracts that are important for the **Althea DAO Factory**. They can be seen in `scripts/assets.js`. Before deploying these contracts


## Deploying Althea Aragon APP
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

### Successful commands

apm: `seabass.open.aragonapm.eth`

`nogara` is just a custom `aragon` I have built. [github.com/Sebohe/aragon-cli](github.com/Sebohe/aragon-cli)

```
nogara apm publish `ADDRESS` --network sasquatch_ws --apm.ens-registry "0xfbae32d1cde62858bc45f51efc8cc4fa1415447e" --no-ipfs-check --apm.ipfs.rpc "http://ipfs.aragon.network:5001" --files build --only-content
```
