# Developing Faction Modules

The primary way to develop for Faction is by creating modules. Modules extend Faction agents with new functionality such as commands and transport methods. Modules are developed according to a "Faction Language Standard" which defines how commands and transports for a given programming language behave.

## Faction Language Standards

* [.NET](dotnet.md)

## Registering Modules with Faction

Build Servers will search `/opt/faction/modules/` for `FactionModule.[LANGUAGE].json` files. These files define what commands are available in your module and their associated parameters. To install your module, create this file in the root of your modules directory, and place that directory under `/opt/faction/modules`. When the associated build server is restarted, your module should be imported into Faction.

An simple example of a `FactionModules.dotnet.json` file containing the 'cd' and 'upload' commands from above is below. A more complete FactionModule.dotnet.json file that demonstrates more options can be found [here](https://github.com/FactionC2/Modules-Dotnet/blob/master/StandardLibrary/FactionModule.dotnet.json).

```javascript
{
    "Name": "stdlib",
    "Description": "Standard Library for Dotnet",
    "Authors": [
        "The Faction Team"
    ],
    "Commands": [
        {
            "Name": "cd",
            "Description": "Change the directory you're operating out of",
            "Help": "You must include a path by either listing it after the command (`cd C:\\Foo`) or with the path parameter (`cd /path:C:\\Foo`)",
            "OpsecSafe": "True",
            "Parameters": [
                {
                    "Name": "Path",
                    "Required": "True",
                    "Position": 0,
                    "Help": "The path to change to"
                }
            ]
        },
        {
            "Name": "ls",
            "Description": "List the contents of a directory or path",
            "Help": "You can include a path by either listing it after the command (ls C:\\Foo) or with the path parameter (ls /path:C:\\Foo)",
            "OpsecSafe": "True",
            "Parameters": [
                {
                    "Name": "Path",
                    "Required": "False",
                    "Position": 0,
                    "Help": "The path to list"
                }
            ]
        },
    {
            "Name": "upload",
            "Description": "Upload a file from an agent to Faction",
            "Help": "Converts the specified file (using the Path parameter) to a base64 encoded string and sends it back to faction where it is converted back and written to disk. Note: There is a 300mb limit on files that can be uploaded to Faction.",
            "OpsecSafe": "True",
            "Parameters": [
                {
                    "Name": "Path",
                    "Required": "True",
                    "Position": 0,
                    "Help": "Path to the file to upload to Faction."
                }
            ]
        }
    ],
    "BuildLocation": "./Builds/Debug/stdlib.dll"
}
```

