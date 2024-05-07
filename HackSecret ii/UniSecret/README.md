# UniSecret

UniSecret is a Unity package that allows developers to quickly integrate their game with the Secret Network blockchain, which in turn provides access to all benefits known from web-based DApps, but in a video game format.

# Third Party code

This package uses a modified version of the [SecretNET client library](https://github.com/0xxCodemonkey/SecretNET)

The following changes had to be made to the library to get it to work with Unity:

* Target framework changed from .NET 6 to .NET Standard 2.1
* Removed dependency on MAUI
* Made the library portable and compile-able for all platforms
* Rewrote parts of the code using .NET 6 features
* Added hooks for injecting custom behavior from executing assemblies (Unity game in this case) to allow for custom behaviors and handlers for gRPC-web client... ... ... basically made it ***work with Unity WebGL builds***

# Requirements

This package requires at least ***Unity 2022.3.1 LTS***

Additionally, your project *needs to* reference the following libraries and packages:

* Newtonsoft.Json for Unity
* TextMeshPro
* [UnityGrpcWeb](https://openupm.com/packages/ai.transforms.unity-grpc-web/)

# Installation

You can install this package through the Unity Package manager (`Install from Git` option). 

# Integration & Setup

UniSecret makes it as simple as possible to get started with the Secret Network integration. A `Secret Loader` prefab is provided out of the box which can be dragged into any scene to turn it into a wallet set-up scene.

Alternatively, for quick start a fully constructed wallet scene is provided in the `Scenes/` folder. Adding this scene to the build with index `0` will ensure that the user will only get around to the actual gameplay after connecting their wallet to the game.

***Note:*** The `Secret Loader` component has an inspector property that you need to adjust for everything to work. The `Post Init Scene` property has to be set to the name of your game's "first" scene - be it a splash screen, main menu or anything else.

# Usage

UniSecret provides most of the functionality through public API exposed through the `SecretLoader` class. You can get an instance of the class in your code by simple calling:

```cs
SecretLoader secret = SecretLoader.Instance;
```

## Getting the Signer wallet info

From there, you can easily access the connected wallet through the `Signer` property:

```cs
Debug.Log(secret.Signer.Address);
```

## Querying the Blockchain

Additionally, you are able to query all blockchain data with the `Queries` property:

```cs
var myScrtBalance = await this.Queries.Bank.Balance(
    new Cosmos.Bank.V1Beta1.QueryBalanceRequest()
    { 
        Address = "...", 
        Denom = "uscrt" 
    }
);
```

## Smart Contract Query Short-hand

There is also a shorthand method available for querying contract state directly from `SecretLoader`:

```cs
var welcomePack = await secretLoader.QueryContractState<WelcomePackQuery>(
    "secret1zag3hdz0e0aqnw9450dawg7j6j56uww8xxhqrn", 
    new 
    { 
        qualified_for_welcome_pack = new 
        { 
            address = secretLoader.Signer.Address 
        } 
    }
);
Debug.Log(welcomePack.RawResponse);
welcomePackRewardsButton.enabled = welcomePack.Response.Qualified;
```

## Broadcasting Transactions

When it comes to sending transactions, `SecretLoader` exposes a method that takes in an array of messages and an optional callback `onComplete` that gets called on a successful execution of a transaction (after it is committed):

```cs
await secretLoader.SignTransaction(
    new[] { 
        new MsgExecuteContract(
            "secret1zag3hdz0e0aqnw9450dawg7j6j56uww8xxhqrn", 
            new { receive_welcome_pack = new { } }) 
        {
            Sender = secretLoader.Signer.Address 
        }
    }
);
```

The transaction will automatically be forwarded to the user in the form of a dialog box with options to accept or deny the call.

# Current State

***This library is in very early stages of development and is by no means production ready. It is an early proof of concept. Any feedback and contributions are welcome.***