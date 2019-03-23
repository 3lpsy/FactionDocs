## What is Faction
Faction is a C2 framework for security professionals, providing an easy way to extend and interact with agents. It focuses on providing an easy, stable, and approachable platform for C2 communications through well documented REST and Socket.IO APIs.

<iframe style="margin: 0 auto; text-align: center" width="560" height="315" src="https://www.youtube-nocookie.com/embed/gETAhgBJabI" frameborder="0" allowfullscreen></iframe>

### What makes Faction special
Faction was developed with a heavy focus on modularity, allowing it to be flexible enough to serve a variety of needs. Because of this, there are few things about Faction that are different from a standard C2 platform.

1. While the Faction team has released a [.NET agent](https://github.com/maraudershell/Marauder) for Faction, is not *THE* Faction agent. Faction was designed to interact with any agent that speaks its language. This means that you can easily create your own agent for Faction either for your internal team or the world at large.

2. You can create an entirely stand alone agent with all its functionality baked in, but agents greatly benefit when they can load Faction modules. These modules are stand alone libraries or code that bring new commands and features to an agent. An important aspect of Faction modules is that they are designed to be language specific, not agent specific. For example, any agent that can load the .NET runtime can leverage Faction's .NET modules.

3. In most engagements, you're not going to have your agents connecting back directly to your C2. Faction was designed with redirects in mind in the form of Transport Servers. Transport Servers sit between Faction and your agent and handle masking your communications, and since Faction is all API based, these servers can be written in whatever language you're most comfortable in. 


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
The Faction install script has only been tested on Ubuntu 18.04.2. It might work on other versions of Ubuntu, but we're not promising anything.
:::

The easiest way to install Faction is with:

```
curl https://raw.githubusercontent.com/FactionC2/Faction/master/install.sh | sudo bash
```

If you're (understandably) concerned about piping a shell script from the internet into bash, you can instead clone the install repo and run it locally

```
git clone https://github.com/FactionC2/Faction/
cd install
sudo bash ./install.sh
```

Once the install has finished, you'll be able to use the `faction` command to interact with your Faction install. The first thing you're going to want to do is run `sudo faction setup`. This command provides plenty of configuration options (including some that are totally unsupported), some of the relevant options are covered here. More details about the Faction CLI can be found [here](/docs/components/#CLI).

|Parameter          | Description |
|-------------------|-------------|
|--external-address | This is the address that you'll use to access Faction. By default, the external IP for the computer will be used over SSL (https://[external ip address]) |
|--admin-password | By default, a random password will be generated for the Admin account. |

## Next Steps
Once your install has finished, you can log into Faction at the address displayed at the end of installation (Default is https://[external ip address]) using the username and password provided.

Further details on using Faction can be found in the [Using Faction](/docs/using/) section.
