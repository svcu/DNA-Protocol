# DNA PROTOCOL

# Quick Start : 

`npm install `

`cd ./financial `

`npm install `

`node api.js `

Download the **DNA SIGNING TOOL** and the **DNA WALLET GENERATOR** below to get started

## Introduction to the DNA PROTOCOL :

---

The **DNA PROTOCOL** is an **alternative** to the blockchain thechnolgy in the finances. The DNA PROTOCOL allows to make transactions in a way **faster** than in the blockchain, **cheaper** tha in the blockchain and **secure** as in the blockchain, in other words is **BLOCKCHAIN 2.0**. The **DNA PROTOCOL**, generates the coins by making transactions, foreach transaction validated (Explained below) 0.004 coins will be generated

---

## How it works

---

The **DNA PROTOCOL** works inspired in the DNA, that does not mean that the process that occurs in the **DNA PROTOCOL** are accurrated emulating how the DNA works. The **DNA PROTOCOL** needs three modules to work of thing to work

- Encoder
- Decoder 
- Validator

And needs a core component to stay secure: **THE CHAIN HASH**

When you are going to start your node you need to paste your DNA Wallet address in the user field in ./financial/network.js, also you need to set the root nodes for your node to download the chain data.

## Encoder : 

The encoder encodes the transaction as a "DNA sequence" and generates the sequence with the matching "nucleotids" to mantain the transaction secure (security sequence or strand)

## Decoder : 

The decoder decodes all the transactions in a strand and return an array with the transactions in the following format

##  **[ EMMITER AMOUNT RECEIVER TIMESTAP VALIDATOR, ...]**

## Validator : 
Validates the transaction by comparing the security sequence and the transaction sequence, if the length is the same an each nucleotid in the transaction sequence matches with its corresponding nucleotid in the security sequence the transaction is valid

# The **Chain Hash**

## What is the Chain Hash:

The **Chain Hash** is the SHA256 hash of all the data stored on the chain, this component is the  principal component that maintains the network secure against attackers

## How the Chain Hash manatins the network secure against attackers : 

The **Chain Hash** is the identifier of the network, every single node with the same hash will be sinchronyzed and will belong to the same network as the others. 

## Example and explanation :

Lets supose that we have three nodes Alice, Bob and Jacob. Initially Bob, Alice and Jacob will have the same chain hash, by example: 2. Alice wants to insert a malicious transaction and modifies the source code of her distribution to avoid the consensus validation (if the consesus does not approve the transaction she will inser it anyways), when Alice inserts the malicious transaction in her chain and Bob and Jacob not, alice will have a completely different chain hash, by example 21, now Alice will belong to another network. The next time Alice tryes to insert a transaction with Jacob and Bob as validators they arent going to insert the transaction in their chains because the chain hash of alice is not the same that Jacobs and Bobs. Resuming Alice will be isolated in her own malicious network

# Inserting a transaction

1. Validate the transaction locally, if the transaction is valid
2. Broadcast it to another random nodes, if the majority of the nodes approves the transaction, this will be inserted in all the nodes

## Consensus validation : 

1. Validates the transaction signature
2. Check if the emitter has the required balance to send the transaction
3. Check if the transaction is valid (security and transaction strand validation)
4. Check if the nodes are in the same network (same Chain Hash)

# Starting your own network

You can modify the source code and run your own network, to generate the first coin you need to make a transaction of 0 value, this will generate the first 0.004 coins and give them to the validator node, then you can start transacting, foreach transaction validated nw coins will be generated

# Additional Resources

## [DNA SIGNING TOOL](https://www.example.com)
## [DNA WALLET GENERATOR](https://www.example.com)

# Credits

## Sergio Valdés Valdés : Creator of the DNA PROTOCOL
## Work email : sergiovaldes2310@outlook.com


