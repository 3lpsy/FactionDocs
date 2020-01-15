# Faction Components

Here you'll find a break down of various components within Faction

* [Services](components.md#services): The services that make up Faction
* [CLI](components.md#cli): The Faction CLI, used to manage a Faction installation

## Services

Faction consists of several services that communicate with each other through RabbitMQ and share data through PostgreSQL. This design allows individual services to easily be modified or new services added without effecting the operation of the rest of the framework.

The diagram below provides a high level overview of how the services interact with each other.

![](../.gitbook/assets/faction-diagram-04.png)

### Console

The Console Service is an Nginx instance that acts as the public entry point to Faction. It handles hosting the console web application and provides access to the API service. Access to the console and API is provided over HTTPS, meaning that you only need to expose TCP port 443 to access Faction.

{% hint style="info" %}
For opsec and security reasons, it is _**highly**_ ****suggested that you use firewall rules to restrict access to the Console/API so that only your operatives and [transport servers](components.md#transport-servers) can access these services. Especially in production, agents should be connecting through transport servers \(like the [HTTP Transport](https://github.com/FactionC2/TransportHTTP/)\) to call back to Faction.
{% endhint %}

The console web application communicates directly with the API using a combination of HTTP and Websockets

### API

The API service provides access to all of Faction's features and serves as the authentication layer for Faction. It provides both REST and Socket.IO based APIs. Further details on using the API can be found in the [API documentation](../developing/api.md)

The web console, transport servers, and agents all act as API consumers. Its worth noting though that in production its expected that agents would not be accessing the API directly, but through a [transport server](components.md#transport-servers) instead.

The API service generates RabbitMQ messages that are consumed by the Core service

### Core

The Core service acts as the brains behind Faction. It is responsible for processing and responding to all user and agent messages. One important thing to note about Factions design is that Core is the only service that decrypts agent messages. 

Core generates RabbitMQ messages that are consumed by the API service and any Build Services.

### Build Servers

Build servers provide a build environment for a given programming language. They're designed to be simple and unopinionated, running shell commands provided by build configs for [modules](../developing/modules/) and [agents](../developing/agents.md). The idea behind this is to allow developers to control the build process in a way that makes sense to them and allows Faction to easily be extended to support modules and agents in new languages.

Build Services generate RabbitMQ messages that are consumed by the API service.

#### .NET Build Service

The .NET build service provides a Mono development environment that can be used to build .NET modules and agents.

### Transport Servers

Transport servers sit between the Faction API and agents, taking the place of redirectors in a typical C2 deployment. Together with a matching transport module in a Faction agent, they handle modifying or obfuscating API messages between Faction and the agent. An example of this is the HTTP transport server on the [Faction Github](https://github.com/FactionC2/TransportHTTP/), which allows users to easily craft HTTP traffic that hides Faction API messages on the wire and protects Faction from requests that don't match agent traffic.

Transport servers don't have to use HTTP though, another example would be a transport server that handles communicating over DNS. The server would accept DNS requests, translate them to Faction API messages, and then translate the API response into a DNS response. The transport module in the client would handle taking the DNS response and extracting the original API message from it, and embedding messages into DNS requests.

Its expected that transport servers reside on a separate server than Faction, so no transport servers are installed by default. Details on developing Transport Servers and modules can be [found here](../developing/transports.md).

Transport Servers communicate with the Faction API over HTTP \(REST\) or Websockets \(Socket.IO\)

## CLI

Faction can be managed on the server its installed on through the Faction CLI. The following is an incomplete list of commands available through the CLI. Note that any command can be run with the `--help` parameter to learn more about it.

| Command | Description |
| :--- | :--- |
| `faction setup` | Used to setup Faction |
| `faction start` | Starts all faction containers |
| `faction restart` | Restarts all faction containers |
| `faction stop` | Stops all faction containers |
| `faction status` | Shows the status of all faction containers |
| `faction clean` | Depending on the parameter, removes files, containers, or the faction database |

