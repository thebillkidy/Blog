---
layout: post
current: post
cover: 'assets/images/covers/iot.jpg'
navigation: True
title: Azure IoT Edge Simulator - Easily run and test your IoT Edge application
date: 2019-05-20 09:00:00
tags: azure coding-javascript iot
class: post-template
subclass: 'post'
author: xavier
---

Building an IoT Edge module is an important step for any IoT Application that requires on-edge processing to not constantly send data towards cloud (for bandwith, latency as well as processing reasons).

When you work with Azure IoT Edge, one of the issues you might have is that you would like to start debugging your applications before actually sending them off to your repository.

This article will explain you how you can do this for a `Dotnet Core` application using the simulator.

## Prerequisites

* IoT Hub
* IoT Hub Edge Simulator: `pip install --upgrade iotedgehubdev`
  * Note: I got a segfault while running the above, but adding `sudo` solved this - it's most likely related due to a right issue
  * Note 2: If you have to utilize `sudo`, first remove `iotedgehubdev` since it might be installed under `.local`
  * Note 3: Make sure `docker-compose` is also installed correctly (else if also under .local, reinstall with sudo)
* A module, see part 1 for this: [iot-edge-part-1](/iot-edge-part1)

## Setting up the simulator

### Starting the simulator

Setting up the simulator requires an easy step:

`Azure IoT-Edge: Start IoT Edge Hub Simulator for Single Module` with a value for the input channel (default is `value1`). This will start a container up such as `mcr.microsoft.com/azureiotedge-testing-utility:1.0.0 ` which you see after running `docker ps`

This will give you the following output it everything went well:

```bash
xavier@PersonalVM:~/iot-edge/EdgeSolutionCarFilter/modules/ModuleSimulatorCar$ sudo iotedgehubdev start -i "input1"
IoT Edge Simulator has been started in single module mode.
Please run `iotedgehubdev modulecred` to get credential to connect your module.
And send message through:

        curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages

Please refer to https://github.com/Azure/iot-edge-testing-utility/blob/master/swagger.json for detail schema
```

Showing that a container is now running that will act as our `IoT Edge Hub` (remember, the Hub orchestrates messages from the edge devices to IoT Hub and Reverse - it's kind of a service bus).

### Getting the module credentials

When the simulator has now been started, we are able to get the credentials that are needed to connect our modules. You can get those by running: `iotedgehubdev modulecred` which will give an output such as this:

```bash
xavier@PersonalVM:~/iot-edge/EdgeSolutionCarFilter/modules/ModuleSimulatorCar$ sudo iotedgehubdev modulecred
EdgeHubConnectionString=HostName=<HOSTNAME>;GatewayHostName=personalvm;DeviceId=xavier-device-1;ModuleId=target;SharedAccessKey=<SHAREDACCESSKEY>
EdgeModuleCACertificateFile=/var/lib/iotedgehubdev/certs/edge-device-ca/cert/edge-device-ca.cert.pem
```

> Checking [https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/tests/Edge/EdgeModuleClientFactoryTest.cs](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/tests/Edge/EdgeModuleClientFactoryTest.cs) we can see that these credentials are used to configure connection parameters.

## Running our code

Seeing that we now have our credentials, we can inject them as environment variables in our `dotnet run` command through this: `env $(sudo iotedgehubdev modulecred | xargs) dotnet run`

> What this will do is that it will run the `iotedgehubdev modulecred` command to get the variables, it will then put those on 1 single line and eventually use that line as a specific environment configuration to run our `dotnet run` command.

You will now see the module booting as such:

```bash
xavier@PersonalVM:~/iot-edge/EdgeSolutionCarFilter/modules/ModuleSimulatorCar$ env $(sudo iotedgehubdev modulecred | xargs) dotnet run
IoT Hub module client initialized.
<PROGRAM_OUTPUT>
```

Of course you are also able to utilize this as debug, for that feel free to check this link on how to set this up for your IDE: [https://docs.microsoft.com/en-us/azure/iot-edge/how-to-vs-code-develop-module#develop-your-module](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-vs-code-develop-module#develop-your-module)

## Sending Messages to our module

Sending a message is now easy, once your code is running you are able to send messages by issueing a CURL request to the endpoint you received when starting the simulator (`curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages`)

