# The Faction C2 Framework

Faction is a C2 framework for security professionals, providing an easy way to extend and interact with agents. It focuses on providing an easy, stable, and approachable platform for C2 communications through well documented REST and Socket.IO APIs.

You can watch a demo of Faction [here](https://www.youtube.com/watch?v=gETAhgBJabI). Faction was released at Troopers 19, this presentation can be found [here](https://www.youtube.com/watch?v=NuAz6cfuEe4).

## What makes Faction special

Faction was developed with a heavy focus on being modular, allowing it to be flexible enough to serve a variety of needs. Because of this, there are few things about Faction that are different from a standard C2 platform.

1. While the Faction team has released a [.NET agent](https://github.com/maraudershell/Marauder) for Faction, is not _THE_ Faction agent. Faction was designed to interact with any agent that speaks its language. This means that you can easily create your own agent for Faction either for your internal team or the world at large.
2. You can create an entirely stand alone agent with all its functionality baked in, but agents greatly benefit when they can load Faction modules. These modules are stand alone libraries or code that bring new commands and features to an agent. An important aspect of Faction modules is that they are designed to be language specific, not agent specific. For example, any agent that can load the .NET runtime can leverage Faction's .NET modules.
3. In most engagements, you're not going to have your agents connecting back directly to your C2. Faction was designed with redirects in mind in the form of Transport Servers. Transport Servers sit between Faction and your agent and handle masking your communications, and since Faction is all API based, these servers can be written in whatever language you're most comfortable in.

