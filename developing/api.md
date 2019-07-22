# Faction API

Faction provides two ways to access its API, REST and SocketIO. REST leverages traditional HTTP verbs to perform actions against objects. SocketIO is a transport provided over Web Sockets to allow for real-time API access. It uses message types and JSON messages to perform actions.

{% hint style="info" %}
All parameter names for the Faction API are Case Sensitive
{% endhint %}

## Authenticating to the API

No matter the API calls you're using you'll need an API key to authenticate. API keys consist of a key ID and a secret and they can be used in the following ways:

* **Cookies:** Set the AccessKeyId and AccessSecret cookies
* **Header:** The format for this is `Authorization: token [base64 string]` where "base64 string" is the base64 value of \[AccessKeyId\]:\[AccessSecret\]
* **GET Parameter:** You can append your key ID and secret to a URL in the format of `?token=[AccessKeyId]:[AccessSecret]` 

## Logging into Faction

To interact with Faction, you'll need an API key. To get an API key, use the Login endpoint.

{% hint style="info" %}
The login endpoint is the only endpoint in Faction that will accept a username and password for authentication. All other endpoints need to use an API key.
{% endhint %}

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/login/" %}

{% api-method method="post" host="https://faction\_api\_url" path="/api/v1/login/" %}
{% api-method-summary %}
Login to Faction
{% endapi-method-summary %}

{% api-method-description %}
This method responds with a Session API key. This key will be revoked the next time you login.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-body-parameters %}
{% api-method-parameter name="Username" type="string" required=true %}
The username
{% endapi-method-parameter %}

{% api-method-parameter name="Password" type="string" required=true %}
The password
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
  "AccessKeyId": "<Access Key Name>", 
  "AccessSecret": "<Access Key Secret>", 
  "Success": true, 
  "UserId": <User ID>, 
  "UserRole": "<User Role>", 
  "Username": "<Username>"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% hint style="warning" %}
Whenever this endpoint is used, any previous Session API keys are invalided. Because of this you should **not** use the API key you receive from this endpoint in scripts or programs. Instead, create a new API key using the API key endpoint. This API key should be used by users Faction client \(for example, the Faction Console\)
{% endhint %}

## API Keys

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/user/:user\_id/apikey/" %}
{% api-method-summary %}
List API Keys for a User
{% endapi-method-summary %}

{% api-method-description %}
Returns a list of API keys
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="user\_id" type="integer" required=true %}
The User ID of the user you're getting API keys for
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Results": [
        {
            "Created": "2019-06-21T03:07:59.963250",
            "Id": 3,
            "LastUsed": "2019-07-02T20:59:41.395348",
            "Name": "PWjMrb2pi5qrzDbG",
            "Type": "SessionToken"
        },
        {
            "Created": "2019-07-02T20:21:25.972012",
            "Id": 6,
            "LastUsed": "2019-07-20T03:47:24.091207",
            "Name": "73hYjPhTc-ve5gGn",
            "Type": "Access"
        }
    ],
    "Success": true
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="post" host="https://faction\_api\_url" path="/api/v1/user/:user\_id/apikey/" %}
{% api-method-summary %}
Create a new API key
{% endapi-method-summary %}

{% api-method-description %}
This method allows you to create a new API key
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="user\_id" type="integer" required=true %}
The User ID of the user you're creating an API key for
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Id": API Key ID,
    "Name": "<API Key Name>",
    "Secret": "<API Secret>",
    "Success": true
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="delete" host="https://faction\_api\_url" path="/api/v1/user/:user\_id/apikey/:api\_key\_id/" %}
{% api-method-summary %}
Delete an API key
{% endapi-method-summary %}

{% api-method-description %}
The method disables a given API key
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="user\_id" type="integer" required=true %}
The User ID of the user you're getting an API key for
{% endapi-method-parameter %}

{% api-method-parameter name="api\_key\_id" type="integer" required=true %}
The ID of the API key
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Message": "Api Key <API Key Name> deleted",
    "Success": true
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Interacting with Agents

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/agent/:agent\_id/" %}
{% api-method-summary %}
Get Agent Details
{% endapi-method-summary %}

{% api-method-description %}
This method is used to request either an individual Faction agent, or a list of all agents.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_id" type="integer" required=false %}
The ID of the Agent
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text

```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="put" host="https://faction\_api" path="/api/v1/agents/:agent\_id/" %}
{% api-method-summary %}
Update an Agent
{% endapi-method-summary %}

{% api-method-description %}
Updates an Agent
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_id" type="integer" required=true %}
The ID of the Agent
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="Visibility" type="boolean" required=false %}
Whether the agent is visible in Faction or not
{% endapi-method-parameter %}

{% api-method-parameter name="Name" type="string" required=false %}
The name of the agent
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text

```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="delete" host="https://faction\_api" path="/api/v1/agents/:agent\_id/" %}
{% api-method-summary %}
Hide an Agent
{% endapi-method-summary %}

{% api-method-description %}
Hides the specified agent
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_id" type="integer" required=true %}
The ID of the Agent
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text

```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Agent Staging

{% api-method method="post" host="https://faction\_api" path="/api/v1/agent/:payload\_name/:staging\_id/" %}
{% api-method-summary %}
Stage an Agent
{% endapi-method-summary %}

{% api-method-description %}
This endpoint is used by a payload to register an Agent with Faction. The payload encrypts a json blob of system information using the payloads password. In response, Faction returns a series of tasks for the payload to run that set it up as an agent, including a new password that is used for all future communication.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="payload\_name" type="string" required=true %}
The name of the payload that is making the staging request
{% endapi-method-parameter %}

{% api-method-parameter name="staging\_id" type="string" required=true %}
This is a string generated by the payload that is used to identify the staging request in the future.
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="Message" type="string" required=true %}
The Base64 encoded, encrypted JSON blob of system information.
{% endapi-method-parameter %}

{% api-method-parameter name="TransportId" type="integer" required=true %}
The ID of the Transport server that made this request
{% endapi-method-parameter %}

{% api-method-parameter name="SourceIp" type="string" required=false %}
The External IP address that this request is coming from. Typically this is added by a Transport server so Faction knows the IP that this request came from. If this isn't specified, Faction will use the IP address from the API connection.
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
  "AgentName": "<The Staging Id>",
  "Message": "<Base64 encoded, encrypted JSON blob of AgentTasks>"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Agent Checkins

This endpoint is used by Transports and Agents when they check in. It handles returning encrypted tasks for agents and receiving encrypted task results from agents.

{% api-method method="get" host="https://faction\_url" path="/api/v1/agent/:agent\_name/checkin/" %}
{% api-method-summary %}
Get Agent Task Messages
{% endapi-method-summary %}

{% api-method-description %}
Returns a JSON string containing an base64 encoded, encrypted list of Agent Task Messages \(if any are avaiable\)
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_name" type="string" required=true %}
The name of the agent that you're receiving tasks for
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
  "AgentName": "<The Agent Name>",
  "Message": "<Base64 encoded, encrypted JSON blob of AgentTasks>"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="post" host="https://faction\_url" path="/api/v1/agent/:agent\_name/checkin/" %}
{% api-method-summary %}
Upload Agent Task Response
{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_name" type="string" required=true %}
The name of the agent that the message is coming from
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="Message" type="string" required=true %}
The base64 encoded, encrypted JSON blob of Agent Task Response messages
{% endapi-method-parameter %}

{% api-method-parameter name="TransportId" type="integer" required=true %}
The ID of the Transport handling this request
{% endapi-method-parameter %}

{% api-method-parameter name="SourceIp" type="string" required=false %}
The external IP address for the agent, else the IP of the transport is used. If this field is not populated, Faction will use the IP address from the connection.
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
  "AgentName": "<The Agent Name>",
  "Message": "<Base64 encoded, encrypted JSON blob of AgentTasks>"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Agent Tasks

Used to get existing agent tasks. If you need to create a new agent task, use the [Console \(Agent\) API endpoint](api.md#console-message-agent).

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/task/:task\_id/" %}
{% api-method-summary %}
Get Agent Tasks
{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="task\_id" type="string" required=false %}
If specified, returns a single task matching that ID
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Results": [
        {
            "Action": "<Task Action>",
            "AgentId": <Agent ID>,
            "AgentName": "<Agent Name>",
            "Command": "<Task Command>",
            "Complete": <Has the Task Completed: Boolean>,
            "Created": "<ISO 8601 Date Time>",
            "Id": <Task ID>,
            "Success": <Was the Task Successful: Boolean>,
            "Updates": [
                {
                    "Complete": <Boolean>,
                    "Message": "<Task Output>",
                    "Received": "<ISO 8601 Date Time>",
                    "Success": <Boolean>
                }
            ],
            "Username": "<Username that issued the task>"
        }
    ],
    "Success": true
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Console Message \(Agent\)

This endpoint is used for to issue commands against a Faction agent

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/agent/:agent\_id/console/" %}
{% api-method-summary %}
Get Console Messages
{% endapi-method-summary %}

{% api-method-description %}
Retrieve a list of console message from this agent. This includes messages from users \(for example when they type a command\) and responses from the agent \(what is displayed from that command\)
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_id" type="integer" required=true %}
The Agent ID
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Returns a list of Console Messages.
{% endapi-method-response-example-description %}

```text
{
    "Results": [
        {
            "AgentId": <Agent Id>,
            "Content": "<Raw Content, used for file uploads",
            "Display": "<Message to display to user>",
            "Received": "<ISO 8601 Date Time>",
            "Type": "<Message Type>",
            "UserId": <User Id that issued the message>,
            "Username": "<User name that issued the message>"
        }
    ],
    "Success": true
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="post" host="https://faction\_api\_url" path="/api/v1/agent/:agent\_id/console/" %}
{% api-method-summary %}
Send a Console Message
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to send a command to an agent
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="agent\_id" type="integer" required=true %}
The ID of the agent you're sending a command to
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="Content" type="string" required=true %}
The command being sent to the agent
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "AgentId": <Agent ID>,
    "Content": "<Raw Command Content>",
    "Display": "<Display Friendly Command>",
    "UserId": <User ID>
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Console Message \(Agent Task\)

This endpoint returns all of the console messages associated with a given task.

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/task/:task\_id/console/" %}
{% api-method-summary %}
Retrieve a Console Message for a Task
{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="task\_id" type="integer" required=true %}
The ID of the Agent Task that you're getting the console message for.
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Results": [
        {
            "AgentId": <Agent ID>,
            "Content": "<Raw Task Content>",
            "Display": "<Display Friendly Content>",
            "Received": "ISO 8601 Date/Time",
            "Type": "<Message Type>",
            "UserId": <User ID>,
            "Username": "<Username>"
        },
        {
            "AgentId": <Agent ID>,
            "Content": "<Raw Task Content>",
            "Display": "<Display Friendly Content>",
            "Received": "ISO 8601 Date/Time",
            "Type": "<Message Type>",
            "UserId": <User ID>,
            "Username": "<Username>"
        }
    ],
    "Success": true
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Transports

{% api-method method="get" host="https://faction\_api\_url" path="/api/v1/transport/:transport\_id/" %}
{% api-method-summary %}
Get Transport Information
{% endapi-method-summary %}

{% api-method-description %}
This method returns information about a given Transport. If no Transport ID is provided, a list of all transports is returned.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="transport\_id" type="integer" required=false %}
The ID of the Transport
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Results": [
        {
            "ApiKeyId": <API Key Id>,
            "ApiKeyName": "<API Key Name>",
            "Configuration": "<Agent Configuration>",
            "Created": <ISO 8601 Date/Time>,
            "Enabled": <Boolean>,
            "Guid": "<Transport GUID>",
            "Id": <Transport ID>,
            "LastCheckin": <ISO 8601 Date/Time>,
            "Name": "<Transport Name>",
            "TransportType": "<Transport Type>",
            "Visible": <Boolean>
        }
    ],
    "Success": "True"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="post" host="https://faction\_api\_url" path="/api/v1/transport/" %}
{% api-method-summary %}
Create a Transport
{% endapi-method-summary %}

{% api-method-description %}
Creates a Transport and returns an API key for use by the Transport Server
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-body-parameters %}
{% api-method-parameter name="Name" type="string" required=false %}

{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "ApiKey": {
        "KeyName": "<API Key Name>",
        "Secret": "<API Secret>"
    },
    "Success": true,
    "Transport": {
        "ApiKeyId": <API Key Id>,
        "ApiKeyName": "<API Key Name>",
        "Configuration": null,
        "Created": "<ISO 8601 Date/Time>",
        "Enabled": <Boolean>,
        "Guid": null,
        "Id": <Transport Id>,
        "LastCheckin": null,
        "Name": "<Transport Name>",
        "TransportType": null,
        "Visible": true
    },
    "TransportId": 3
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="put" host="https://faction\_api\_url" path="/api/v1/transport/:transport\_id/" %}
{% api-method-summary %}
Update a Transport
{% endapi-method-summary %}

{% api-method-description %}
This method is used to update a transport, it is used by transport servers to register with Faction.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="transport\_id" type="integer" required=true %}
The ID of the Transports
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="Name" type="string" required=false %}
User provided name of the Transport
{% endapi-method-parameter %}

{% api-method-parameter name="TransportType" type="string" required=false %}
The type of Transport
{% endapi-method-parameter %}

{% api-method-parameter name="Guid" type="string" required=false %}
The GUID for the Transport. This should also be the same. It is used to map transport modules to transports.
{% endapi-method-parameter %}

{% api-method-parameter name="Configuration" type="string" required=false %}
The configuration used by agent transport modules. This is passed to the build script when the transport module is built.
{% endapi-method-parameter %}

{% api-method-parameter name="Enabled" type="boolean" required=false %}
Determines whether the Transport is enabled or not.
{% endapi-method-parameter %}

{% api-method-parameter name="Visible" type="boolean" required=false %}
Determines whether the Transport shows up in the Faction UI, if set to False "Enabled" is also set to False
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Success": true,
    "Transport": {
        "ApiKeyId": <API Key Id>,
        "Configuration": "<Agent Configuration>",
        "Enabled": <Boolean>,
        "Guid": "<Transport GUID>",
        "Id": <Transport ID>,
        "Name": "<Transport Name>",
        "TransportType": "<Transport Type>",
        "Visible": <Boolean>
    }
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="delete" host="https://faction\_api\_url" path="/api/v1/transport/:transport\_id/" %}
{% api-method-summary %}
Remove a Transport
{% endapi-method-summary %}

{% api-method-description %}
Hides and disables a Faction transport
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="transport\_id" type="integer" required=false %}
The ID of the Transport
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{
    "Success": true,
    "Transport": {
        "ApiKeyId": <API Key ID>,
        "Created": "<ISO 8601 Date/Time>",
        "Enabled": false,
        "Id": <Transport Id>,
        "Name": "<Transport Name>",
        "Visible": false
    }
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

