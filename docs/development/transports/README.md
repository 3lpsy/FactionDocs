# Developing Transports
Transports consist of two parts, a transport server and a transport module.

## Transport Server
A Transport Server sits between the Faction API and an agent. When a user creates a new Transport Server in Faction, they provide a name and in return get: a TransportId, API Key Name, and API Secret. Your transport server will use this information to interact with the Faction API. It is up to you to implement how you get this information from the user, but its probably easiest to tell them them to save it to some sort of config file that you'll read.

Transport servers interact with three APIs:

* `/api/v1/transport/`: This endpoint is used to register the transport server with Faction. When you register your transport with Faction, you'll provide:
  - TransportType: What is name of your transport? "HTTPTransport", "Jane's leet ICMP transport", whatever.
  - GUID: Your transport server will need a unique GUID. This is static, meaning that every instance of your transport server uses the same GUID. This GUID is used to associate your transport type with a transport module in the agent.
  - Configuration: This is the configuration that will be used by the agent to communicate with your transport. You'll include things like URLs to connect to, as well as any other configuration options here.

* `/api/v1/staging/<staging_name>/<staging_id>/`: This is the endpoint that you will use for agent staging. When an agent stages, it will provide your transport server with its name and a base64 encoded message, a staging name, and a staging ID. You will need to send this information to this endpoint as well as:
  - TransportId: This is the ID of your Transport Server. This is provided to the user when then create a new transport server.
  - SourceIp: This is optional, but allows you to tell Faction where this request came from (as in, the external IP address of the agent).
When you post this information, the Checkin API will reply with a base64 encoded response (if there are any pending tasks for this agent). Your transport server is responsible for getting this base64 encoded string back to the agent.

* `/api/v1/agent/<agent_name>/checkin/`: This is the endpoint that you will use for agent messaging. When an agent checks in, it will provide your transport server with its name and a base64 encoded message and its name. You will need to send this information to this endpoint as well as:
  - TransportId: This is the ID of your Transport Server. This is provided to the user when then create a new transport server.
  - SourceIp: This is optional, but allows you to tell Faction where this request came from (as in, the external IP address of the agent).
When you post this information, the Checkin API will reply with a base64 encoded response (if there are any pending tasks for this agent). Your transport server is responsible for getting this base64 encoded string back to the agent.

More details on the Faction API can be found [here](/docs/development/api/)

## Transport Modules
Faction Agents call a generic `beacon` or `stage` method to communicate with Faction. Transport Modules are what provide the actual functionality for these methods. Agents don't care how these methods work, as long as the behave as expected.

When an agent calls either beacon or stage, it provides its agent name and a base64 encoded message. When calling these methods, the agent expects a string to be returned which would either be the message from the API or just an empty/blank string if there is no message from the API.

Modules are language specific and currently Faction only provides the language standard for .NET modules. Details on .NET Transport modules can be found [here](/docs/development/modules/dotnet/)

