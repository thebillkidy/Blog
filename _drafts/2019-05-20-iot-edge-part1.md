---
layout: post
current: post
cover: 'assets/images/covers/iot.jpg'
navigation: True
title: Part 1 - Manage, Connect and Deploy our simulators to our Edge Devices with IoT Hub
date: 2019-05-20 09:00:00
tags: azure coding-javascript
class: post-template
subclass: 'post'
author: xavier
---

> This is Part 1 in the Iot Edge series, view the [main article](/iot-edge) or go the [part 2](/iot-edge-part2) to continue.

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

## Creating our Device Container Simulator

For testing purposes, we want to create a small container that echos the current time every 2 seconds to IoT Hub. For easy purposes, we can follow [https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-csharp-module](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-csharp-module) to install our development machine and create our initial module boilerplate.

![/assets/images/posts/iot-edge/iothub-echo-module-creation.png](/assets/images/posts/iot-edge/iothub-echo-module-creation.png)

The Echo Module is created by default, the only thing that I changed is that I renamed `input1` to `input-echo` and `output1` to `output-echo` for clarity reasons.

We can now de