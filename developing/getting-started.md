# Getting Started

Because Faction is a designed as a series of micro-services, configuring the development environment can be a little complicated.

An important thing to remember is that every service communicates over RabbitMQ and Postgres, so no matter what you're doing you'll need these services running. The easiest way to do this is through the Faction CLI's setup commands \(detailed below\). This design does mean that you can work on one service, while the others are running in a container as they would in production.

### Setting up your development environment

There are essentially **three** ways you can setup a Faction development environment. The first example will be a pure development environment that doesn't rely on any containerized services. The second will environment will be all containerized services, and then you'll selectively shutdown the services that you're developing. This second way leverages FactionC2's CLI and provides an API for you to manage your services. The final way is via the experimental FactionCompose project.

If you're not working on Faction itself, but instead are developing modules, agents, transports, etc. You'll probably want to use containerized services so that the environment you're working with is as close to production as possible. Alternatively, if you are familiar with Docker Compose (and associated pitfalls surrounding networking and volumes) you can use the FactionCompose project.

#### Install development dependencies

If doing development on an Ubuntu 18.04 LTS system, the following packages are required \(for setup to complete\):

- python3
- python3-dev
- python3-pip
- python3-setuptools
- build-essential
- pipenv

They can be installed via the following command:

```text
sudo apt update
sudo apt install python3 python3-dev python3-pip python3-setuptools build-essential
sudo pip3 install pipenv
```

#### Clean Environment \(No Containers\)

1. Clone the following repositories to your computer

   ```text
   git clone https://github.com/FactionC2/CLI
   git clone https://github.com/FactionC2/Core
   git clone https://github.com/FactionC2/API
   git clone https://github.com/FactionC2/Build-Service-Dotnet
   git clone https://github.com/FactionC2/Console
   ```

2. From the CLI directory, run `sudo python setup.py install` to install the Faction CLI
3. Setup Faction by running `faction setup --dev --external-address http://factionc2:5000`
4. Setup will install just the RabbitMQ and PostgreSQL instances for Faction, it will then pause so you can apply the database schema
5. Add the following entries to your hosts file

   ```text
   127.0.0.1 api
   127.0.0.1 factionc2
   127.0.0.1 db
   127.0.0.1 mq
   ```

6. From the Faction Core directory, run the following commands:

   ```text
   # This has to be done once, and then you only have to
   # run this again if you change the database schema
   dotnet ef migrations add 'Initial'
   # This applies the database schema to PostgreSQL
   dotnet ef database update
   ```

7. Once the database schema has been applied, return to `faction setup` and press `enter` to resume setup
8. From the Build-Service-Dotnet directory, run the following command to start the build server: `dotnet run`. The build server will start, and should import any agents and modules found in `/opt/faction/`
9. From the Core directory, run the following command to start the Core service: `dotnet run`
10. From the API directory, run the following commands to start the API service:

    ```text
    pipenv install
    pipenv shell
    python app.py
    ```

11. From the Console directory, run the following commands to start the Console application:

    ```text
    npm install
    npm run dev
    ```

#### Containerized Dev Environment via Faction CLI

1. Run through the normal [install process](../docs/docs.md#installing-faction)
2. Clone any Faction services repos that you plan on working on.
3. Stop the service that you'd like to develop for with: `docker stop <service_name>`, for example: `docker stop faction_core_1`.
4. Start the service that you're working on as detailed above.

#### Containerized Dev Environment via FactionCompose \(Experimental\)

The FactionCompose is an **unofficial** FactionC2 project that aims to minimize the number of times you have to either rebuild or restart your containers. It makes heavy use of volumes and environment variables to accomplish this. While the base install will be useful for development, it is expected that you'll be able to modify the docker-compose.yml file depending on which component you are working on. In its current state, FactionCompose is **not meant to be used in production** and all containers are required to be built locally. The following instructions assume you have Docker and Docker Compose installed.

1. Make a parent folder to hold all the FactionC2 repos:

   ```text
   mkdir ~/Development/factionc2
   ```

2. Clone the FactionCompose repo into the newly created parent directory:

   ```text
   git clone git@github.com:3lpsy/FactionCompose.git ~/Development/factionc2/Compose
   ```

3. This setup.sh script will clone all the FactionC2 repositories into the parent directory. If you are working with forks of the FactionC2 repos, you can reference the [Readme](https://github.com/3lpsy/FactionCompose) on the FactionCompose github page to change the repo owner. Run the setup.sh script:

   ```text
   cd ~/Development/factionc2/Compose
   REPO_BRANCH=development ./setup.sh
   ```

4. The setup.sh script will have cloned the necessary repositories and created a target.source file containing variables pointing to important directories. These variables are referenced in the docker-compose.dev.yml file. Before doing anything, review the default docker-compose.dev.yml file and ensure it contains appropriate values for how you wish to run the project.

5. With the proejct setup, you can now use the compose.sh file to build and run the project.

   ```text
   ./compose.sh dev build
   ./compose.sh dev up
   ```

If using the default volumes and settings, changes to files on the host should trigger a restart of the service within the container which will load the updated source code. How each container handles this process differs slightly and sometimes a rebuild or restart will be required. While Core, Build-Service-Dotnet, and the API should automatically refresh, the Console application will not as it relies on running `npm run watchdev` on the host in order to sync the web app frontend to the Nginx root directory. If Console is not being synced via the above npm command, the container will just use the assets created when the image was built. The Marauder and Modules-Dotnet projects are synced as volumes on the Build-Service-Dotnet container. However, if new modules or settings are added, the container may need to be restarted so it can populate the database.

In addition, if you wish to do development on Faction.Common, you will need to build the DLL on the host using `dotnet build`. Then you will need to change the PROJECT.csproj in either the Core or Build-Service-Dotnet projects to reflect that you wish to use the locally compiled Faction.Common DLL.

```text
    <!-- This needs to be commented out to use the local version -->
    <!-- <PackageReference Include="Faction.Common" Version="2020.1.19-beta" /> -->

    <!-- This needs to be uncommented to use local versions of the common library -->
    <Reference Include="Faction.Common">
      <HintPath>../Faction.Common/bin/Debug/netstandard2.1/Faction.Common.dll</HintPath>
    </Reference>
```

After modifying the PROJECT.csproj file, will want to uncomment the lines in the docker-compose.dev.yml file which sync the local DLL. To restart the Core or Build-Dotnet-Service containers, you can either just make a change in any file and save it (assuming you're using the `DOCKER_RUN_TARGET=watch` option) or restart the container manually using Docker Compose.

Finally, the application in its default state makes no effort to save data or state after containers have been destroyed. However, Core will populate some basic data based on environment variables at runtime. If you wish to always destroy and recreate the project when run, you can use the following command:

```text
./compose.sh dev fresh
```

**Please report bugs in the FactionCompose project to the FactionCompose repository**

### How Faction Builds Modules and Agents

Modules and Agents leverage [Build Servers](../docs/components.md#build-servers) to compile the artifacts that Faction is expecting. Build Servers by design are pretty simple, there are two things you need to be familiar with:

#### Registration

When a build server starts up, it searches for the following:

- `FactionAgent.<language_name>.json` in `/opt/faction/agents/`
- `FactionModule.<language_name>.json` in `/opt/faction/modules/<language_name>/`

For example, the .NET build server looks for `FactionAgent.dotnet.json` and `FactionModule.dotnet.json`.

These files provide the build server with all the information it needs to register the package with Faction. Details on these files can be found in the development sections for [Agents](agents.md) and [Modules](modules/).

{% hint style="info" %}
Note that TRANSPORT MODULES are registered as part of the AGENT configuration. This may change in the future, but for now it makes sense that transport modules are agent specific.
{% endhint %}

#### Building

When a request comes in for a build server to build something, it references the `BuildCommand` and `BuildLocation` parameters from the configuration for the object. The `BuildCommand` tells Faction what command to run to build the artifact, the `BuildLocation` tells Faction where to pick up the artifact when its built.

When a Faction Build Server runs a BuildCommand, it will provide the command with a path to a Build Configuration file. This file is json file looks like this:

```text
{
  "PayloadName": "<staging key name>",
  "PayloadKey": "<staging password>",
  "InitialTransportType": "<initial transport module name>",
  "TransportModule": "<base64 enccoded transport module>",
  "BeaconInterval": <integer representing beacon period in seconds>,
  "Jitter": <jitter value between 0.0 and 1.0>,
  "ExpirationDate": "<ISO 8601 UTC Date>",
  "Architecture": "<x86|x64>",
  "OperatingSystem": "<Windows|MacOS|Linux>",
  "Configuration": "<Agent provided configuration names>",
  "Version": "<Language Version>",
  "Debug": <true|false>,
  "TransportConfiguration": "<configuration provided by transport server>"
}
```

So for example, if you provide a build command of `python build.py`, when the Build Server builds this object, it will execute `python build.py /tmp/tmpfilename` where `/tmp/tmpfilename` is the contents of the build configuration.

An example of how to handle this can be found in Marauder's github repo:

- [Marauder Build Script](https://github.com/maraudershell/Marauder/blob/master/build.py)
- [Marauder DIRECT Transport Build Script](https://github.com/maraudershell/Marauder/blob/master/Transports/DIRECT/build.py)

### Accessing Postgres and RabbitMQ

During install, a random password is created for Postgres and RabbitMQ. You can find these passwords in the Faction config file at `/opt/faction/global/config.json`
