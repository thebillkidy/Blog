---
layout: post
current: post
cover: 'assets/images/covers/iot.jpg'
navigation: True
title: Part 1 - Manage, Connect and Deploy our simulators to our Edge Devices with IoT Hub
date: 2019-05-20 09:00:00
tags: azure coding-javascript iot
class: post-template
subclass: 'post'
author: xavier
---

<!-- > This is Part 1 in the Iot Edge series, view the [main article](/iot-edge) or go the [part 2](/iot-edge-part2) to continue. -->

> This is Part 1 in the Iot Edge series, view the [main article](/iot-edge). Part 2 is currently under construction and will follow soon.

![/assets/images/posts/iot-edge/architecture2.png](/assets/images/posts/iot-edge/architecture2.png)

Looking at our architecture, we need to be able to connect out devices and get some interesting output from them before we can actually do something with them. In this first part we will be mainly focusing on doing just that - connecting our devices and sending data to our IoT Hub resource.

Therefor in this Part we have the following **prerequisities:**

> Note for my variables I used the following:
> * YOUR_IOTHUB_NAME = xavier-iothub
> * YOUR_DEVICE_ID = xavier-device-1
> * YOUR_EDGE_VM = xavier-edge-1

## Prerequisites

* IoT Hub - Connect and manage your devices
  * `az iot hub create --resource-group DEMO-IoTEdge --name {YOUR_IOTHUB_NAME} --sku F1` will create a *free* iot hub (limits: 8k messages per day and 500 registered devices)
* Azure Shell + IoT Cli Extension
  * Note: Easy way is utilizing [https://shell.azure.com](https://shell.azure.com) and run `az extension add --name azure-cli-iot-ext`
* Azure Edge Runtime on the device
  * Linux x64: https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux
  * Linux ARM: https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux-arm 
* An ARM IoT Device (we use ARM because it might give compatibility issues, but we will most likely have ARM devices in the field) 

## Registering a Device

### Creating a simulation device

Checking [IoT Edge Supported Devices](https://docs.microsoft.com/en-us/azure/iot-edge/support#operating-systems) showed me that Ubuntu 18.04 is supported on ARM. However since I didn't have access to a ARM device on the moment of writing, I went with deploying a VM on Azure, which is easily done through the marketplace: [https://azuremarketplace.microsoft.com/marketplace/apps/microsoft_iot_edge.iot_edge_vm_ubuntu](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft_iot_edge.iot_edge_vm_ubuntu).

```bash
az vm create --resource-group DEMO-IoTEdge --name xavier-edge-1 --image microsoft_iot_edge:iot_edge_vm_ubuntu:ubuntu_1604_edgeruntimeonly:latest --admin-username xavier --ssh-key-values "YOUR_SSH_KEY" --size Standard_B1ms
```

> Note: if you are installing on an ARM, feel free to follow the guide at: [https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux-arm](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux-arm)


### Creating an IoT Edge Device ID

Once our prerequisites are done, we can start adding our devices. For this run: `az iot hub device-identity create --hub-name {YOUR_IOTHUB_NAME} --device-id {YOUR_DEVICE_ID} --edge-enabled` which will create an edge-enabled device. This will return something like this:

```json
{
  "authentication": {
    "symmetricKey": {
      "primaryKey": "{MASKED}",
      "secondaryKey": "{MASKED}"
    },
    "type": "sas",
    "x509Thumbprint": {
      "primaryThumbprint": null,
      "secondaryThumbprint": null
    }
  },
  "capabilities": {
    "iotEdge": true
  },
  "cloudToDeviceMessageCount": 0,
  "connectionState": "Disconnected",
  "connectionStateUpdatedTime": "0001-01-01T00:00:00",
  "deviceId": "xavier-device-1",
  "deviceScope": "ms-azure-iot-edge://xavier-device-1-{ID}",
  "etag": "{ETAG}",
  "generationId": "{ID}",
  "lastActivityTime": "0001-01-01T00:00:00",
  "status": "enabled",
  "statusReason": null,
  "statusUpdatedTime": "0001-01-01T00:00:00"
}
```

## Connecting our IoT Edge Device to IoT Hub

Once we deployed this VM, we can now configure our IoT Edge by getting our IoT Hub connection string and running a shell command which is available in the image.

To get our connection string we can run:

```bash
az iot hub device-identity show-connection-string --device-id {YOUR_DEVICE_ID} --hub-name {YOUR_IOTHUB_NAME}
```


Which will return something such as:

```json
{
  "connectionString": "HostName={YOUR_IOTHUB}.azure-devices.net;DeviceId={YOUR_DEVICE_ID};SharedAccessKey={ACCESS_KEY}"
}
```

Now we can run the following script which was pre-deployed on our Edge Device through the Marketplace image, that will configure our edge device:

```bash
az vm run-command invoke -g Demo-IoTEdge -n {YOUR_EDGE_VM} --command-id RunShellScript --script "/etc/iotedge/configedge.sh '{YOUR_DEVICE_CONNECTION_STRING}'"
```

Which should show the following when executed successfully:

```bash
xavier@Azure:~$ az vm run-command invoke -g Demo-IoTEdge -n xavier-edge-1 --command-id RunShellScript --script "/etc/iotedge/configedge.sh 'HostName=xavier-iothub.azure-devices.net;DeviceId=xavier-device-1;SharedAccessKey={YOUR_DEVICE_ACCCESS_KEY}'"
{
  "value": [
    {
      "code": "ProvisioningState/succeeded",
      "displayStatus": "Provisioning succeeded",
      "level": "Info",
      "message": "Enable succeeded: \n[stdout]\n Wed May 22 13:24:14 UTC 2019 Connection string set to HostName=xavier-iothub.azure-devices.net;DeviceId=xavier-device-1;SharedAccessKey={YOUR_DEVICE_ACCCESS_KEY}\n\n[stderr]\n",
      "time": null
    }
  ]
}
```

> **Note:** You can now check if IoT Edge is running by SSHing on the machine and executing `sudo systemctl status iotedge`
> **Interesting Commands:** `journalctl -u iotedge` - Check logs, `sudo iotedge list` - Show modules running

## Creating our Edge Device's Echo Module

For testing purposes, we want to create a small container that echos the current time every 2 seconds to IoT Hub. To do this we follow a few steps:

1. **Command Palette (ctrl + p):** Azure: Sign In
2. **Command Palette (ctrl + p):** Azure IoT Edge: New IoT Edge solution
   * **Path:** /home/xavier/iot-edge/
   * **Solution:** EdgeSolutionCameraFilter
   * **Module Template:** C# Module
   * **Module Name:** EchoModule (our demo container for now)
   * **Docker Repository:** xavierregistry.azurecr.io/echomodule

> Note: for more information and details, check [https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-csharp-module](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-csharp-module) which goes through the steps of creating a temperature model.

> Note 2: I didn't have docker installed on my machine. We can however easily work around this by utilizing a remote Linux VM Machine and use [VS Code Remote-SSH](https://code.visualstudio.com/docs/remote/remote-overview)

Once we did that, we will see the following boilerplate code created once we open our folder.

![/assets/images/posts/iot-edge/iothub-echo-module-creation.png](/assets/images/posts/iot-edge/iothub-echo-module-creation.png)

This boilerplate code creates a module that will play back our input on the output channel. To make this clearer, I renamed `input1` to `input-echo` and `output1` to `output-echo`.

![/assets/images/posts/iot-edge/iothub-echo-module-creation-2.png](/assets/images/posts/iot-edge/iothub-echo-module-creation-2.png)

Another thing I did is to add a timer that will send a message every 30 seconds to make it clear that it is actually doing something and that we don't necessarily have to send something to it ;) The code I used for that:

```csharp
// Register a Timer that will send every X seconds
var myTimer = new System.Timers.Timer();
myTimer.Elapsed += new System.Timers.ElapsedEventHandler((object source, System.Timers.ElapsedEventArgs e) => {
    var now = DateTime.Now.ToString("g");
    var message = new Message(Encoding.UTF8.GetBytes($"Sending event at {now}"));
    ioTHubModuleClient.SendEventAsync("output", message);
});
myTimer.Interval = 30 * 1000; // Every 30 seconds
myTimer.Enabled = true;
```

![/assets/images/posts/iot-edge/iothub-echo-module-creation-3.png](/assets/images/posts/iot-edge/iothub-echo-module-creation-3.png)

A last thing we now have to do is to remove a few lines from our `deployment.template.json` and `deployment.template.debug.json` file in the root folder: 

```json
"sensorToEchoModule": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/EchoModule/inputs/input1\")"
```

And some lines that deploy another module that we don't need

```json
"tempSensor": {
  "version": "1.0",
  "type": "docker",
  "status": "running",
  "restartPolicy": "always",
  "settings": {
    "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
    "createOptions": "{}"
  }
},
```

Now we are ready to build, publish and finally deploy our edge module.

## Building, Publishing & Deploying the Edge Module

### Building and Publishing our Edge Module

We can now easily build and publish our Edge Module by right-clicking our `deployment.template.json` and selecting "Build and Push Iot Edge Solution"

![/assets/images/posts/iot-edge/iothub-echo-module-creation-4.png](/assets/images/posts/iot-edge/iothub-echo-module-creation-4.png)

> **Note:** For me this failed due to permission issues on my Linux machine, however when you have the terminal open you can just press the up arrow and add `sudo` in the front. 
> **Hint:** ctrl + a jumps to the beginning of a line

This will now build and push our solution, resulting in:

```bash
# Docker container is building
Step 1/12 : FROM microsoft/dotnet:2.1-sdk AS build-env
2.1-sdk: Pulling from microsoft/dotnet
c5e155d5a1d1: Pull complete 
221d80d00ae9: Pull complete 
4250b3117dca: Pull complete 
3b7ca19181b2: Pull complete 
5980daa97e3c: Pull complete 
7cbae962589c: Pull complete 
4ab425e558b6: Pull complete 
Digest: sha256:481a526515bd95f7ecbe866b99ddac6130da3402e8e4fb09712123393d3f1475
Status: Downloaded newer image for microsoft/dotnet:2.1-sdk
 ---> 511c1f563ce6
Step 2/12 : WORKDIR /app
 ---> Running in ed3388ecf107
Removing intermediate container ed3388ecf107
 ---> e8033981828f
Step 3/12 : COPY *.csproj ./
 ---> 4614b845cc5d
Step 4/12 : RUN dotnet restore ---> Running in 2db5ed302e26  Restore completed in 3.24 sec for /app/EchoModule.csproj.
Removing intermediate container 2db5ed302e26
 ---> b74b9ac5490b
Step 5/12 : COPY . ./
 ---> 8132d7ecea0d
 Step 6/12 : RUN dotnet publish -c Release -o out
 ---> Running in 62098984d63d
Microsoft (R) Build Engine version 16.1.76+g14b0a930a7 for .NET Core
Copyright (C) Microsoft Corporation. All rights reserved.

  Restore completed in 485.11 ms for /app/EchoModule.csproj.
  EchoModule -> /app/bin/Release/netcoreapp2.1/EchoModule.dll
  EchoModule -> /app/out/
Removing intermediate container 62098984d63d
 ---> 46899da4cedb
Step 7/12 : FROM microsoft/dotnet:2.1-runtime-stretch-slim
2.1-runtime-stretch-slim: Pulling from microsoft/dotnet
743f2d6c1f65: Pull complete 
074da88b8de0: Pull complete 
ac831735b47a: Pull complete 
625946e33cc4: Pull complete 
Digest: sha256:5ff2b0f6e69b44f6404d46445be34408551331429d5a84b667cfee49ebd8117d
Status: Downloaded newer image for microsoft/dotnet:2.1-runtime-stretch-slim
 ---> f7da44fabfad
Step 8/12 : WORKDIR /app
 ---> Running in b999e9d179aa
Removing intermediate container b999e9d179aa
 ---> 247b2ac0a988
Step 9/12 : COPY --from=build-env /app/out ./
 ---> ef30f581b39d
Step 10/12 : RUN useradd -ms /bin/bash moduleuser
 ---> Running in 172a5e40a83e
Removing intermediate container 172a5e40a83e
 ---> dc3691450b75
Step 11/12 : USER moduleuser
 ---> Running in c71d5ab2fc77
Removing intermediate container c71d5ab2fc77
 ---> d4798c0654e7
Step 12/12 : ENTRYPOINT ["dotnet", "EchoModule.dll"]
 ---> Running in 547f0facbdd8
Removing intermediate container 547f0facbdd8
 ---> 114a7cc96b50
Successfully built 114a7cc96b50
Successfully tagged xavierregistry.azurecr.io/echomodule:0.0.1-amd64

# Pushing it
The push refers to repository [xavierregistry.azurecr.io/echomodule]
11e1e4b905fe: Pushed 
a0d529ad3f07: Pushed 
f081219e5aa6: Pushed 
be1595c6dfc4: Pushed 
ecf7942d9af2: Pushed 
ea4e5356527d: Pushed 
6270adb5794c: Pushed 
0.0.1-amd64: digest: sha256:7021323942c2323adb48d17ec73b00e69ec19216c816de59e2eb6e9a0b3f682c size: 1789
```

### Deploying our Edge Module

Now that our module is created and pushed to our repository, we can now push it to our Edge Module. For this, simply right-click on our device and select "Create Deployment for Single Device"

![/assets/images/posts/iot-edge/iothub-echo-module-deploy.png](/assets/images/posts/iot-edge/iothub-echo-module-deploy.png)

![/assets/images/posts/iot-edge/iothub-echo-module-deploy-2.png](/assets/images/posts/iot-edge/iothub-echo-module-deploy-2.png)

This will open up our output and show: 

```bash
[Edge] Start deployment to device [xavier-device-1]
[Edge] Deployment succeeded.
```

When we open up our device now, we can see that under modules we have an extra module deployed.

![/assets/images/posts/iot-edge/iothub-echo-module-deploy-3.png](/assets/images/posts/iot-edge/iothub-echo-module-deploy-3.png)

## Testing our Deployment

To monitor our device, we can now go to our devices and select "Start Monitoring Built-In Event Endpoint" which will open a logger for us. When we did this, we will now after a few seconds see:

```bash
[IoTHubMonitor] [5:59:27 PM] Message received from [xavier-device-1/EchoModule]:
"Sending event at 05/24/2019 17:59"
```

For our Echo module, we can now send a C2D message (Cloud to Device), we do this by Right-Clicking our device again and selecting "Send D2C Message to IoTHub" and entering our message.

When everything goes well we will now see the following in our Device Event Log:

```bash
[D2CMessage] Sending message to [IoT Hub] ...
[IoTHubMonitor] [6:02:36 PM] Message received from [xavier-device-1]:
"Hello World"
```

## Conclusion

We now created our first initial module, so let's get started for real now and work on [creating our AI Edge Module in Part 2](/iot-edge-part2)!