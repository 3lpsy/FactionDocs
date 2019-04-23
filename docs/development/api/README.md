# Faction API
Faction provides two ways to access its API, REST and SocketIO. REST leverages traditional HTTP verbs to perform actions against objects. SocketIO is a transport provided over Web Sockets to allow for real-time API access. It uses message types and JSON messages to perform actions.

## Authentication
No matter the API you're using you'll need an API key to authenticate. API keys consist of a key ID and a secret and they can be used in the following ways:

* AccessKeyId and AccessSecret Cookies
* The Authorization Header. The format for this is `Authorization: token [base64 string]` where "base64 string" is the base64 value of [AccessKeyId]:[AccessSecret]
* Token GET parameter. You can append your key ID and secret to a URL in the format of `?token=[AccessKeyId]:[AccessSecret]` 

## Getting an API key
### Logging in with a username and password to get an API key.
You can post your username and password to /api/v1/login/ to get a session token API key. Its important to note that this key will be invalidated the next time your username and password is used against this endpoint.

::: tip
The login endpoint is the only endpoint in Faction that will accept a username and password for authentication. All other endpoints need to use an API key.
:::

Example:
```
curl -X POST -H "Content-Type: application/json" -d '{"Username":"USERNAME","Password":"PASSWORD"}' http://127.0.0.1:5000/api/v1/login/

{
  "AccessKeyId": "EpmuoqLMgnkm0olE", 
  "AccessSecret": "BgsbKv_TByiZHcgzqjKdJMjWe8lS2xa4_aGAAPAVdpAg4_Ef_NAm_lWdHCYw-RIF", 
  "Success": true, 
  "UserId": 2, 
  "UserRole": "admin", 
  "Username": "admin"
}
```

### Creating a new, permanent API key
If you need a long lasting API key, you can use the /api/v1/user/[user id]/apikeys endpoint.

Example:

```
curl -X POST http://127.0.0.1:5000/api/v1/user/2/apikeys/?token=API_KEY_ID:API_SECRET
{
  "Id": 4, 
  "Name": "qxkm2ey8GGBw9ur4", 
  "Secret": "GA8E1mCrlcgpB-BuqXBGYJP_qQbhVXYev2H9VNjtG39M-0FJQFUvcdNJ9GezIoRC", 
  "Success": true
}

```

# Endpoints
It is assumed that all endpoints listed here begin with `/api/v1/`

::: tip
All parameters names are Case Sensitive
:::

## Agent
This endpoint is used to manage Faction agents

### GET /agent/
Returns a list of all agents.

### GET /agent/[agent_id]/
Returns the given agent

### PUT /agent/[agent_id]/
Updates an agent. Valid parameters are:

|Parameter  | Description                                    |
|-----------|------------------------------------------------|
|Name       | The name of the agent                          |
|Visibility | Whether the agent is visible in Faction or not |

### DELETE /agent/[agent_id]
Hides the given agent

## Agent Checkin
This endpoint is used by Transports and Agents when they check in. It handles returning encrypted tasks for agents and receiving encrypted task results from agents.

### GET /agent/[agent_name]/checkin/
Returns a JSON string containing the agent name and a base64 encoded list of [Agent Task Messages]

## Task
### GET /task/
Returns a list of all agent tasks

### GET /task/[task_id]/
Returns the given task

## Console Message
### GET /agent/[agent_id]/console/
Returns a lists of all console messages associated with this agent id

### GET /agent/[agent_id]/console/[console_message_id]
Returns the given console message

### POST /agent/[agent_id]/console/
Send a new console message

|Parameter  | Description                                    |
|-----------|------------------------------------------------|
|Content    | The console message to send                    |
