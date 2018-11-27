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

#### Contract deploy

Gas costs on rinkeby:

Deploying dao:

 * [1723324](https://rinkeby.etherscan.io/tx/0x52c67744471aa648afd67705f54c3d79e5a59c8f1ce37b852d3d213e8333c001)

Deploying multisig and token:

 * [4813913](https://rinkeby.etherscan.io/tx/0xad3b43a2161263d72027a4181af2616fe78c29f33d1b0a442f9813f64eb1ad98)

##### Rinkeby
* Publish

This is a minor package update to just push new ipfs content

```
$ aragon apm publish minor --environment infura --apm.ipfs.rpc http://sasquatch.network:5001
 ❯ Check IPFS
   ⠧ Start IPFS
     Add local files
   Applying version bump (minor)
 ✔ Check IPFS
 ✔ Applying version bump (minor)
 ✔ Determine contract address for version
 ✔ Building frontend
 ✔ Prepare files for publishing
 ✔ Generate application artifact
 ✔ Publish althea.open.aragonpm.eth
 ✔ Fetch published repo

 ✔ Successfully published althea.open.aragonpm.eth v1.1.0:
 ℹ Contract address: 0x02b9eD3b7c087B57Cb46341D06ae73ab3182507F
 ℹ Content (ipfs): QmNpa2tmeXL2zeGVjN8SDTvmVVCszExR4dJZkE3X6U4Btg
 ℹ Transaction hash: 0x21d6400b9c6ba9ab205c9a7f21f028f7001
```
* Install

```
dao install seabass althea.open.aragonpm.eth --environment infura --app-init-args 0x30c11FC7678A0Da212d79940f4b74774c6580418

```
