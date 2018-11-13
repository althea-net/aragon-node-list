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

* Rinkeby
```
$ aragon apm publish major --environment infura
 ✔ Check IPFS
 ✔ Check IPFS
 ✔ Applying version bump (major)
 ✔ Deploy contract
 ✔ Determine contract address for version
 ✔ Building frontend
 ✔ Prepare files for publishing
 ✔ Generate application artifact
 ✔ Publish althea.open.aragonpm.eth
 ✔ Fetch published repo

 ✔ Successfully published althea.open.aragonpm.eth v1.0.0:
 ℹ Contract address: 0x02b9eD3b7c087B57Cb46341D06ae73ab3182507F
 ℹ Content (ipfs): QmNkEvkH7sWqC2keUzfb9GRRu6BuHEWNKYcAfavUkPoecH
 ℹ Transaction hash: 0x1fd267ff84b7371aeb8bba153ac6962455af3fc5b132ea019c463a1f2c585a80
```
