---
layout: post
current: post
cover: 'assets/images/covers/dotnet.jpg'
navigation: True
title: Getting started with DotNet Core
date: 2018-05-27 09:00:00
tags: dotnet
class: post-template
subclass: 'post tag-coding'
author: xavier
---

I wanted to get started with Machine Learning, but rather than using Tensorflow, I wanted to take a different approach and use [ML.NET](https://github.com/dotnet/machinelearning). Now you might ask yourself: "Why use .NET if you have something such as Tensorflow?". Well to be very blunt, I am a programmer by heart and I just detest Python :D. (I know, I know, very biased, but sorry it's just the truth ;) even though I could learn Python and transfer all my conceptual knowledge to it, I rather want to try something else and go the .NET way).

To summarize my setup that I am working on for this article, it looks something like this:

* Ubuntu WSL (use `wslconfig.exe /l` to view your distros, use `do-dist-upgrade` to upgrade your distro)
* VSCode

## Installing .NET Core on Ubuntu WSL

Since I am a fan of the WSL, I prefer to do everything in WSL rather than in windows. Why? It's just easier to use Linux commands most of the time, and seeing that I am coming from a Node world, I am used to it.

Let's get started installing .NET Core. This is quite easy, seeing that we just have to follow the original guide written by the Microsoft team (see references).

```bash
# Register Microsoft key & Feed
wget -q packages-microsoft-prod.deb https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb

# Generic
sudo apt-get install -y apt-transport-https
sudo apt-get update

# Install dotnet core Runtime
sudo apt-get install -y dotnet-runtime-2.0.7

# Install dotnet core SDK
sudo apt-get install -y dotnet-sdk-2.1.200
```

## Testing our installation and creating our first Hello World application

To test our installation, follow the commands below to create our first program

```bash
# Create a new console application project
# This will create our project file + dependencies to build the console app
# It also creates a Program.cs entry file
dotnet new console

# Download our NuGet packages
dotnet restore

# Run the application
dotnet run
```

We can also manually build and run our application, which gives us a faster execution time once it's build. To do this, utilize the following steps:

```bash
# Build the application
dotnet build

# Navigate to our Output dir defined in bin/Debug/netcoreapp2.0/HelloWorld.dll
# Run the application
dotnet HelloWorld.dll
```

Whereafter we can now see the following output:

```bash
Hello World!
```

If you followed everything correctly, you should have something like this in your terminal:

![./assets/images/posts/dotnetcore-helloworld.png](./assets/images/posts/dotnetcore-helloworld.png)

## FAQ

**Q:** When installing, I get an error regarding unmet dependencies.

**A:** Run `lsb_release -a` and see your ubuntu version. Then check [https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x) for the installation commands for your version.

## References

* [Installing .NET Core](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x)