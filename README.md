# Digipay
## A Blockchain-Based Wallet Website

This project aims to introduce users to blockchain and Web3 functionalities by integrating with MetaMask, allowing transactions via a custom website wallet, and utilizing Superfluid for stream transactions. It features a comprehensive user system with registration and login capabilities, transaction history, and the generation and use of test tokens for transactions.

## Features

1. **MetaMask Integration**: Prompt users to connect their MetaMask wallet upon visiting the website.
2. **Display Account Details**: Show the connected MetaMask account's address and balance.
3. **Website Wallet Functionality**: Enable users to send cryptocurrency from their MetaMask account to another recipient's address. These transactions are recorded on the blockchain.
4. **Transaction History**: Display a history of all user transactions made through the website.
5. **User Authentication System**: Include a registration and login system, with MongoDB or MySQL as the database backend. Unique email addresses are used for registration. Transactions can be filtered by the user's email address (stored in the blockchain transaction in a secure manner).
6. **Superfluid Integration**: Implement a separate wallet feature using Superfluid for creating, updating, and deleting money flows.
7. **Test Token Generation**: Allow users to generate test tokens for use in transaction testing.
8. **Educational Content**: Provide users with information on blockchain and Web3 to educate them on the technology's uses and implications.
9. **Superfluid Wallet Functions**: Detailed functionalities for creating, updating, and deleting flows with Superfluid.

## Technology Stack

- **Frontend**: React, Vite
- **Blockchain Interaction**: Web3.js or Ethers.js, Solidity for smart contracts
- **Backend**: Node.js, Express.js for server-side logic
- **Database**: MongoDB or MySQL
- **Blockchain Technologies**: MetaMask, Superfluid
- **Testing**: Hardhat or Truffle for smart contract testing

## Version 1:

This Web Application is currently limited to interacting with MATIC because the contract is designed for operations with the native token, and the RPC URL connects to the Mumbai network where MATIC is the native currency.

## Deployed in render

[https://digipay-app.onrender.com](https://digipay-app.onrender.com)

## Network Deployment Summary

- **Mumbai**:
  - TransactionRecorder deployed to: `contract_address`

- **Polygon Mainnet**:
  - Insufficient funds in my wallet account provided to deploy.

- **Ethereum Mainnet**:
  - Insufficient funds in my wallet account provided to deploy.

- **Goerli Testnet**:
  - Insufficient funds in my wallet account provided to deploy.
  - Note: To receive Goerli ETH, your wallet must have a minimum balance of 0.001 ETH on mainnet. Please add ETH to your wallet and try again.

- **Sepolia Testnet**:
  - Taking so much time and giving network errors while adding Sepolia ETH to wallet (not added). So, while deploying the contract for Sepolia RPC, it showed insufficient funds.

- **Linea Mainnet**:
  - Insufficient funds in my wallet account provided to deploy.

For now, I am able to get Mumbai faucet MATIC tokens only, and those I am using now in this application with a contract deployed on the Mumbai network. These tokens are also limited to get sufficient gas amount; if our account already has that much amount, then it won’t give more.


## Version 2:

### Integration with Superfluid is done!.

- You can use the same link: [https://digipay-app.onrender.com](https://digipay-app.onrender.com)

- Now users can create streams, update streams, delete streams

- **Note to Users:** For streaming transactions in Superfluid, ensure you use Super Tokens, typically ending with 'x' (e.g., fDAIx). These tokens are "wrapped" versions of regular tokens, designed for fluid, continuous transactions. To convert regular tokens into Super Tokens or vice versa, visit [Superfluid App](https://app.superfluid.finance/), where you can easily wrap and unwrap tokens for use in streams. Always confirm you're interacting with the correct token for seamless transactions.

