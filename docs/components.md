# Faction Components

Here you'll find a break down of various components within Faction

* [Services](components.md#services): The services that make up Faction
* [CLI](components.md#cli): The Faction CLI, used to manage a Faction installation

## Services

Faction consists of several services working together.

### Console

The Console server acts as the public entry point to Faction. It provides access to both the Faction console as well as the internal API service. Both the Faction console and API are accessed over HTTPS, meaning that you only need to expose TCP port 443.

::: tip It is _highly_ suggested that you restrict access to the console to your operatives and Transport services :::

### API

The API service provides access to all of Faction's features and serves as the authentication layer for Faction. It provides both REST and Socket.IO based APIs. Further details on using the API can be found in the [API documentation](development/api.md)

### Core

The Core service is responsible for handling all user and agent messages. One important thing to note about Factions design is that Core is the only service that decrypts agent messages.

### Build Servers

Build servers provide a build environment for a given programming language. They're designed to be simple and unopionated, runing shell commands provided by build configs for [modules](development/modules/) and [agents](development/agents.md). The idea behind this is to allow developers to control the build process in a way that makes sense to them and allows Faction to easily be extended to support modules and agents in new languages.

#### .NET Build Service

The .NET build service provides a Mono development environment that can be used to build .NET modules and agents.

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

