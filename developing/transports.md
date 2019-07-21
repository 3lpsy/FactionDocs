# Developing Transports

## Faction Transports

Transports allow you to change how Faction and its agents communicate with each other. They consist of two parts, a transport server which sits between Faction and the agent, and a transport module which is used by the agent to communicate with the server.

The flow looks something like this: 

1. Faction agent checks in, it passes a base64 encoded string to its transport module. 
2. The module transforms this string into a message thats compatble with the transport.
3. The module then sends this message to the transport
4. The transport extracts the original base64 encoded string from this message
5. The transport sends that base64 encoded string to the Faction Checkin API
6. The API responds with a base64 encoded string meant for the agent
7. The transport transforms this message into its defined format
8. The transport then sends this transformed message to the agent
9. The agent's transport module extracts the original base64 encoded string from the message and returns it to the agent

## Transport Server

A Transport Server sits between the Faction API and an agent. When a user creates a new Transport Server in Faction, they provide a name and in return get: a TransportId, API Key Name, and API Secret. Your transport server will use this information to interact with the Faction API. It is up to you to implement how you get this information from the user, but its probably easiest to tell them to save it to some sort of config file that you'll read.

Transport servers interact with three APIs:

* **Transport:** This endpoint is used to register the transport server with Faction. Full details on this endpoint can be found [here ](api.md#transports)but the gist is that when you register your transport with Faction, you'll provide:
  * TransportType: What is name of your transport? "HTTPTransport", "Jane's leet ICMP transport", whatever.
  * GUID: Your transport server will need a unique GUID. This is static, meaning that every instance of your transport server uses the same GUID. This GUID is used to associate your transport type with a transport module in the agent.
  * Configuration: This is the configuration that will be used by the agent to communicate with your transport. You'll include things like URLs to connect to, as well as any other configuration options here. When the [Transport Module](transports.md#transport-modules) for your Transport Server is created, this information will be passed to the build process for the Transport Module. Its recommended you specify this information in a JSON format since thats what everything else in Faction uses, but we're not the boss of you.
* **Agent Staging:** This is the endpoint that you will use for agent staging. When an agent stages, it will provide your transport server with its name and a base64 encoded message, a staging name, and a staging ID. You can find more details about this endpoint [here](agents.md#staging).
* **Agent Checkin:** This is the endpoint that you will use for agent messaging. When an agent checks in, it will provide your transport server with its name and a base64 encoded message and its name. You can find more details about this endpoint [here](api.md#agent-checkins).

More details on the Faction API can be found [here](api.md)

## Transport Modules

Faction Agents call a generic `beacon` or `stage` method to communicate with Faction. Transport Modules are what provide the actual functionality for these methods. Agents don't care how these methods work, as long as the behave as expected.

When an agent calls either beacon or stage, it provides its agent name and a base64 encoded message. When calling these methods, the agent expects a string to be returned which would either be the message from the API or just an empty/blank string if there is no message from the API.

Modules are language specific and currently Faction only provides the language standard for .NET modules. Details on .NET Transport modules can be found [here](modules/dotnet.md)

