# Developing Faction Agents

Faction agents are designed to be light weight and modular, relying on Faction Modules for additional functionality. To this end, the requirements for a Faction agent are pretty light. Faction Agents are expected to support the following commands:

* SET: Used to update agent settings
* RUN: Used to execute tasks

If your agent is going to take advantage of Faction Modules, it needs to support the following:

* LOAD: Used to load modules
* USE: Used to activate transport modules

All messages are encrypted using AES256, with passwords that are unique to each established agent.

## Staging

Staging occurs when a payload reaches out to the Faction API and tries to establish an agent. During staging the following things happen:

1. The payload sends a json message of host data, encrypted using the payload encryption password. This message looks like:

   ```text
   {
   "StagingId": "A random string used to identify the staging message",
   "Username": "Username that the payload is running under",
   "Hostname": "Hostname of the computer",
   "OperatingSystem": "The operating system of the computer",
   "PID": "Current PID",
   "Admin": "True or False"
   }
   ```

2. A new agent is created in the Faction Database with the information provided
3. Faction creates a staging response, encrypted with the payloads password. It consists of the following agent tasks:

```text
SET Name:<agent_name>
SET Password:<agent_password>
SET BeaconInterval:<beacon interval from payload>
SET Jitter:<jitter from payload>
SET PayloadName:null
SET StagingId:null
```

The payload has now established an agent.

## Agent Checkin

1. Download Encrypted Tasks for the Faction API \(either directly, through a transport server, or both\)

   Agent Tasks are downloading during an [agent checkin](api.md#agent-checkin), the tasks are sent as base64 encoded string. This message looks something like this:

```text
{
  "AgentName": "<agent name>",
  "Message": "<base64 encoded AES encrypted message>",
  "IV": "<base64 encoded IV>",
  "HMAC": "<base64 encoded HMAC>"
}
```

1. Decrypt the message.

   Decrypting the message will result in a list of [agent tasks](schema.md#agent-task).

```text
{
  "Name": "<guid>",
  "Action": "The Type of task, either: RUN, LOAD, USE, or SET",
  "Command": "The command to execute, module to load/set, setting to configure, etc"
}
```

1. Process the task

   After processing the task, an [Agent Task Update](schema.md#agent-task-update) is created, detailing the outcome of processing the task.

```text
{
  "TaskName": "<guid of task>",
  "Message": "Result of the task, for example command output, or a 'completed' message. This is printed to the console as part of the task update.",
  "Content": "Optional. Additional content for the task, currently used for file contents in upload/download commands",
  "ContentId": "Optional. Used to identify the content above."
}
```

1. Add the Task Update to a list, and encrypt it. At checkin, any pending task updates should be gathered into a list and the list encrypted using the agents password.

   ```text
   {
   "AgentName": "<agent name>",
   "Message": "<base64 encoded AES encrypted message>",
   "IV": "<base64 encoded IV>",
   "HMAC": "<base64 encoded HMAC>"
   }
   ```

2. Post the message back to the Faction API

## Registering an Agent

Agents are registered by their languages build server. For more details on this process, see the section on [How Faction Builds Modules and Agents](development.md#how-faction-builds-modules-and-agents).

An example of a Marauder's `FactionAgent.dotnet.json` is below:

```text
{
  "Name": "Marauder",
  "Authors": [
    "The Faction Team"
  ],
  "Guid": "0000-0000-0001-FEED-ACDC",
  "OperatingSystems": [
    "Windows"
  ],
  "Architectures": [
    "x86",
    "x64"
  ],
  "Versions": [
    "NET35",
    "NET45"
  ],
  "Formats": [
    "Executable"
  ],
  "Configurations": [
    "Default",
    "Obfuscated"
  ],
  "BuildCommand": "python3 ./build.py",
  "BuildLocation": "./output/Marauder.exe",
  "AgentTransportTypes": [
    {
      "Name":"DIRECT",
      "TransportTypeGuid": "0000-0000-0000-0000-0000",
      "BuildCommand": "python3 ./Transports/DIRECT/build.py",
      "BuildLocation": "./output/Transports/DIRECT.dll"
    }
  ],
  "Commands": [
    {
      "Name": "tasks",
      "Description": "List tasks running in Marauder",
      "Help": "Marauder runs commands within .NET Tasks, this command returns a list of any Tasks being run. You can kill a task using the /kill:<task_name> parameter.",
      "OpsecSafe": "True",
      "Parameters": [
        {
          "Name": "Kill",
          "Required": "False",
          "Help": "Stop the specified Task name. Example: tasks /Kill:abc1"
        }
      ]
    },
    {            
      "Name": "exit",
      "Description": "Kills the Marauder agent",
      "Help": "Tasks Marauder to exit.",
      "OpsecSafe": "True",
      "Parameters": []
    }
  ]
}
```

