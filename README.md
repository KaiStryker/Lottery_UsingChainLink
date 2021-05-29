# Lottery Contract using Chainlink

This contract uses Chainlink's oracle network to conduct a lottery game. This was a fun build that showed me the power of using Chainlink to get off-chain data. What I have learned will enhance my smart contracts signifiacntly going forward.

## Requirements

- NPM
- TRUFFLE

## Installation

1. Install truffle

```bash
npm install truffle -g
```

2. clone repo

```bash
git clone https://github.com/KaiStryker/Lottery_UsingChainLink.git
```

3. Install dependencies by running:

```bash
npm install

# OR...

yarn install
```

## Test

```bash
truffle test
```

## Deploy

For deploying to the kovan network, Truffle will use `truffle-hdwallet-provider` for your mnemonic and an RPC URL. Set your environment variables `$RPC_URL` and `$MNEMONIC` before running:

```bash
npm run migrate:kovan
```

You can also run:

```bash
truffle migrate --network kovan --reset
```
If you want to use truffle commands.

### Local Blockchain

> :warning: Without a Chainlink node deployed locally, requests from smart contracts will not be responded to. It is recommended that you deploy to the Kovan network.

If needed, edit the `truffle-config.js` config file to set the desired network to a different port. It assumes any network is running the RPC port on 8545.

```bash
npm run migrate:dev
```
