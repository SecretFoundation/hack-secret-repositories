# HackSecret

This repository contains code to arbitrage by reference to the price rates at secret ATOM/ secret stATOM on ShadeSwap and ATOM / stATOM on Stride.

# User focused summary

By using the secretjs and stridejs code found here, you will be able to
- Reference to secret ATOM and secret stATOM price rates on ShadeSwap and redemption rates on Stride
- Using secret ATOM on ShadeSwap, purchase secret stATOM
- Unwrap a secret stATOM that is SNIP-25 to stATOM that can be remitted by an IBC.
- Transfer stATOM on SecretNetwork to an account on Stride
- redeem stATOM on stride

You can arbitrage between ShadeSwap and Stride by utilizing these codes.

# Investor pitch

Users of these codes will be able to offer prices that are fair to the market.


# Development Deepdive

- secretjs
I used secretjs to connect to the SecretNetwork and execute transactions for each contract.
In order to reference what messages should be executed for each contract using secretjs, I ran a swap on the actual ShadeSwa via Keplr and referenced the messages that were sent.

- stridejs
To redeem stATOM to ATOM on stride, stridejs was used.
Since there is almost no sample code for this one, I used it in conjunction with cosmjs to create the client and execute the transaction.

# What to do next

These messages should be executed with fewer transactions to allow for optimal transactions.
