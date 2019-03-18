# Faction Agents

By design, there are no "official" agents for Faction, instead it provides a standard that it expects agents to adhere to.

Agents are expected to support the following commands:
* SET: Used for updating settings
* RUN: Used to run tasks

Optionally, agents can support:
* LOAD: Used to load modules
* USE: Used to activate agent transports

The following settings are expected to be available:
* BeaconInterval: How many seconds between agent checkins
* Jitter: Value that repressents the range of randomness to introduce. For example, a BeaconInterval of 10 seconds with a Jitter of 0.2 would mean the agent would pick a checkin time randomly between 8 and 12 seconds.

