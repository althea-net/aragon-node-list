# Subnet-controller

This repo contains the contracts and Aragon app used by Althea for managing SubnetDAOs.

For more information please read: [https://altheamesh.com/governance-paper](https://altheamesh.com/governance-paper)


## Usage

```
yarn install
npm run aragon
```

### Running tests

Use the global `truffle` and `ganache-cli` instead of the `aragon contracts` truffle wrapper. Like so:

```
ganache-cli
truffle test
```

### Scripts explanations

- **start**: Run the app locally
- **clean-start**: Removes parcel cache
- **compile**: Compile the smart contracts
- **build**: Compiles the contracts and builds the front-end

### Links

[http://aragon.aragonpm.com/#/sasquatch.aragonid.eth/](http://aragon.aragonpm.com/#/sasquatch.aragonid.eth/)

### Deploying with APM

#### Configuring `~/.aragon


### Successful commands

apm: `seabass.open.aragonapm.eth`

```
aragon apm publish `ADDRESS` --network sasquatch_ws --apm.ens-registry "0xfbae32d1cde62858bc45f51efc8cc4fa1415447e" --no-ipfs-check --apm.ipfs.rpc "http://ipfs.aragon.network:5001" --files build --only-content
```
