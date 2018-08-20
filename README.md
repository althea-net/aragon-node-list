## Usage

```
npm install
npm start
```

### npm Scripts

- **start**: Run the app locally
- **compile**: Compile the smart contracts
- **build**: Compiles the contracts and builds the front-end
- **test**: Runs tests for the contracts
- **publish**: Builds the apps and the contracts and publishes them to IPFS and APM


### Deploying with infura
Current NodeList address in Rinkeby: `0x44e3f46d37318d6b608756f48d7a9d86934be624q

```
apm publish 0x44e3f46d37318d6b608756f48d7a9d86934be624 --network infura --apm.ens-registry "0xfbae32d1cde62858bc45f51efc8cc4fa1415447e" --no-ipfs-check --apm.ipfs.rpc "http://ipfs.aragon.network:5001" --files build
```
