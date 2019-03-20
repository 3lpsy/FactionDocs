# .NET Faction Language Standard
.NET modules leverage the [Faction.Modules.Dotnet.Common](https://github.com/FactionC2/Faction.Modules.Dotnet.Common) library to help make developing easier. This library provides objects to inhereit and edit for your needs.

Some general notes on building a Faction .NET module:
* Modules main entry point should be in the `Faction.Modules.Dotnet` namespace
* Modules must implement either a `GetCommands` or `GetTransports` method in the `Faction.Modules.Dotnet` namespace that returns a list of Command or Transport objects.

## Commands
.NET commands inhiert from the "Command" object. When a command is executed, it leverages the 'Execute' method of its command object. The 'Execute' command is passed a `Dictionary<string, string>` of parameters for the command. Details are how to register parameters are covered later in this document.

The 'Execute' method of the command object is expected to return a 'CommandOutput' object. This object is provided by the common library and includes:

* Complete: Boolean. Did the command complete?
* Success: Boolean. Was the command successful?
* Message: String. Output from the command. This will be displayed on the console.
* Type: String. This is used to differentiate between command output types. Right now, Faction only recoginizes one type: 'File'. Everything else is assumed to be output from a regular command.
* ContentId: String. Currently, this is only used for output that contains a file. The ID for this content is its file path.
* Content: String. Currently, this is only used for output that contains a file. Content is the base64 encoded byte array of the file's contents.

### Implementation Notes
* Commands must be in the `Faction.Modules.Dotnet.Commands` namespace
 

### Examples

Here is a simple example of implementing a 'Change Directory' command as a .NET command for Faction

```C#
using System;
using System.IO;
using System.Collections.Generic;
using Faction.Modules.Dotnet.Common;

namespace Faction.Modules.Dotnet.Commands
{
  class ChangeDirectory : Command
  {
    public override string Name { get { return "cd"; } }
    public override CommandOutput Execute(Dictionary<string, string> Parameters = null)
    {
      CommandOutput output = new CommandOutput();
      try
      {
        string path = Parameters["Path"];
        Directory.SetCurrentDirectory(path);
        output.Complete = true;
        output.Success = true;
        output.Message = $"Current directory is now: {path}";

      }
      catch (Exception e)
      {
        output.Complete = true;
        output.Success = false;
        output.Message = e.Message;
      }
      return output;
    }
  }
}
```

Below is an example of an "Upload" command, demonstrating working with file content as part of a command.

```C#
using System;
using System.IO;
using System.Collections.Generic;
using Faction.Modules.Dotnet.Common;

namespace Faction.Modules.Dotnet.Commands
{
  class Upload : Command
  {
    public override string Name { get { return "upload"; } }
    public override CommandOutput Execute(Dictionary<string, string> Parameters = null)
    {
      CommandOutput output = new CommandOutput();
      
      string path = Path.GetFullPath(Parameters["Path"]);
      long length = new FileInfo(path).Length;
      output.Complete = true;

      // hard limit of 300mb for file uploads. Because of the b64 we have to do, this would inflate to like 500mb
      if (length > 314572800)
      {
        output.Message = $"File size of {length} is over the 300mb limit of uploads.";
        output.Success = false;
      }
      else
      {
        byte[] fileBytes = File.ReadAllBytes(path);
        output.Success = true;
        output.Message = $"{path} has been uploaded";
        output.Type = "File";
        output.Content = Convert.ToBase64String(fileBytes);
        output.ContentId = path;
      }
      return output;
    }
  }
}
```

Faction's console is smart enough to render a list of objects in the CommandOutputs Message parameter as a table. To leverage this functionality, use Newtonsoft.Json (or another method) to render a list of objects to a json list. The example below uses a custom "FileResult" object and Newtonsoft.Json to return a list of files to Faction.

```C#
using System;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;
using Faction.Modules.Dotnet.Common;

namespace Faction.Modules.Dotnet.Commands
{
  class F2File
  {
    public string Name;
    public string Type;
    public long? Length;
    public DateTime LastAccessTime;
    public DateTime LastWriteTime;
  }

  class ListFiles : Command
  {
    public override string Name { get { return "ls"; } }
    public override CommandOutput Execute(Dictionary<string, string> Parameters=null)
    {
      CommandOutput output = new CommandOutput();
      string pwd = Directory.GetCurrentDirectory();
      if (Parameters.ContainsKey("Path"))
      {
        pwd = Parameters["Path"];
      }

      try
      {
        string[] entries = Directory.GetFileSystemEntries(pwd);
        List<F2File> results = new List<F2File>();

        foreach (string entry in entries)
        {
          F2File f2File = new F2File();
          FileAttributes attr = File.GetAttributes(entry);
          if ((attr & FileAttributes.Directory) == FileAttributes.Directory)
          {
            f2File.Type = "Directory";
            f2File.Name = new DirectoryInfo(entry).Name;
            f2File.Length = null;
            f2File.LastAccessTime = Directory.GetLastAccessTimeUtc(entry);
            f2File.LastWriteTime = Directory.GetLastWriteTime(entry);
          }
          else
          {
            f2File.Type = "File";
            f2File.Name = Path.GetFileName(entry);
            f2File.Length = new FileInfo(entry).Length;
            f2File.LastAccessTime = File.GetLastAccessTimeUtc(entry);
            f2File.LastWriteTime = File.GetLastWriteTimeUtc(entry);
          }
          results.Add(f2File);
        }

        output.Complete = true;
        output.Success = true;
        output.Message = JsonConvert.SerializeObject(results);
      }
      catch (Exception e)
      {
        output.Complete = true;
        output.Success = false;
        output.Message = e.Message; 
      }
      return output;
    }
  }
}
```

### Registering Commands with Faction
To register a command, create a "FactionModule.dotnet.json" file in the root of your modules directory. This file defines what commands are available in your module and their associated parameters. An example of a json file containing the 'cd' and 'upload' commands from above follows:

```JSON
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

### Implementation Notes
* The BuildCommand is run on the Faction build server and is used to build the module. This is only required if your module should be rebuilt each time its loaded.
* The BuildLocation parameter is used to tell faction where to find the module. If you specifiy a build command, the resulting file should end up at this location.
* A more complete FactionModule.dotnet.json file, demonstrating more options that are available within the file can be found [here](https://github.com/FactionC2/Modules-Dotnet/blob/master/StandardLibrary/FactionModule.dotnet.json).


## Installing a Module
The Faction .NET Build Server will scan subfolders in `/opt/faction/modules/dotnet/` for files named `FactionModule.dotnet.json`. To install your module, simply create a new folder under this directory and make sure that your JSON file along with any other build files are in this new directory.