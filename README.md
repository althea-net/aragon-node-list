## Usage

Global tools:

```
npm i -g truffle@beta
npm i -g ganache-cli
npm i -g @aragon/cli

```

Repo deps:

```
yarn install
```

Running test, `aragon devchain` doesn't work because it doesn't have enough accounts:

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
