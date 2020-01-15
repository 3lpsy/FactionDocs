---
description: Some terms used throughout the Faction documentation
---

# Glossary

* **Payload**: A file or command that is run on a target machine to establish an agent
* **Agent**: An instance of an Agent Type that is registered and communicating with Faction.
* **Agent Type**: A kind of agent, for example [Marauder](https://github.com/maraudershell/Marauder)
* **Modules**: Libraries that provide a Faction Agent with additional functionality in the form of commands or transport options.
* **Transport**: The combination of a Transport Server and Transport Module
* **Transport Server**: A server that sits between a payload/agent and the Faction API. It manipulates API messages so that they can be routed over different transmission methods or obfuscated \(or both\)
* **Transport Module**: A module that allows an agent to talk to a specific kind of Transport Server

