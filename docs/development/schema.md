# Schema

This page describes the various objects used in Faction as well as their schema.

## Agent

A Faction Agent

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The Id of the Agent |
| Name | String | The name of the Agent |
| StagingId | String | The Id created to identify the staging message that created this agent |
| Username | String | Username on the computer that this agent is running as |
| Hostname | String | Hostname of the computer that this agent is running on |
| Pid | Integer | Process ID that this agent is running under |
| OperatingSystem | String | Operating System that agent is running on |
| Admin | Boolean | Whether the agent is running in an administrative context or not |
| AgentTypeId | Integer | The type of Agent this is |
| PayloadId | Integer | The ID of the payload that created this agent |
| StagingResponseId | Integer | The ID of the response to the staging message that created this agent |
| InternalIp | String | Internal IP of the Agent |
| ExternalIp | String | External IP of the Agent |
| InitialCheckin | DateTime | The first time this agent was seen |
| LastCheckin | DateTime | The most recent time this agent was seen |
| BeaconInterval | Integer | How frequently the Agent is checking in \(in seconds\) |
| Jitter | Double | Jitter value of the Agent |
| Visible | Boolean | Whether this agent is visible or not |

## Agent Checkin

An encrypted message from an Agent. This usually contains an Agent Task Update

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The ID of the Agent Checkin |
| AgentId | Integer | The ID of the Agent that this checkin is from |
| HMAC | String | Base64 encoded HMAC for the encrypted message |
| IV | String | Base64 encoded IV for the encrypted message |
| Message | String | Base64 encoded encrypted message |
| Received | DateTime | When the checkin was received. |

## Agent Task

A command or instruction for an Agent

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The Id of the Agent Task |
| Name | String | A GUID identifying the Agent Task used by Agents |
| AgentId | Integer | The Id of the Agent this task was issued to |
| ConsoleMessageId | Integer | The Id of the Console Message that created this task. |
| Action | String | The type of task: RUN, LOAD, USE, SET |
| Command | String | The contents of the task, for example the command to run or setting to set |
| Created | DateTime | When the message was created |

## Agent Task Message

This the encrypted version of an Agent Task.

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The Id of the Agent Task Message |
| HMAC | String | Base64 encoded HMAC for the encrypted message |
| IV | String | Base64 encoded IV for the encrypted message |
| Message | String | Base64 encoded encrypted message |
| AgentId | Integer | The ID of the agent that this message is for |
| Sent | Boolean | Whether the message has been sent to the agent or not |
| Created | DateTime | When the message was created |
| AgentTaskId | Integer | The ID of the Agent task associated with this message. |

## Agent Task Update

The response from an Agent for a given Agent Task

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The Id of the Agent Task Update |
| AgentId | Integer | The Id of the Agent this task was issued to |
| TaskId | Integer | The Id of the Agent Task associated with this update |
| TaskName | String | The name of the Agent Task associated with this update |
| Message | String | The contents of the update that will be returned to the console, for example the output from a command or a "completed successfully" message |
| Content | String | \[OPTIONAL\] Used for additional output for a task. Currently used for base64 encoded file contents when a task returns the content of a file |
| ContentId | String | \[OPTIONAL\] Used to identify the Content of a task, for example a file path. |
| Received | DateTime | When the update was received. |

## Console Message

A user submitted message

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The Id of the Console Message |
| AgentId | Integer | The Id of the Agent this task was issued to |
| AgentTaskId | Integer | The Id of the Agent Task associated with this update |
| UserId | Integer | The Id of the user that submitted this message. |
| Type | String | The type of message, for example HelpMessage, ShowMessage, AgentTask, or AgentTaskUpdate |
| Content | String | \[OPTIONAL\] The true content of the message. This comes into play when the API replaces a file reference with the base64 contents of a file. Otherwise, it should match Display or be Null |
| Display | String | What is displayed on the console in relation to this message |
| Received | DateTime | When the Console Message was received. |

## IOC \(Indicator of Compromise\)

An optional part of a Agent Task Update that details actions taken on a target

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The ID of the IOC |
| Description | String | Details of what was done on the host |
| Type | String | The type of IOC. Must be either File, Registry, URL, or Process |
| Identifier | String | An identifier for the IOC, for example file path or URL |
| Action | String | The action taken against the object being referenced. MUST be either Create, Access, Modify, Delete, GET, PUT, POST |
| Hash | String | \[OPTIONAL\] The SHA1 hash of the object |
| AgentTaskUpdateId | Integer | ID of the Agent Task Update that this IOC is associated with |
| Timestamp | DateTime | When the action took place |
| UserId | Integer | ID of the User responsible for the IOC |

## Staging Message

A message from a payload that registers an Agent

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The ID of the Staging Message |
| AgentName | String | The name of the agent that staging message is for |
| PayloadId | Integer | The Id of the Payload that created this Staging Message |
| PayloadName | String | The name of the Payload that created this Staging Message |
| StagingResponseId | Integer | The Id of the message sent in response to this Staging Message |
| HMAC | String | Base64 encoded HMAC for the encrypted message |
| IV | String | Base64 encoded IV for the encrypted message |
| Message | String | Base64 encoded encrypted message |
| Received | DateTime | When the Staging Message was received. |

## Staging Response

The response from Faction for a Staging Message. This contains an encrypted list of Agent Tasks that setup the agent \(Agent Name, Agent Password, etc\)

| Property | Type | Description |
| :--- | :--- | :--- |
| Id | Integer | The ID of the Staging Response |
| AgentId | Integer | The Id of the agent that staging response is for |
| StagingMessageId | Integer | The Id of the Staging Message that this response is in relation to |
| HMAC | String | Base64 encoded HMAC for the encrypted message |
| IV | String | Base64 encoded IV for the encrypted message |
| Message | String | Base64 encoded encrypted list of Agent Tasks |
| Created | DateTime | When the Staging Response was created. |
| Sent | Boolean | Whether the message has been sent or not |

