---
layout: post
current: post
cover: 'assets/images/covers/openai.jpg'
navigation: True
title: Writing a C# SDK for the OpenAI Gym using .NET Core
date: 2018-08-10 10:00:00
tags: reinforcement-learning machine-learning artificial-intelligence dotnet
class: post-template
subclass: 'post'
author: xavier
---

When we take a look at the OpenAI Gym on Github ([https://github.com/openai/gym-http-api](https://github.com/openai/gym-http-api)), we see that it does not have bindings available for C#. Now since I am a firm believer of .NET Core and what it brings to developer ecosystem, I decided to write one myself ([https://github.com/thebillkidy/dotnetcore-sdk-openai](https://github.com/thebillkidy/dotnetcore-sdk-openai)). Using what I learned in my previous blog post [How to write a SDK in dotnet Core](/howto-write-a-sdk-in-dotnet-core) I created one that looks like this for the main method:

> Note: You can test it using the `Test()` method in this class

```csharp
using System;
using System.Threading.Tasks;
using System.Net.Http;
using OpenAI.SDK.Models.Response;
using OpenAI.SDK.Models.Request;
using Newtonsoft.Json;
using System.Text;

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

        public async Task Test()
        {
            Console.WriteLine("========== CREATE ENVIRONMENT ==========");
            var env = await EnvCreate("CartPole-v0");
            Console.WriteLine("Created Environment: " + env.InstanceID);

            Console.WriteLine("========== ALL ENVIRONMENTS ==========");
            Console.WriteLine(await EnvListAll());

            Console.WriteLine("========== INITIAL OBSERVATION ==========");
            var initialObservation = await EnvReset<double[]>(env.InstanceID);
            Console.WriteLine(initialObservation.Observation);

            Console.WriteLine("========== STEP ==========");
            var stepTaken = await EnvStep<double[]>(env.InstanceID, 1);
            Console.WriteLine(stepTaken.IsDone);
            Console.WriteLine(stepTaken.Reward);
            Console.WriteLine(stepTaken.Observation);

            Console.WriteLine("========== SPACES ==========");
            var actionSpace = await EnvActionSpaceInfo<dynamic>(env.InstanceID);
            var observationSpace = await EnvObservationSpaceInfo<dynamic>(env.InstanceID);
            Console.WriteLine(actionSpace);
            Console.WriteLine(observationSpace);
        }

        public async Task<EnvGetAllResponse> EnvListAll()
        {
            var json = await client.GetStringAsync($"{this.host}/v1/envs/");
            var resParsed = JsonConvert.DeserializeObject<EnvGetAllResponse>(json);
            return resParsed;
        }

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

        public async Task<EnvResetResponse<T>> EnvReset<T>(string instanceID)
        {
            var res = await client.PostAsync($"{this.host}/v1/envs/{instanceID}/reset/", null);
            var resContent = await res.Content.ReadAsStringAsync();
            var resParsed = JsonConvert.DeserializeObject<EnvResetResponse<T>>(resContent);
            return resParsed;
        }

        public async Task<EnvStepResponse<T>> EnvStep<T>(string instanceID, int action, bool isRender = false)
        {
            var requestBody = new EnvStepRequest {
                Action = action,
                IsRender = isRender
            };

            var requestJson = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var res = await client.PostAsync($"{this.host}/v1/envs/{instanceID}/step/", requestJson);
            var resContent = await res.Content.ReadAsStringAsync();
            var resParsed = JsonConvert.DeserializeObject<EnvStepResponse<T>>(resContent);
            return resParsed;
        }

        public async Task<EnvGetActionSpaceResponse<T>> EnvActionSpaceInfo<T>(string instanceID)
        {
            var json = await client.GetStringAsync($"{this.host}/v1/envs/{instanceID}/action_space/");
            var resParsed = JsonConvert.DeserializeObject<EnvGetActionSpaceResponse<T>>(json);
            return resParsed;
        }

        public async Task<EnvGetObservationSpaceResponse<T>> EnvObservationSpaceInfo<T>(string instanceID)
        {
            var json = await client.GetStringAsync($"{this.host}/v1/envs/{instanceID}/observation_space/");
            var resParsed = JsonConvert.DeserializeObject<EnvGetObservationSpaceResponse<T>>(json);
            return resParsed;
        }

        public async Task<EnvMonitorStartResponse> EnvMonitorStart(string instanceID, string directory, bool force, bool resume)
        {
            var requestBody = new EnvMonitorStartRequest {
                Directory = directory,
                Force = force,
                Resume = resume
            };

            var requestJson = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var res = await client.PostAsync($"{this.host}/v1/envs/{instanceID}/monitor/start", requestJson);
            var resContent = await res.Content.ReadAsStringAsync();
            var resParsed = JsonConvert.DeserializeObject<EnvMonitorStartResponse>(resContent);
            return resParsed;
        }

        public async Task<EnvMonitorStopResponse> EnvMonitorStop(string instanceID)
        {
            var res = await client.PostAsync($"{this.host}/v1/envs/{instanceID}/monitor/close", null);
            var resContent = await res.Content.ReadAsStringAsync();
            var resParsed = JsonConvert.DeserializeObject<EnvMonitorStopResponse>(resContent);
            return resParsed;
        }

        public async Task<EnvCloseResponse> EnvClose(string instanceID)
        {
            var res = await client.PostAsync($"{this.host}/v1/envs/{instanceID}/close", null);
            var resContent = await res.Content.ReadAsStringAsync();
            var resParsed = JsonConvert.DeserializeObject<EnvCloseResponse>(resContent);
            return resParsed;
        }

        public async Task<ShutdownServerResponse> ShutdownServer()
        {
            var res = await client.PostAsync($"{this.host}/v1/shutdown", null);
            var resContent = await res.Content.ReadAsStringAsync();
            var resParsed = JsonConvert.DeserializeObject<ShutdownServerResponse>(resContent);
            return resParsed;
        }
    }
}
```
