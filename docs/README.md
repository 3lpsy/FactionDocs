## What is Faction
Faction is a C2 framework for security professionals, providing an easy way to extend and interact with agents. It focuses on providing an easy, stable, and approachable platform for C2 communications through well documented REST and Socket.IO APIs.


## How Faction Works
Instead of one large monolithic application, Faction is designed loosely around a micro services architecture. Functionality is split into seperate services that communicate through message queues. This approach provides several advantages, most important of which is allowing users to quickly be able to learn how the system operates. 

Faction consists of four main services:

* **Console**: The Faction console is a javascript application that interacts with the Faction API. It can be accessed with any modern browser and serves as the operational entry point to the system. 
* **API**: The API is the how users, agents, and anything else interacts with Faction.
* **Core**: The Core service handles all user and agent messaging, including processing user commands and handling encrypting/decrypting agent messages.
* **Build Servers**: Build Servers handle building payloads and modules. They are language specific, allowing Faction to be easily extended to support new languages. Currently Faction supports .NET payloads and modules.

In addition to these services, Faction also relies on RabbitMQ for communication between services and PostgreSQL for data storage.

## Installing Faction
::: warning
The Faction install script currently only supports Ubuntu 18.04
:::

The easiest way to install Faction is with:

```
curl https://github.com/factionc2/install/install.sh | sudo bash
```

If you're (understandably) concerned about piping a shell script from the internet into bash, you can instead clone the install repo and run it locally

```
git clone https://github.com/factionc2/install/
cd install
sudo bash ./install.sh
```

Once the install has finished, you'll be able to use the `faction` command to interact with your Faction install. The first thing you're going to want to do is run `sudo faction setup`. This command provides plenty of configuration options (including some that are totally unsupported), some of the relevant options are covered here. More details about the Faction CLI can be found [here](/docs/components/#CLI).

|Parameter          | Description |
|-------------------|-------------|
|--external-address | This is the address that you'll use to access Faction. By default, the external IP for the computer will be used over SSL (https://[external ip address]) |
|--admin-password | By default, a random password will be generated for the Admin account. |

## Next Steps
Once your install has finished, you can log into Faction at address displayed at the end of installation (Default is https://[external ip address]) using the username and password provided.

Further details on using Faction can be found in the [Operation](/docs/operation/) section.