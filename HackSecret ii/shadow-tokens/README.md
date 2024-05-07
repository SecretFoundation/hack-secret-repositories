# Shadow Tokens

![hero](/frontend/public/hero.png)

# User-Focused Summary

Shadow Tokens is a revolutionary platform dedicated to enhancing NFT interactions through a user-centric approach, prioritizing privacy, security, and cross-chain functionality. Users can effortlessly manage and view their Ethereum/Polygon-based NFTs on a dedicated profile page. The integration of Axelar enables secure NFT deposits into an Ethereum vault, initiating cross-chain transactions to Secret Network.

# Investor Pitch

**Problem:**
The current NFT landscape lacks adequate solutions for privacy-centric transactions. Users face challenges in securely transferring fractional NFT ownership without compromising blockchain transparency.

**Solution:**
Shadow Tokens addresses these challenges by leveraging the capabilities of Secret Network, enabling seamless, confidential transfers of fractional NFT ownership. The platform ensures user privacy by thoughtfully designing the interface to display fractional ownership without revealing actual Ethereum addresses.

**Product Market Fit:**
Shadow Tokens target users seeking enhanced privacy and security in NFT transactions. The platform's unique solution aligns with the growing demand for user-controlled, privacy-focused NFT management.

# Development Deep-dive

**How We Built It:**
Shadow Tokens was developed using a technology stack that includes: Solidity, NextJS, Rust, Axelar, CosmWasm, Cosmos SDK, and, SecretJS. The integration of Axelar facilitates cross-chain transactions, allowing for secure NFT deposits from EVM chains to the Secret Network.

**Contract/Function Interaction:**
The platform consists of smart contracts governing NFT transactions and fractional ownership on both EVM and Secret Network. The user interface communicates with these contracts to provide a seamless experience.

**Design Choices:**
- **Privacy Focus:** Choosing Secret Network for its privacy-centric features ensures secure fractional ownership transfers.
- **User Interface:** Thoughtful design choices in the interface prioritize user experience while safeguarding user privacy.
- **Cross-Chain Integration:** Axelar was selected for its efficiency in enabling cross-chain transactions, crucial for NFT deposits.

### Instructions for Testing

1. Clone the repository.
2. Install dependencies.
3. Run the application locally.
4. Utilize test NFTs on Polygon Mumbai for a comprehensive testing experience.
