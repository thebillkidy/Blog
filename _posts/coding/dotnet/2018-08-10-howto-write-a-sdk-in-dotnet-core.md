---
layout: post
current: post
cover: 'assets/images/covers/dotnet.jpg'
navigation: True
title: How-To write a C# SDK in .NET Core
date: 2018-08-10 09:00:00
tags: coding coding-dotnet
class: post-template
subclass: 'post'
author: xavier
---

For interacting with OpenAI through C#, I decided to write one myself. But how do we get started writing a SDK?

## Getting started writing our SDK

### Deciding on the structure of your SDK

First of all we need to decide on how we want to use it. This is a crucial step, since it will notate how easy it is to use, and influence the adoption rate in the long run.

In this case, I decided that the easiest way to start is by being able to create an instance of a class that allows me to set properties such as the host and others (maybe even an access key in the future for online APIs). For the Project structure I decided on creating a solution with a unique namespace that can be re-used and imported by my other solutions.

#### Configuring the Project structure with dotnet core

Start by creating the solution and sub projects:

```bash
# Create 2 Projects, one for the SDK and one for the Consumer
dotnet new classlib --name <sdk>
dotnet new console --name <sdk-consumer>

# Create a solution and add the 2 projects
dotnet new sln --name <name>
dotnet sln <name> add <sdk>
dotnet sln <name> add <sdk-consumer>

# Add a reference to Newonsoft.Json for JSON parsing
dotnet add <sdk> package NewtonSoft.Json
```

Afterwards we add a reference in our \<sdk-consumer\> to our `./<sdk-consumer>/<sdk-consumer>.csproj` file so that it looks like this:

```csharp
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\<sdk>\sdk.csproj" />
  </ItemGroup>

</Project>
```

#### Writing our entry class in the SDK

To be able to access our SDK, we can now create a class in the \<sdk\> project:

```csharp
using System;

namespace OpenAI.SDK
{
    public class ApiService
    {
        private static readonly HttpClient client = new HttpClient();

        private readonly string host;

        public ApiService(string host = "http://127.0.0.1:5000")
        {
            this.host = host;
        }
    }
}
```

That we are then able to use in other class like this:

```csharp
// Imports 
using OpenAI.SDK; // or your own namespace

// The code in your method or constructor:
var sdk = new ApiService("http://127.0.0.1:1337");
sdk.DoCall();
```

Allowing me to inject it further on and still have the same properties wherever I use it.

### Creating API calls from the SDK

Since I will be interacting with a JSON API, there are 2 calls that are mainly used: GET and POST. To be able to perform this call, we create a `HttpClient` and set it in our constructor like this:

```csharp
namespace OpenAI.SDK
{
    public class ApiService
    {
        private static readonly HttpClient client = new HttpClient();

        private readonly string host;

        public ApiService(string host = "http://127.0.0.1:5000")
        {
            this.host = host;
        }
    }
}
```

#### Performing a GET call

For our GET call we do a simple `GetStringAsync` call through our `HttpClient` which we will then decode by using the `NewtonSoft.JSON`'s excellent `DeserializeObject` method that uses a POCO class, resulting in:

```csharp
public async Task<EnvGetAllResponse> EnvListAll()
{
    var json = await client.GetStringAsync($"{this.host}/v1/envs/");
    var resParsed = JsonConvert.DeserializeObject<EnvGetAllResponse>(json);
    return resParsed;
}
```

**POCO Class:**

```csharp
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace OpenAI.SDK.Models.Response
{
    public class EnvGetAllResponse
    {
        [JsonProperty("all_envs")]
        public Dictionary<string, string> Environments { get; set; }
    }
}
```

#### Performing a POST call

The POST call almost exactly goes in the same format, except that we will have to pass a body to it.

To do this we create a Request POCO class in its own namespace such as:

```csharp
using Newtonsoft.Json;

namespace OpenAI.SDK.Models.Request
{
    public class EnvCreateRequest
    {
        [JsonProperty("env_id")]
        public string EnvId { get; set; }
    }
}
```

That we can then initialize and send after serializing it with `SerializeObject` through the `PostAsync` call in our `HttpClient` object:

```csharp
public async Task<EnvCreateResponse> EnvCreate(string envID)
{
    var requestBody = new EnvCreateRequest {
        EnvId = envID
    };
    var requestJson = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

    var res = await client.PostAsync($"{this.host}/v1/envs/", requestJson);
    var resContent = await res.Content.ReadAsStringAsync();
    var resParsed = JsonConvert.DeserializeObject<EnvCreateResponse>(resContent);
    return resParsed;
}
```