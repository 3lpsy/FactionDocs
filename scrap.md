### Modules
The primary way to develop for Faction is by creating modules. Modules extend Faction agents with new functionality such as commands and transport methods. Modules are developed according to a "Faction Language Standard" which defines how commands and transports for a given programming language behave.

More details on developing modules can be found [here](/docs/development/modules/)

### Transports
Transports sit between agents and Faction and serve to change the way Faction agent traffic works. Transports are designed to be simple and modular, making them easy to build. All a transport needs to worry about is passing a string between the agent and Faction API.

More details on developing transports can be found [here](/docs/development/transports/)

### Agents
Agents allow a Faction operator to interact with a computer. Agents can provide built-in functionality such as running commands and uploading files, and can also leverage Faction Modules for additional capabilities. 

More details on developing transports can be found [here](/docs/development/agents/)

