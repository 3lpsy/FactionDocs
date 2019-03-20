# Faction Components
Here you'll find a break down of various components within Faction

* [Services](#services): The services that make up Faction
* [CLI](#cli): The Faction CLI, used to manage a Faction installation
* [Objects](#objects): The objects used throughout Faction and their properties

## Services
Faction consists of several services working together. 

### Console
The Console server acts as the public entry point to Faction. It provides access to both the Faction console as well as the internal API service. Both the Faction console and API are accessed over HTTPS, meaning that you only need to expose TCP port 443.

::: tip
It is *highly* suggested that you restrict access to the console to your operatives and Transport services
:::

### API
The API service provides access to all of Faction's features and serves as the authentication layer for Faction. It provides both REST and Socket.IO based APIs. Further details on using the API can be found in the [API documentation](/docs/api/)

### Core
The Core service is responsible for handling all user and agent messages. One important thing to note about Factions design is that Core is the only service that decrypts agent messages. 

### Build Servers
Build servers provide a build environment for a given programming language. This allows Faction to easily be extended to support modules and agents in new languages.

#### .NET Build Service
The .NET build service  provides a Mono development environment that can be used to build .NET modules and agents.

## CLI
Faction can be managed on the server its installed on through the Faction CLI. The following is an incomplete list of commands available through the CLI. Note that any command can be run with the `--help` parameter to learn more about it.

|Command           | Description                                                                    |
|------------------|--------------------------------------------------------------------------------|
|`faction setup`   | Used to setup Faction                                                          |
|`faction start`   | Starts all faction containers                                                  |
|`faction restart` | Restarts all faction containers                                                |
|`faction stop`    | Stops all faction containers                                                   |
|`faction status`  | Shows the status of all faction containers                                     |
|`faction clean`   | Depending on the parameter, removes files, containers, or the faction database |


## Objects
This page describes the various objects used in Faction as well as their schema. 

### Agent
A Faction Agent

| Property          | Type     | Description                                                            |
|-------------------|----------|------------------------------------------------------------------------|
| Id                | Integer  | The Id of the Agent                                                    |
| Name              | String   | The name of the Agent                                                  |
| StagingId         | String   | The Id created to identify the staging message that created this agent |
| Username          | String   | Username on the computer that this agent is running as                 |
| Hostname          | String   | Hostname of the computer that this agent is running on                 |
| Pid               | Integer  | Process ID that this agent is running under                            |
| OperatingSystem   | String   | Operating System that agent is running on                              |
| Admin             | Boolean  | Whether the agent is running in an administrative context or not       |
| AgentTypeId       | Integer  | The type of Agent this is                                              |
| PayloadId         | Integer  | The ID of the payload that created this agent                          | 
| StagingResponseId | Integer  | The ID of the response to the staging message that created this agent  | 
| InteralIp         | String   | Internal IP of the Agent                                               |
| ExternalIp        | String   | External IP of the Agent                                               |
| InitialCheckin    | DateTime | The first time this agent was seen                                     |
| LastCheckin       | DateTime | The most recent time this agent was seen                               |
| BeaconInterval    | Integer  | How frequently the Agent is checking in (in seconds)                   |
| Jitter            | Double   | Jitter value of the Agent                                              |                 
| Visible           | Boolean  | Whether this agent is visible or not                                   |

### Agent Checkin
An encrypted message from an Agent. This usually contains an Agent Task Update

| Property    | Type     | Description                                    |
|-------------|----------|------------------------------------------------|
| Id          | Integer  | The ID of the Agent Checkin                    |
| AgentId     | Integer  | The ID of the Agent that this checkin is from  |
| HMAC        | String   | Base64 encoded HMAC for the encrypted message  |
| IV          | String   | Base64 encoded IV for the encrypted message    |
| Message     | String   | Base64 encoded encrypted message               |
| Received    | DateTime | When the checkin was received.                 |


### Agent Task
A command or instruction for an Agent

| Property         | Type     | Description                                                                |
|------------------|----------|----------------------------------------------------------------------------|
| Id               | Integer  | The Id of the Agent Task                                                   |
| Name             | String   | A GUID identifying the Agent Task used by Agents                           |
| AgentId          | Integer  | The Id of the Agent this task was issued to                                |
| ConsoleMessageId | Integer  | The Id of the Console Message that created this task.                      |
| Action           | String   | The type of task: RUN, LOAD, USE, SET                                      |
| Command          | String   | The contents of the task, for example the command to run or setting to set |
| Created          | DateTime | When the message was created                                               |


### Agent Task Message
This the encrypted version of an Agent Task.

| Property    | Type     | Description                                           |
|-------------|----------|-------------------------------------------------------|
| Id          | Integer  | The Id of the Agent Task Message                      |
| HMAC        | String   | Base64 encoded HMAC for the encrypted message         |
| IV          | String   | Base64 encoded IV for the encrypted message           |
| Message     | String   | Base64 encoded encrypted message                      |
| AgentId     | Integer  | The ID of the agent that this message is for          |
| Sent        | Boolean  | Whether the message has been sent to the agent or not |
| Created     | DateTime | When the message was created                          |
| AgentTaskId | Integer  | The ID of the Agent task associated with this message.|


### Agent Task Update
The response from an Agent for a given Agent Task

| Property  | Type     | Description                                                                |
|---------- |----------|----------------------------------------------------------------------------|
| Id        | Integer  | The Id of the Agent Task Update                                            |
| AgentId   | Integer  | The Id of the Agent this task was issued to                                |
| TaskId    | Integer  | The Id of the Agent Task associated with this update                       |
| TaskName  | String   | The name of the Agent Task associated with this update                     |
| Message   | String   | The contents of the update that will be returned to the console, for example the output from a command or a "completed successfully" message |
| Content   | String   | [OPTIONAL] Used for additional output for a task. Currently used for base64 encoded file contents when a task returns the content of a file |
| ContentId | String   | [OPTIONAL] Used to identify the Content of a task, for example a file path. |
| Received  | DateTime | When the update was received.                                               |


### Console Message
A user submitted message

| Property    | Type     | Description                                                                              |
|-------------|----------|------------------------------------------------------------------------------------------|
| Id          | Integer  | The Id of the Console Message                                                            |
| AgentId     | Integer  | The Id of the Agent this task was issued to                                              |
| AgentTaskId | Integer  | The Id of the Agent Task associated with this update                                     |
| UserId      | Integer  | The Id of the user that submitted this message.                                          | 
| Type        | String   | The type of message, for example HelpMessage, ShowMessage, AgentTask, or AgentTaskUpdate |
| Content     | String   | [OPTIONAL] The true content of the message. This comes into play when the API replaces a file reference with the base64 contents of a file. Otherwise, it should match Display or be Null |
| Display     | String   | What is displayed on the console in relation to this message                             |
| Received    | DateTime | When the Console Message was received.                                                   |


### IOC (Indicator of Compromise)
An optional part of a Agent Task Update that details actions taken on a target

| Property          | Type     | Description                                                     |
|-------------------|----------|-----------------------------------------------------------------|
| Id                | Integer  | The ID of the IOC                                               |
| Description       | String   | Details of what was done on the host                            |
| Type              | String   | The type of IOC. Must be either File, Registry, URL, or Process |
| Identifier        | String   | An identifier for the IOC, for example file path or URL         |
| Action            | String   | The action taken against the object being referenced. MUST be either Create, Access, Modify, Delete, GET, PUT, POST |
| Hash              | String   | [OPTIONAL] The SHA1 hash of the object                          |
| AgentTaskUpdateId | Integer  | ID of the Agent Task Update that this IOC is associated with    |
| Timestamp         | DateTime | When the action took place                                      |
| UserId            | Integer  | ID of the User reponsible for the IOC                           |


### Staging Message
A message from a payload that registers an Agent

| Property          | Type     | Description                                                    |
|-------------------|----------|----------------------------------------------------------------|
| Id                | Integer  | The ID of the Staging Message                                  |
| AgentName         | String   | The name of the agent that staging message is for              |
| PayloadId         | Intger   | The Id of the Payload that created this Staging Message        |
| PayloadName       | String   | The name of the Payload that created this Staging Message      |
| StagingResponseId | Integer  | The Id of the message sent in response to this Staging Message |
| HMAC              | String   | Base64 encoded HMAC for the encrypted message                  |
| IV                | String   | Base64 encoded IV for the encrypted message                    |
| Message           | String   | Base64 encoded encrypted message                               |
| Received          | DateTime | When the Staging Message was received.                         |


### Staging Response
The response from Faction for a Staging Message. This contains an encrypted list of Agent Tasks that setup the agent (Agent Name, Agent Password, etc)

| Property         | Type     | Description                                                        |
|------------------|----------|--------------------------------------------------------------------|
| Id               | Integer  | The ID of the Staging Response                                     |
| AgentId          | Integer  | The Id of the agent that staging response is for                   |
| StagingMessageId | Integer  | The Id of the Staging Message that this response is in relation to |
| HMAC             | String   | Base64 encoded HMAC for the encrypted message                      |
| IV               | String   | Base64 encoded IV for the encrypted message                        |
| Message          | String   | Base64 encoded encrypted list of Agent Tasks                       |
| Created          | DateTime | When the Staging Response was created.                             |
| Sent             | Booleanv | Whether the message has been sent or not                           |