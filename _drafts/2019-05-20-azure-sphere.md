
### Configuring Azure Sphere MT3620

For my simulation device, I utilized an [Azure Sphere MT3620 development kit from SEEED Studio](http://wiki.seeedstudio.com/Azure_Sphere_MT3620_Development_Kit/) and followed the [installation steps](https://docs.microsoft.com/en-us/azure-sphere/install/install) to be able to connect to it.

Once I did that, I saw them in my device manager:

![/assets/images/posts/iot-edge/sphere-device-manager.png](/assets/images/posts/iot-edge/sphere-device-manager.png)

Allowing me to recover the OS: 

```bash
C:\Users\xageerin\Documents>azsphere device recover
Starting device recovery. Please note that this may take up to 10 minutes.
Downloading recovery images...
Download complete.
Board found. Sending recovery bootloader.
Erasing flash.
Sending images.
Sending image 1 of 16.
Sending image 2 of 16.
Sending image 3 of 16.
Sending image 4 of 16.
Sending image 5 of 16.
Sending image 6 of 16.
Sending image 7 of 16.
Sending image 8 of 16.
Sending image 9 of 16.
Sending image 10 of 16.
Sending image 11 of 16.
Sending image 12 of 16.
Sending image 13 of 16.
Sending image 14 of 16.
Sending image 15 of 16.
Sending image 16 of 16.
Finished writing images; rebooting board.
Device ID: {YOUR_SPHERE_DEVICE_ID}
Device recovered successfully.
Command completed successfully in 00:02:40.6558025.
```

And claim the device in my tenant:

```bash
C:\Users\xageerin\Documents>azsphere tenant create --name XavierAzureSphereTenant --force
Created a new Azure Sphere tenant:
 --> Tenant Name: XavierAzureSphereTenant
 --> Tenant ID:   {YOUR_TENANT_ID}
Selected Azure Sphere tenant 'XavierAzureSphereTenant' as the default.
You may now wish to claim the attached device into this tenant using 'azsphere device claim'.
Command completed successfully in 00:00:12.3766411.

C:\Users\xageerin\Documents>azsphere device claim
Claiming device.
Successfully claimed device ID '{YOUR_SPHERE_DEVICE_ID}' into tenant 'XavierAzureSphereTenant' with ID '{YOUR_TENANT_ID}'.
Command completed successfully in 00:00:02.8578827.
```

So that I finally can successfully connect it to the network:

```bash
C:\Users\xageerin\Documents>azsphere device wifi show-status
SSID                :
Configuration state : unknown
Connection state    : disconnected
Security state      : unknown
Frequency           :
Mode                :
Key management      : UNKNOWN
WPA State           : DISCONNECTED
IP Address          :
MAC Address         : {YOUR_MAC_ADDRESS}

Command completed successfully in 00:00:01.2061080.

C:\Users\xageerin\Documents>azsphere device wifi add --ssid {YOUR_SSID} --key {YOUR_SSID_PASSWORD}
Add network succeeded:
ID                  : 0
SSID                : {YOUR_SSID}
Configuration state : enabled
Connection state    : unknown
Security state      : psk

Command completed successfully in 00:00:01.7250994.

C:\Users\xageerin\Documents>azsphere device wifi show-status
SSID                : {YOUR_SSID}
Configuration state : enabled
Connection state    : connected
Security state      : psk
Frequency           : 2412
Mode                : station
Key management      : WPA2-PSK
WPA State           : COMPLETED
IP Address          : {YOUR_IP}
MAC Address         : {YOUR_MAC_ADDRESS}

Command completed successfully in 00:00:01.1697318.
```

You can check if updates are available through `azsphere device show-ota-status`:

```bash
C:\Users\xageerin\Documents>azsphere device show-ota-status
Your device is running Azure Sphere OS version 19.04.
The Azure Sphere Security Service is targeting this device with Azure Sphere OS version 19.04.
Your device has the expected version of the Azure Sphere OS: 19.04.
Command completed successfully in 00:00:03.7330236.
```