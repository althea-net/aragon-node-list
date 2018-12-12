# Subnet-controller

This repo contains the contracts and Aragon app used by Althea for managing SubnetDAOs.

For more information please read: [https://altheamesh.com/governance-paper](https://altheamesh.com/governance-paper)


## Usage

```
yarn install
npm run start
```

### Running tests

Use the global `truffle` and `ganache-cli` instead of the `aragon contracts` truffle wrapper. Like so:

```
ganache-cli
truffle test
```
### Developing

On three seperate terminals execute the following commands
```
npm run devchain
npm run start:app
npm run start:aragon:http
```

### Scripts explanations

- **start**: Run the app locally
- **clean-start**: Removes parcel cache
- **compile**: Compile the smart contracts
- **build**: Compiles the contracts and builds the front-end


## Gas costs

Gas costs on rinkeby:

Deploying dao:

 * [1723324](https://rinkeby.etherscan.io/tx/0x52c67744471aa648afd67705f54c3d79e5a59c8f1ce37b852d3d213e8333c001)

Deploying multisig and token:

 * [4813913](https://rinkeby.etherscan.io/tx/0xad3b43a2161263d72027a4181af2616fe78c29f33d1b0a442f9813f64eb1ad98)


## Aragon-cli usage for dao install

### Publish

```
aragon apm publish minor --environment infura --apm.ipfs.rpc http://sasquatch.network:5001
```

### Install

This needs the special [branch](###-Live-dao-installs-branch)

```
aragon-live dao install seabass althea.open.aragonpm.eth --environment infura --apm.ipfs.rpc https://ipfs.eth.aragon.network/ipfs

```

### Permissions

This needs the special [branch](###-Live-dao-installs-branch)

```
aragon-live dao acl create clatskanie.aragonid.eth \ # dao ens
  0x97895FDBdEFdB4F68985d000D421573446d87892 \  # app proxy address obtained by going to the DAO address on etherscan and looking at internal txns
  0xaf290d8680820aad922855f39b306097b20e28774d6c1ad35a20325630c3a02c \ # MANAGER
  0x8191399d0c13A2ED477bC68B70e8A8814E287C6C \ # Voting address
  0x8191399d0c13A2ED477bC68B70e8A8814E287C6C \ # Voting address
  --environment infura
```
#### Roles:

* MANAGER: `0xaf290d8680820aad922855f39b306097b20e28774d6c1ad35a20325630c3a02c`

* ADD: `0x9ea0cf9577cabd8688fb70d8a8c076ffb703a26054de703e8da063dc72300137`

* DELETE: `0x19a34d8f52981d070368ff4b59a2a8a437917058fabecd70f237af13f0425463`

### Upgrade

```
aragon dao upgrade seabass.aragonid.eth althea.open.aragonpm.eth 2.0.0 --environment infura --apm.ipfs.rpc https://ipfs.eth.aragon.network/ipfs
```


## Live dao installs branch

The current aragon-cli doesn't have the capability of installing new apps to a dao. So for now one can use this [version](https://github.com/sebohe/aragon-cli/tree/live-dao-installs).

Once this [PR](https://github.com/aragon/aragon-cli/pull/270) gets merged then the live-install branch isn't needed

For setting up this live install version I usually do the following:

```
git clone https://github.com/sebohe/aragon-cli --branch live-dao-installs
cd aragon-cli && yarn install && yarn build
ln -s `readlink -f dist/cli.js` ~/.local/bin/aragon-live # or any directory in your $PATH env var

```
