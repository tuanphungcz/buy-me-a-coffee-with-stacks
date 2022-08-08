![screenshot](https://buy-me-a-coffee-with-stacks.vercel.app/preview.jpg)

# [Full-stack "Buy me a coffee" dapp on Stacks](https://buy-me-a-coffee-with-stacks.vercel.app)

This is a demo app of an buy-me-a-coffee-like dapp with Stacks.js and clarity smart contracts.

If you are new to the stacks ecosystem and before we dive in, here are a few apps / tools to get started:

#### [Hiro wallet](https://wallet.hiro.so/)

Hiro is a wallet for stacks which manages storing and connecting with the apps in the stacks ecosystem

#### [Stacks.js](https://github.com/hirosystems/stacks.js)

Stacks.js is a Javascript library that provides an easy way to interact with the stacks live blockchain

#### [Next.js](https://github.com/vercel/next.js/)

We will be using Next.js framework to build the frontend part of our app

#### [Tailwind](https://tailwindcss.com/)

Tailwind is a easy to use CSS framework

#### [Clarity smart contract](https://clarity-lang.org/)

Clarity is a smart contract language, which runs on Stacks. It was created by a Blockstack community. Similarly like Solidity for Etherium

#### [Clarinet](https://github.com/hirosystems/clarinet)

Clarinet is a tool for testing, developing and deploying smart contracts written in Clarity. It is a command-line tool that runs on your machine. It is similar to Truffle for Ethereum

#### [Stacks explorer](https://explorer.stacks.co/)

Explorer enables to explore transactions and accounts on the Stacks blockchain

## Prerequisites

- Let’s check that you have [node](https://nodejs.org/en/download/)/[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed on your computer
- We will need docker installed on your computer to run the clarinet testnet. [Docker](https://docs.docker.com/get-docker/)
- We will need Hiro wallet to interact with the app. [Hiro wallet](https://wallet.hiro.so/)
- To install clarinet, you can follow the instructions on the [clarinet website](https://docs.hiro.so/smart-contracts/clarinet)

## Project setup and installation

Now, let’s go to your terminal and clone the directory

```
git clone https://github.com/tuanphungcz/buy-me-a-coffee-with-stacks
cd buy-me-a-coffee-with-stacks
```

Now we can run clarinet testnet in a docker container. Make sure you have docker running on your computer

```
clarinet integrate
```

This will start `devnet` locally on your computer. You should be able to see the following in your terminal


![clarinet-integrate](https://buy-me-a-coffee-with-stacks.vercel.app/clarinet-integrate.jpg)

Next, we need to install all the dependencies and run the project locally

```
yarn
yarn dev
```
![clarinet-dev](https://buy-me-a-coffee-with-stacks.vercel.app/yarn-dev.jpg)

To see everything is working, head to the browser and go to [localhost:3000](http://localhost:3000)

![clarinet-dev](https://buy-me-a-coffee-with-stacks.vercel.app/app-running.jpg)


Now the app is running locally and we can interact with the app. In the demo below I’m showing how you can make buy someone a coffee via the stacks blockchain

In the next part, we will dive into the smart contract part.

next let's rename .env.example to .env. and change the value of the network value to `NEXT_PUBLIC_NETWORK=testnet`
## Smart contract

I would say the learning curve for clarity it’s a bit steeper than learning [solidity](https://github.com/ethereum/solidity), but not as hard as working with [cosmwasm](https://github.com/CosmWasm/cosmwasm) on rust.
A good start would be to go through "the book" [clarity documentation](https://docs.blockstack.org/core/smart/clarityref) and the [clarity tutorial](https://docs.blockstack.org/core/smart/tutorial). I would also recommend to go through “the book” for clarity language [https://book.clarity-lang.org/](https://book.clarity-lang.org/)

Regarding the folder structure in our project.

```
├── Clarinet.toml
├── contracts
│   └── coffee.clar
├── settings
│   └── Devnet.toml
│   └── Testnet.toml // we will add this later
|-- deployments

└── tests
    └── coffee.ts
```

- `/contracts` - for the smart contract itself
- `/deployments` - auto generated deployment files by clarinet
- `/settings` - settings for generating files in `/deployments` folder. As for now, we will be working with `devnet.toml`

In the first part of the contract, we define

- `variable counter` - which stores how many people have donated a coffee.
- `owner constant` - which is the wallet address of the smart contract deployer
- `coffees map` - which is a data map, which stores the message and name of the person who donated a coffee

```clarity
;; counter variable
(define-data-var counter uint u0)

;; contract owner constant
(define-constant CONTRACT_OWNER tx-sender)

;; map index to coffees
(define-map coffees uint {
name: (string-utf8 100),
message: (string-utf8 500)
})

```

In the second part we can find some methods:

- `get-total-counter` - which return the total number of donator
- `get-coffee` - this returns us the specific coffee message by counter index
- `increment-counter` - as the name says, it increment the counter number by 1.

```clarity
;; get total index
(define-read-only (get-total-counter)
  (ok (var-get counter)))

;; readonly function to get the coffee at a given index
(define-read-only (get-coffee (id uint))
    (map-get? coffees id)
)

;; private increment method the counter index
(define-private (increment-counter)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))))
```

The other part is the part where we can find methods of the smart contracts, where the main function is the buy-coffee.

```clarity
;; public buy me a coffee method
(define-public (buy-coffee (message (string-utf8 500))  (name (string-utf8 100)) (price uint))
  (let ((id (unwrap! (increment-counter) (err u0))))

    (print { message: message, id: id, name: name, price: price })

    (try! (stx-transfer? price tx-sender CONTRACT_OWNER))
    (map-set coffees id { message: message, name: name } )

    (ok "Thank you for a coffee")
  )
```

So let’s go throug it line by line. Our function signature is:

```clarity
(define-public (buy-coffee (message (string-utf8 500))  (name (string-utf8 100)) (price uint))
```

that is saying we are defining a public function buy-coffee and it takes message, name and price as an parameters.

Let’s decode what is happening inside the body of the function

- In the first line we can see, calling a method increment-counter which increment the number of donations
- The next line send the transactions with the price to the contract owner (deployer)
- then the function stores message and name of the donator to the coffees map
- On the last line, we return the success response type message

```clarity
(let ((id (unwrap! (increment-counter) (err u0))))
    (try! (stx-transfer? price tx-sender CONTRACT_OWNER))
    (map-set coffees id { message: message, name: name } )

    (ok "Thank you for a coffee")
    )
```

## Frontend

You can find the frontend part of the buy-me-a-coffee in [/pages/index.tsx](https://github.com/tuanphungcz/buy-me-a-coffee-with-stacks/blob/main/pages/index.tsx) where you can find a few methods which interacts with the blockchain.

- `getCoffeeMessages`
  - This method fetches the transactions from the contract address. You can find the full documentation [here](https://docs.hiro.so/api#tag/Accounts/operation/get_account_transactions)
  - The transactions is filtered with the mapResultsFromTx function, where we map the data into our structure and filter out only contract calls with `buy-coffee` function name
  - Lastly, we store the mapped result into `tsx` state.
- `getSupporterCounter`
  - This method fetches index-counter aka how many people bought us a coffee.
  - We parse the counter number and use `setSupporters` to store the value
- `handleSubmit`
  - This method submit calls the smart contract function `buy-coffee`
  - functionArgs - args that we pass to the smart contract - message, name and price.
  - PostCondition - which is a safety feature of the clarity smart contracts. To learn more I recommend [this article](https://dev.to/stacks/understanding-stacks-post-conditions-e65) by [Kenny Rogers](https://twitter.com/KenTheRogers)
  - We make the call using `openContractCall` function from [@stacks/connect](https://www.npmjs.com/package/@stacks/connect)
  - On call success we display a toast message and add the incoming transaction to our existing list of transactions

## Deploying to testnet

1. First we need to make sure we are on `testnet`. You can do that by clicking on the network button on the top right corner of the Hiro wallet.
2. To deploy our contract we need a bit of stacks for the fee. Go to stacks faucet and request some STX via the [Stacks faucet](<[https://explorer.stacks.co/sandbox/faucet?chain=testnet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)>)
3. Next, in the Hiro extension, we click on the `View secret key`
4. With the secret key we replace with the `<YOUR PRIVATE TESTNET MNEMONIC HERE>` in the file below

```toml
[network]
name = "testnet"
stacks_node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "<YOUR PRIVATE TESTNET MNEMONIC HERE>"
```

5. We need to create another setting file for testnet. Let’s create a testnet.toml in `/settings` folder.

6. Once we have it, we can generate a deployment plan for the project by running this command

```
clarinet deployment generate --testnet
```

7. Finally, once we have everything needed, we can deploy the contract to testnet by this command

```
clarinet deployment apply -p ./deployments/default.testnet-plan.yaml
```

![deploy](https://buy-me-a-coffee-with-stacks.vercel.app/deploy.jpg)

8. Once the contract is deployed, we can find the contract address in the terminal. We need to copy the contract address and replace it in the `contractAddress` variable in the [/pages/index.tsx](https://github.com/tuanphungcz/buy-me-a-coffee-with-stacks/blob/main/pages/index.tsx) file.

## Verify on testnet explorer

Now we can verify our contract on [testnet explorer (ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.coffee)](https://explorer.stacks.co/txid/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.coffee?chain=testnet)

![deploy](https://buy-me-a-coffee-with-stacks.vercel.app/contract-explorer.jpg)

If we scroll down, we can see the contract source code.
![deploy](https://buy-me-a-coffee-with-stacks.vercel.app/contract-explorer-2.jpg)

## Demo apps and source code

Here are some other demo app tutorials and source code that you can check out:

- [Developing a Full-Stack Project on Stacks](https://dev.to/mariaverse/developing-a-full-stack-project-on-stacks-with-clarity-smart-contracts-and-stacksjs-part-ii-backend-1pnp) from [mariaverse](https://twitter.com/mariaverse)
- [An Introduction to Full-Stack Web3 Development with Stacks](https://dev.to/stacks/built-on-bitcoin-an-introduction-to-full-stack-web3-development-with-stacks-me9) from [KenTheRogers](https://twitter.com/KenTheRogers) | Github repo: [Sup](https://github.com/kenrogers/sup)
- [Heystack](https://github.com/hirosystems/heystack) from [Hiro](https://twitter.com/hirosystems)

## Other Useful videos and resources

Here is a list of other useful videos and resources that I found helpful when I was learning about Stacks and Clarity.

- ["The book" of clarity](https://book.clarity-lang.org/) - Official docs for clarity
- [Clarity vs. Solidity: A Web3 Programming Language Workshop](https://www.youtube.com/watch?v=L8EN6PmMEPY) - A workshop done by Hiro’s Developer Advocate Max Efremov
- [Smart contracts examples](https://docs.hiro.so/tutorials/clarity-counter) from official Hiro docs site
- [Stacks.js starters](https://github.com/hirosystems/stacks.js-starters) - A collection of starters for building frontend apps on Stacks

## License

Licensed under the [MIT license](https://github.com/tuanphungcz/buy-me-a-coffee-with-stacks).
