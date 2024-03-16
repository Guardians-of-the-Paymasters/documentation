# Guardians of the Paymasters Project

**Guardians of the Paymasters** is a cutting-edge project that focuses on enhancing the security and control of blockchain transactions, specifically for paymasters. Our mission is to build a robust Next.js API wrapper that enacts user-set policies on transactions seeking sponsorship, ensuring both security and compliance with predefined criteria.

## Project Overview

This project incorporates multiple facets, including backend and frontend development, integration with blockchain technology, and the creation of user-defined policies to govern transaction sponsorships. Our primary toolset includes Next.js for the API wrapper, Firebase for our database needs, and blockchain SDKs like Alchemy or Pimlico for interacting with Ethereum transactions.

## Core Objectives

The development of **Guardians of the Paymasters** is organized around several key objectives, each crucial to the project's success. These include setting up the development environment, creating a secure and efficient data flow, and implementing a system for transaction verification and policy enforcement.

### ToDos

#### Backend

1. **Setting up Next.js with a Firebase Database**
   - Initialize a Next.js project integrated with Firebase to handle our database needs.
   
2. **The Data Transition between the Frontend and the Backend**
   - Establish a seamless and secure data exchange mechanism between the frontend UI and the backend services.

3. **Generating a Sponsorship Transaction**
   - Use the Alchemy or Pimlico SDK to generate sponsorship transactions. These transactions will be parsed and decoded by our API.

4. **Transaction Parsing Service**
   - Develop a service that accepts ERC4337 transaction sponsorship requests. It will only forward these requests if they comply with all the set policies.

##### Policies

- **Spending Cap Policy**: Implement a policy that sets a maximum amount of Ethereum that can be spent by individual addresses.
- **Smart Contract Method Policy**: Limit the functions that a sponsored transaction can perform, specifying allowed contract addresses.
- **NFT Balance Check Policy**: Allow only users with certain NFT balances to be eligible for transaction sponsorship.

#### Frontend

1. **UI for Policy Setup**
   - Create a user interface that enables easy setup and management of the aforementioned policies.

2. **Mint NFT Demo Button**
   - Implement a feature for gasless NFT minting using a throwaway private key, designed for demonstration purposes.

3. **Demo Deploy Smart Contract Account via the API wrapper against Alchemy
   - Trigger a smart contract account deployment through the API wrapper vs the policies
3. **Gasless Demo Case**
   - Develop a gasless demo case, such as a Tic Tac Toe game, to showcase the capabilities of our platform.

## Conclusion

**Guardians of the Paymasters** is poised to introduce a new level of security and flexibility to blockchain transaction sponsorships. Through our focused development efforts and strategic implementation of user-defined policies, we aim to provide unparalleled control and safety for paymasters across the blockchain ecosystem.
