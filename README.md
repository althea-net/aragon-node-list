# Subnet-controller

This repo contains the contracts and Aragon app used by Althea for managing SubnetDAOs.

For more information please read: [https://altheamesh.com/governance-paper](https://altheamesh.com/governance-paper)


## Usage

Global tools:

```
npm i -g truffle@beta //@5.0.0 because it is using web3 @1.0.28 which is awesome
npm i -g ganache-cli
npm i -g @aragon/cli

```

If you need to run truffle compatible with aragon-cli use: `aragon contracts <what ever truffle command>`

Repo deps:

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


### Deploying with APM

Current NodeList address in Rinkeby: `0x44e3f46d37318d6b608756f48d7a9d86934be624`

`aragon apm publish [CONTRACT ADDRESS DEPLOYED ON RINKEBY] --network rinkeby --apm.ens-registry "0xfbae32d1cde62858bc45f51efc8cc4fa1415447e" --no-ipfs-check --apm.ipfs.rpc "http://ipfs.aragon.network:5001" --files build --only-content` 
