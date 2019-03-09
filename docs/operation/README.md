# Using Faction
After installing Faction, you'll be presented with the URL, Admin Username, and Password for accessing the console. If you need to access this information later, it is stored in `/opt/faction/global/config.json`. 

## Transports
The first thing you'll want to do is setup a transport. By default, Faction comes with one transport configured: DIRECT. This transport allows payloads to connect directly to Faction which is fine for testing, but not a great idea for an actual engagment.

Navigate to the Transports tab and click "New Transport". Provide a description for the Transport and you'll be given a Transport ID, Access Key Name, and Access Key Secret. The transport you're configuration should provide documentation on what to do with this information. If you're using the HTTP Transport, you can find that information here.

Once the Transport is configured, it will show up as an available Transport in Faction

## Payloads
Payloads are run on targets to establish an Agent. They control the initial settings for an agent, such as beacon interval, jitter, transports, and expiration dates. Payloads use the same password to stage an agent, as part of the staging process an agent gets its own password for communications.

On the Payloads tab, you have the option to create a new payload. The following options are required:

* **Agent Type:** This is the type of agent that the payload will spawn
* **Agent Format:** This is the format that the payload will be built in
* **Agent Transport:** This is the initial transport that the payload will use to stage the agent and beacon
* **Beacon Interval:** The number of seconds between beaconing. This needs to be a whole number.
* **Jitter:** Introduces randomness into to the beacon interval. This is determined by multiplying the beacon interval by the jitter value, taking the result and adjusting the beacon interval by a random amount up to that result. For example, a beacon interval of 10 seconds with a jitter of 0.2 would beacon randomly between 8 and 12 seconds. Values between 0.0 and 1.0 are accepted.

## Agents
Once a Payload stages, it becomes an agent. Agents allow you to interact with the target system. 

On the Agents tab, click on an agent to interact with it. The console that you presented with allows you to interact with you agent. The following commands will help you get your bearings:

* `show modules`
* `show commands`
* `help`
* `help [command name]`

Faction agents are extensible through modules that provide additional commands. To load a module, use the `load [module name]` command.  

## Uploading Files

## Creating Users

## Generating API Keys
