---
layout: post
current: post
cover: 'assets/images/covers/azure-sphere.png'
navigation: True
title: An E2E Azure Sphere project in the area of Smart Retail (RFID RC522, AVNet MT3620 SK, Izokee Display)
date: 2019-09-01 09:00:00
tags: azure coding-c
class: post-template
subclass: 'post'
author: xavier
---

# Smart Retail with the AVNet MT3620 Starter Kit and an NFC scanner

Avnet just released an [MT3620 Azure Sphere Development Kit](https://www.avnet.com/shop/us/products/avnet-engineering-services/aes-ms-mt3620-sk-g-3074457345636825680/) with a [contest](https://www.element14.com/community/community/designcenter/azure-sphere-starter-kits?ICID=azuresphere-sensingWorldCH-doc) related to it. 

## Project Description

**Title:** How IoT can play a secure role in the world of Smart Retail

**Description:** In retail the most important thing while walking through the store is the labels displaying the price of an item. With this project I want to display how you can utilize small form factor devices to dynamically update these prices from cloud to edge. I want to demonstrate this through an LCD display that displays the item name and price. Once we then hold and RFID tag in front of an RFID Scanner it will pull the information from its local database. When we then perform a Twin Update, we will change this local database information and re-scan the tag to demonstrate this. With this we want to demonstrate the following technolgies: IoT Twins, Azure IoT Hub, IoT Edge, RFID Scanner, OLED Screens, SPI connection and I2C connection.

Breaking this up into bullet points, we will thus perform the following actions:

* Connect an OLED screen
* Connect an RFID Scanner
* Fetch information from a specific rfid tag and fetch product information from the local database
* Adapt the information of the local database, re-scan the rfid token and show the updated information on the OLED screen

## Hardware

### Avnet MT3620

So we talked about the contest, but how does our device actually look like? Well when I received it, it looked like this fresh out of the box:

![/assets/images/posts/azure-sphere-avnet/device-1.jpg](/assets/images/posts/azure-sphere-avnet/device-1.jpg)
![/assets/images/posts/azure-sphere-avnet/device-2.jpg](/assets/images/posts/azure-sphere-avnet/device-2.jpg)
![/assets/images/posts/azure-sphere-avnet/device-3.jpg](/assets/images/posts/azure-sphere-avnet/device-3.jpg)
![/assets/images/posts/azure-sphere-avnet/device-4.jpg](/assets/images/posts/azure-sphere-avnet/device-4.jpg)

### RFID Scanner

We will be utilizing a [Mifare RC522 Module RFID Reader](https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf) as an RFID reader.

![/assets/images/posts/azure-sphere-avnet/hardware-rfid-scanner.jpg](/assets/images/posts/azure-sphere-avnet/hardware-rfid-scanner.jpg)

### OLED Screen

For our OLED screen I bought an [IZOKEE 0.96" I2C IIC SPI Serial 128x64 px display](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf)

![/assets/images/posts/azure-sphere-avnet/hardware-lcd-screen.jpg](/assets/images/posts/azure-sphere-avnet/hardware-lcd-screen.jpg)

## Basic Concepts - Connecting Hardware

Before we go on and connect our hardware, we should first understand some basic concepts of how hardware gets connected. This is since we want a microcontroller to communicate with small peripheral ICs such as Sensors, ADCs, DACs, ...

### Serial Peripheral Interface (SPI)

One of these interfaces is a [Serial Peripheral Interface (SPI)](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface). This is a "synchronous" bus where data is being sent over between a 'master' and a 'slave' and is kept in sync on both sides through the use of a "clock". This interface has 4 logic signals:

* **SCLK:** Serial Clock (often called **SCK**)
    * Is used to keep both sides in sync, the master generates this.
* **MOSI:** Master Output Slave Input (often called **SDO on master**)
    * Data being sent from Master -> Slave goes over this data line
* **MISO:** Master Input Slave Output (often called **SDI on master**)
    * Data being sent from Slave -> Master goes over this data line
* **SS:** Slave Select (often called **CS**)
    * Select the correct slave and wake it up
    * Note: if high, then no slave is active -> active-low configuration

To make this more clearer, here is a [diagram](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all) to illustrate this:

![/assets/images/posts/azure-sphere-avnet/spi.png](/assets/images/posts/azure-sphere-avnet/spi.png)

How will SPI send data now? Here a short overview:

1. The master sets SCLK (our clock)
2. The master selects the slave device (SS) with a logic level 0 on the select line
3. During each SPI clock cycle:
    * Master sends a bit on the MOSI line and slave reads it
    * Slave sends a bit on the MISO line and the master reads it

For our **DevKit device**, we can find the following about SPI in the [datasheet](https://www.element14.com/community/docs/DOC-92359/l/azure-sphere-starter-kit-user-guide-v14?ICID=azuresphere-kit-datasheet-widget) on page 11 and 19.

![/assets/images/posts/azure-sphere-avnet/diagram.png](/assets/images/posts/azure-sphere-avnet/diagram.png)

**Click Socket #1:**

|Click1 Pin|Module Signal Name|Click1 Pin|Module Signal Name|
|-|-|-|-|
|AN|GPIO42_ADC1|PWM|GPIO0_PWM0|
|RST|GPIO16|INT|GPIO2_PWM2|
|CS|GPIO34_CSA1_CTS1|RX|GPIO28_MISO0_RXD0_SDA0|
|SCK|GPIO31_SCLK1_TX1|TX|GPIO26_SCLK0_TXD0|
|MISO|GPIO33_MISO1_RX1_DATA1|SCL|GPIO37_MOSI2_RTS2_SCL2|
|MOSI|GPIO32_MOSI1_RTS1_CLK1|SDA|GPIO38_MISO2_RXD2_SDA2|
|+3.3V|3V3|+5V|5V|
|GND|GND|GND|GND|

**Click Socket #2:**

|Click2 Pin|Module Signal Name|Click2 Pin|Module Signal Name|
|-|-|-|-|
|AN|GPIO43_ADC2|PWM|GPIO1_PWM1|
|RST|GPIO17|INT|GPIO2_PWM2|
|CS|GPIO35_CSB0|RX|GPIO28_MISO0_RXD0_SDA0|
|SCK|GPIO31_SCLK1_TX1|TX|GPIO26_SCLK0_TXD0|
|MISO|GPIO33_MISO1_RX1_DATA1|SCL|GPIO37_MOSI2_RTS2_SCL2|
|MOSI|GPIO32_MOSI1_RTS1_CLK1|SDA|GPIO38_MISO2_RXD2_SDA2|
|+3.3V|3V3|+5V|5V|
|GND|GND|GND|GND|

## Connecting Azure Sphere and our Hardware

### Activate network and Claim the device

First off when we receive a new Azure Sphere device is to [activate its network](https://docs.microsoft.com/en-us/azure-sphere/install/configure-wifi) and [claim it](https://docs.microsoft.com/en-us/azure-sphere/install/claim-device). 

> **Note:** Special at Azure Sphere is that these devices always have a radio built in, enabling network connectivity.

#### Activating Network

```bash
# Show the status of the WiFi connection
azsphere device wifi show-status

# Connect the device to WiFi
azsphere device wifi add --ssid <yourSSID> --key <yourKey>
```

#### Claiming the device

```bash
# Login to Azure and see the tenants
azsphere login

# Select the tenant (XavierAzureSphereTenant)
azsphere tenant select -i aca3da0d-5493-45e6-aea2-85c47962770d

# Claim the device
azsphere device claim
``` 

### Enabling debugging on our Azure Sphere

Before we can now get started and deploy code on our Azure Sphere, we have to configure it so it allows sideloading. For that just execute the command `azsphere device prep-debug` which will configure the device and reboot it so we are ready to go!

### Connecting the RFID Scanner

Since we learned what the SPI interface is, we can now connect our RFID scanner. For that just connect the corresponding pins on the RFID scanner with the ones on our devkit as shown here. For this we look at the SPI details in the [datasheet](https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf) on page 9. Here we find the following:

|PIN|UART(input)|SPI (output)|I2C-bus (I/O)|
|-|-|-|-|
|SDA|RX|NSS|SDA|
|I2C|0|0|1|
|EA|0|1|EA|
|D7|TX|MISO|SCL|
|D6|MX|MOSI|ADR_0|
|D5|DTRQ|SCK|ADR_1|
|D4|-|-|ADR_2|
|D3|-|-|ADR_3|
|D2|-|-|ADR_4|
|D1|-|-|ADR_5|

Where we see that for SPI we need to utilize **NSS, MISO, MOSI, SCK** on our development board, which refer to **SDA, MISO, MOSI, SCK** on the RFID scanner. 

Once connected, we will have this:

![/assets/images/posts/azure-sphere-avnet/hardware-connected-rfid-1.jpg](/assets/images/posts/azure-sphere-avnet/hardware-connected-rfid-1.jpg)

![/assets/images/posts/azure-sphere-avnet/hardware-connected-rfid-2.jpg](/assets/images/posts/azure-sphere-avnet/hardware-connected-rfid-2.jpg)

![/assets/images/posts/azure-sphere-avnet/hardware-connected-rfid-3.jpg](/assets/images/posts/azure-sphere-avnet/hardware-connected-rfid-3.jpg)

Drawing this out, we will get:

RFID|DEVICE|COLOR
-|-|-
SDA|CS|GREEN
SCK|SCK|PURPLE
MOSI|SDO|GREY
MISO|SDI|WHITE
RQ|-|-|
GND|GND|BLACK
RST|RST|YELLOW
3.3V|3V3|BLUE

### Connecting the OLED screen

The OLED screen is quite straightforward for our project, seeing that it's the one as shown on page 22 in the datasheet. It has the following pin connectors:

|Grove Pin #|Signal Name|Signal Name|
|-|-|-|
|1|GND|GND|
|2|3V3|3V3|
|3|SCL|GPIO37_MOSI2_RTS2_SCL2|
|4|SDA|GPIO38_MISO2_RXD2_SDA2|

![/assets/images/posts/azure-sphere-avnet/hardware-connected-lcd.jpg](/assets/images/posts/azure-sphere-avnet/hardware-connected-lcd.jpg)

## Azure

To be able to connect our device and control it, we will work with Azure. In Azure we always start off with creating a **resource group** when we want to test something.

![/assets/images/posts/azure-sphere-avnet/azure-create-resource-group.png](/assets/images/posts/azure-sphere-avnet/azure-create-resource-group.png)

### Azure IoT Hub

Connecting devices to cloud is done through IoT Hub, this is a service that allows us to manage our devices as well as receive / send data from / to them. For our demonstration we will choose the S1 tier.

> **Note:** the F1 tier will also be sufficient but has a smaller limit of messages / day

![/assets/images/posts/azure-sphere-avnet/azure-create-iothub.png](/assets/images/posts/azure-sphere-avnet/azure-create-iothub.png)

### Azure Device Provisioning

Now we have an IoT Hub and an IoT Edge device, how do we actually connect this device to IoT Hub? One way would be to go through the portal and create our device manually. This is however not something we want to do seeing the manual work involved, wouldn't it be better if we could let our device handle all of this automatically?

For that we have the [**Azure Device Provisioning Service**](https://docs.microsoft.com/en-us/azure/iot-dps/about-iot-dps), which will  automatically provision our IoT device once it gets connected to the IoT Hub (this through a Enrollment list, but more later on that).

![/assets/images/posts/azure-sphere-avnet/azure-create-dps.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps.png)

Once our Device Provisioning Service (DPS) has been set up, we can link our IoT Hub to it:

![/assets/images/posts/azure-sphere-avnet/azure-create-dps-link-iothub.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps-link-iothub.png)

The last thing we now have to do is add our device to the enrollment list, here we have the choice to add our devices through Certificates our symmetric keys. Seeing the nature of IoT Edge devices and that we want to let them be as secure as possible, we will thus utilize a Certificate for this. First we will get our device its CA certificate by running the command `azsphere tenant download-CA-certificate -output MyAzureSphereCACertificate.cer`, whereafter we will add it to our DPS service and create an enrollment for it. See the pictures below on how this will look:

![/assets/images/posts/azure-sphere-avnet/azure-create-dps-device-get-ca-certificate.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps-device-get-ca-certificate.png)
![/assets/images/posts/azure-sphere-avnet/azure-create-dps-add-certificate.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps-add-certificate.png)

Now since we uploaded a certificate **we need to verify that it's the correct certificate**, for this get the code on the detail pane and verify it with `azsphere tenant download-validation-certificate --output MyAzureSphereVerificationCertificate.cer --verificationcode <code>`. Whereafter we upload this to the portal.

![/assets/images/posts/azure-sphere-avnet/azure-create-dps-verify-certificate.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps-verify-certificate.png)

Last but not least we are now able to create an Enrollment Group where this device will be part of.

![/assets/images/posts/azure-sphere-avnet/azure-create-dps-enrollment-group.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps-enrollment-group.png)

Now when our device connects, it will be automatically added.

## Coding our Project

Before we start coding, important to note is as well that the Azure Sphere SDK includes a set of Application Libraries (AppLibs) that make it easy for us to develop an Azure Sphere applications. For more information, check the [Azure Documentation](https://docs.microsoft.com/en-us/azure-sphere/reference/applibs-reference/api-overview)

### Code Setup

Now, since we connected our hardware, let's get started with coding our project. For that start off with creating a solution in Visual Studio as follows:

![/assets/images/posts/azure-sphere-avnet/project-create-1.png](/assets/images/posts/azure-sphere-avnet/project-create-1.png)

![/assets/images/posts/azure-sphere-avnet/project-create-2.png](/assets/images/posts/azure-sphere-avnet/project-create-2.png)

![/assets/images/posts/azure-sphere-avnet/project-create-3.png](/assets/images/posts/azure-sphere-avnet/project-create-3.png)

![/assets/images/posts/azure-sphere-avnet/project-create-4.png](/assets/images/posts/azure-sphere-avnet/project-create-4.png)

Since we now have a project, we now want to correct some properties:

1. Change the SDK to the BETA version. For this, follow [this guide](https://docs.microsoft.com/en-us/azure-sphere/app-development/use-beta) and select the "2+Beta1905" version.
2. We want to set the correct Hardware Target reference to be utilized in our app manifest. For this, we will copy over the [Hardware folder from the Azure Sphere Samples](https://github.com/Azure/azure-sphere-samples/tree/master/Hardware) to our project root (where our solution is sitting) as shown [here](https://docs.microsoft.com/en-us/azure-sphere/app-development/manage-hardware-dependencies).
3. We want to access easy pin definitions as defined in step 2. For that, find the respective header files in the Hardware folder from step 2 and include them into your project. (for our Avnet development board, we thus have to include [`mt3620.h`](https://raw.githubusercontent.com/Azure/azure-sphere-samples/master/Hardware/mt3620/inc/hw/mt3620.h), [`avnet_mt3620_aesms.h`](https://raw.githubusercontent.com/Azure/azure-sphere-samples/blob/master/Hardware/avnet_aesms_mt3620/inc/hw/avnet_aesms_mt3620.h) and [`avnet_mt3620_sk.h`](https://github.com/Azure/azure-sphere-samples/blob/master/Hardware/avnet_mt3620_sk/inc/hw/avnet_mt3620_sk.h)).

![/assets/images/posts/azure-sphere-avnet/target-hardware.png](/assets/images/posts/azure-sphere-avnet/target-hardware.png)

### Hello World - OLED Screen

The easiest code samples always start with a Hello World sample, so let's create one for the OLED display. 

> **Note:** Seeing that the scope of this post is to actually make a fully E2E working project, we are going to skip through this quite quickly, but feel free to find the source code in the [GitHub repository](https://github.com/thebillkidy/PublicProjects/tree/master/C/AzureSphere-Avnet-E2E-Project).

Luckily for us, Avnet already used this type of OLED screen and working source code is [available](https://github.com/CloudConnectKits/Azure_Sphere_SK_ADC_RTApp/tree/master/AvnetAzureSphereSK_OLED/AvnetStarterKitReferenceDesign). Therefor we copy the following files:

* `oled.h`
* `oled.c`
* `sd1306.h`
* `sd1306.c`
* `font.h`

We then change some parts to let it suit or needs (as well as strip unneeded code that access the accelerometer and other sensors) and add this in our **main.c** code:

```c
// OUR IMPORTS

int main(int argc, char* argv[])
{
	// Start the OLED Screen
	if (oled_init())
	{
		Log_Debug("OLED not found!\n");
	}
	else
	{
		Log_Debug("OLED found!\n");
	}

	// Clear the buffer
	oled_buffer_clear();

	// Draw the strings
	sd1306_draw_string(0, 0, "Test", FONT_SIZE_TITLE, white_pixel);
	sd1306_draw_string(OLED_LINE_1_X, OLED_LINE_1_Y, "Hello World", FONT_SIZE_LINE, white_pixel);
	sd1306_draw_string(OLED_LINE_2_X, OLED_LINE_2_Y, "Hello World", FONT_SIZE_LINE, white_pixel);
	sd1306_draw_string(OLED_LINE_3_X, OLED_LINE_3_Y, "Hello World", FONT_SIZE_LINE, white_pixel);
	sd1306_draw_string(OLED_LINE_4_X, OLED_LINE_4_Y, "Hello World", FONT_SIZE_LINE, white_pixel);

	// Send the buffer to OLED RAM
	sd1306_refresh();

	return 0;
}
```

We can now see Hello World being printed on the screen:

![/assets/images/posts/azure-sphere-avnet/demo-lcd-hello-world.jpg](/assets/images/posts/azure-sphere-avnet/demo-lcd-hello-world.jpg)

### Hello World - RFID Scanner

As a Hello World for our RFID scanner, we will be reading the version of our RFID scanner.

> **Note:** this is not an easy feat since there is no library in existance for the RFID scanner that works with the Azure Sphere chipset

For this we will rework [this library](https://github.com/asif-mahmud/MIFARE-RFID-with-AVR/blob/master/lib/avr-rfid-library/lib/mfrc522.c) and bake in our chip support through the [SPI applibs ](https://docs.microsoft.com/en-us/azure-sphere/reference/applibs-reference/applibs-spi/spi-overview). 

> **Note:** Seeing that the scope of this post is to actually make a fully E2E working project, we are going to skip through this quite quickly, but feel free to find the source code in the [GitHub repository](https://github.com/thebillkidy/PublicProjects/tree/master/C/AzureSphere-Avnet-E2E-Project).

In short, we will adapt the read and write methods to utilize our Azure Sphere SPI interface so that they look like this:

```c
void mfrc522_write(uint8_t reg, uint8_t data)
{
	const size_t transferCount = 1;
	SPIMaster_Transfer transfer;

	int result = SPIMaster_InitTransfers(&transfer, transferCount);
	if (result != 0) {
		return;
	}

	//const uint8_t command[] = { (reg << 1) & 0x7E, data };
	const uint8_t command[] = { (reg << 1) & 0x7E, data };
	transfer.flags = SPI_TransferFlags_Write;
	transfer.writeData = command;
	transfer.length = sizeof(command);

	ssize_t transferredBytes = SPIMaster_TransferSequential(spiFd, &transfer, transferCount);

	if (!CheckTransferSize("SPIMaster_TransferSequential (CTRL3_C)", transfer.length, transferredBytes)) {
		Log_Debug("Transfer size is not correct");
		return;
	}
}

uint8_t mfrc522_read(uint8_t reg)
{
	uint8_t readDataResult;
	//uint8_t readCmd = ((reg << 1) & 0x7E) | 0x80; // Set bit 7 indicating it's a read command -> 0x80
	uint8_t readCmd = ((reg << 1) & 0x7E | 0x80); // Set bit 7 indicating it's a read command -> 0x80
	ssize_t transferredBytes = SPIMaster_WriteThenRead(spiFd, &readCmd, sizeof(readCmd), &readDataResult, sizeof(readDataResult));

	if (!CheckTransferSize("SPIMaster_WriteThenRead (CTRL3_C)", sizeof(readCmd) + sizeof(readDataResult), transferredBytes)) {
		Log_Debug("Transfer size is not correct");
		return -1;
	}

	Log_Debug("INFO: READ=0x%02x (SPIMaster_WriteThenRead)\n", readDataResult);

	return readDataResult;
}
```

We can then adapt our **main.c** code to initialize the RFC library and start reading the version:

```c
// INCLUDES

void delay(int s)
{
	sleep(s);
}

int main(void)
{
	Log_Debug("IPC RFID RC522 Application Starting\n");

	// Start the RFID Scanner
	if (mfrc522_init())
	{
		Log_Debug("RFID Scanner not found!\n");
	}
	else
	{
		Log_Debug("RFID Scanner found!\n");
		return -1;
	}

	// Look for a card
	while (1)
	{
		Log_Debug("Trying to get version\n");
		// Check version of the reader
		// Can be 0x91 for 1.0 or 0x92 for 2.0 -> https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf (p66 - VersionReg register)
		uint8_t byte = mfrc522_read(VersionReg);

		Log_Debug("Detected version %d (Hex: %x)\n", byte, byte);

		delay(5);
	}

	return 0;
}
```


### Hello World - Azure

For our Azure connectivity we want to do something very basic, here we just want to demonstrate:
* Sending data to cloud
* Receiving data from cloud

Therefor we will create an application that is going to send the status of the green LED light every 10 seconds and we will utilize a Device Twin to change the status of this LED.

#### Configuring our App Manifest

The first thing we will do is to configure our `app_manifest.json`:

1. Add the Device Provisioning Service Scope ID to the `CmdArgs` block (e.g. `"CmdArgs: [ "<YourScopeID>" ]`)
2. Add the tenant id to the `DeviceAuthentication` key (e.g. `"DeviceAuthentication": "00000000-0000-0000-0000-000000000000"`)
3. Set the `AllowedConnections` key to allow the device provisioning service and your IoTHub connection string (e.g. `"AllowedConnections": [ "global.azure-devices-provisioning.net", "MyAzureSphereIoTHub.azure-devices.net" ]`)
4. Seeing that we will let the GREEN LED blink, we need to enable Gpio pin 9 (e.g. `"Gpio": [ 9 ]`)

![/assets/images/posts/azure-sphere-avnet/azure-create-dps-id-scope.png](/assets/images/posts/azure-sphere-avnet/azure-create-dps-id-scope.png)
![/assets/images/posts/azure-sphere-avnet/azsphere-tenant-show-selected.png](/assets/images/posts/azure-sphere-avnet/azsphere-tenant-show-selected.png)

#### Writing our Code

First we configure our project by opening the `.vcxproj` in a text editor and adding the following in the `<Link>` tags:

```xml
<AdditionalLibraryDirectories Condition="'$(Configuration)|$(Platform)'=='Debug|ARM'"> .\azureiot\lib;%(AdditionalLibraryDirectories)</AdditionalLibraryDirectories>
<AdditionalDependencies Condition="'$(Configuration)|$(Platform)'=='Debug|ARM'">-lm;-lazureiot;%(AdditionalDependencies)</AdditionalDependencies>
<AdditionalLibraryDirectories Condition="'$(Configuration)|$(Platform)'=='Release|ARM'"> .\azureiot\lib;%(AdditionalLibraryDirectories)</AdditionalLibraryDirectories>
<AdditionalDependencies Condition="'$(Configuration)|$(Platform)'=='Release|ARM'">-lm;-lazureiot;%(AdditionalDependencies)</AdditionalDependencies>
```

Making it look like this:

![/assets/images/posts/azure-sphere-avnet/vstudio-extra-link-dependencies.png](/assets/images/posts/azure-sphere-avnet/vstudio-extra-link-dependencies.png)

Luckily for us, the `azureiot` files are included through the Azure Sphere SDK installation (typically in `C:\Program Files (x86)\Microsoft Azure Sphere SDK\Sysroots\2+Beta1905\usr\include\azureiot\`), so we can have the following includes defined:

```c
// Azure IoT SDK
#include <azureiot/iothub_client_core_common.h>
#include <azureiot/iothub_device_client_ll.h>
#include <azureiot/iothub_client_options.h>
#include <azureiot/iothubtransportmqtt.h>
#include <azureiot/iothub.h>
#include <azureiot/azure_sphere_provisioning.h>
```

For the rest of our code, we will be utilizing one of the [Azure Sphere examples](https://github.com/Azure/azure-sphere-samples/tree/master/Samples/AzureIoT/AzureIoT) that we adapt to only include the LED light and Twin functionality. When we then run this, we see:

```bash
Remote debugging from host 192.168.35.1
Application Starting
Setting Azure Scope ID 0ne000777D8
Opening GREEN LED as output
[Azure IoT] Using HSM cert at /run/daa/aca3da0d-5493-45e6-aea2-85c47962770d
[IoTHub][INFO] IoTHubDeviceClient_LL_CreateWithAzureSphereDeviceAuthProvisioning returned 'AZURE_SPHERE_PROV_RESULT_OK'.
[IoTHub][INFO] Configuring Device Twin Callback and Connection Status Callback
[IoTHub][INFO] Sending IoT Hub Message: { "Test": "Hello World" }
[IoTHub][INFO] IoTHubClient accepted the message for delivery
[IoTHub][INFO] Received IoT Twin Update from IoT Hub
[IoTHub][INFO] Changing Status LED to true
[IoTHub][INFO] Reported state for 'MyGreenLED' to value 'true'.
[IoTHub][INFO] Sending IoT Hub Message: { "Test": "Hello World" }
[IoTHub][INFO] IoTHubClient accepted the message for delivery
[IoTHub][INFO] Message received by IoT Hub. Result is: 0
```

> **Note:** Initially I got `IOTHUB_CLIENT_CONNECTION_NO_NETWORK`, which was because I forgot to configure my IoT Hub endpoint in the `app_manifest.json` file under `"AllowedConnections"`.

For the full code, please see the [GitHub repository](https://github.com/thebillkidy/PublicProjects/tree/master/C/AzureSphere-Avnet-E2E-Project).

### RFID Scanner + OLED Screen for Serial Reading

The next step we will now do before connecting it all to cloud is to be able to read the tags from our RFID Tags and display their serial number. Seeing the 2 hello world examples this should be trivial to do now. Therefor we copy everything from the 2 hello world projects into 1 project and use the following **main.c** file that will display some information in-between and will read and display the serial every time the tag is presented.

**main.c**

```c
// INCLUDES...

// DECLARE FUNCTIONS...

void delay(int s)
{
	sleep(s);
}

uint8_t InitPeripherals()
{
	Log_Debug("[OLED] Initializing\n");
	if (oled_init())
	{
		Log_Debug("OLED not found!\n");
	}
	else
	{
		Log_Debug("OLED found!\n");
	}

	Log_Debug("[MFRC522] Initializing\n");
	if (mfrc522_init())
	{
		Log_Debug("RFID Scanner not found!\n");
	}
	else
	{
		Log_Debug("RFID Scanner found!\n");
		return -1;
	}
}

int main(void)
{
	int res = InitPeripherals();
	if (res < 0) {
		Log_Debug("Error, exiting!\n");
		return -1;
	}

	oled_template_waiting_for_rfc();

	// Get Card Version
	Log_Debug("Trying to get version\n"); // 0x91 = 1.0, 0x92 = 0.2 -> https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf (p66 - VersionReg register)
	uint8_t readerVersion = mfrc522_read(VersionReg);

	Log_Debug("Detected version %d (Hex: %x)\n", readerVersion, readerVersion);
	oled_template_waiting_for_rfc_with_version(readerVersion);

	// Prepare for reading tags
	uint8_t byte;
	byte = mfrc522_read(ComIEnReg);
	mfrc522_write(ComIEnReg, byte | 0x20);
	byte = mfrc522_read(DivIEnReg);
	mfrc522_write(DivIEnReg, byte | 0x80);

	delay(2);

	// Look for a card
	// Commands: https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf P36
	uint8_t str[MAX_LEN];

	while (1)
	{
		byte = mfrc522_request(PICC_REQALL, str); // Find all the cards antenna area

		if (byte == CARD_FOUND)
		{
			Log_Debug("[MFRC522] Found a card: %x\n", byte);

			byte = mfrc522_get_card_serial(str);

			if (byte == CARD_FOUND)
			{
				for (byte = 0; byte < 8; byte++)
				{
					Log_Debug("[MFRC522] Dumping: %x\n", str[byte]);
				}

				// Convert the byte array to a string of bytes
				char hexstr[8];
				btox(hexstr, str, 8);
				hexstr[8] = 0;
				Log_Debug("%s\n", hexstr);
				oled_template_show_serial(hexstr);

				delay(3);
			}
			else
			{
				Log_Debug("[MFRC522] Error while reading card\n");
			}
		}

		delay(1);
	}

	// Todo: close SPI here

	return 0;
}

void btox(char* xp, const char* bb, int n)
{
	const char xx[] = "0123456789ABCDEF";
	while (--n >= 0) xp[n] = xx[(bb[n >> 1] >> ((1 - (n & 1)) << 2)) & 0xF];
}

void oled_template_waiting_for_rfc(void)
{
	// Clear the buffer
	oled_buffer_clear();

	// Draw the strings
	sd1306_draw_string(0, 0, "Information", FONT_SIZE_TITLE, white_pixel);
	sd1306_draw_string(OLED_LINE_1_X, OLED_LINE_1_Y, "Waiting for tag to", FONT_SIZE_LINE, white_pixel);
	sd1306_draw_string(OLED_LINE_2_X, OLED_LINE_2_Y, "be detected", FONT_SIZE_LINE, white_pixel);

	// Send the buffer to OLED RAM
	sd1306_refresh();
}

void oled_template_waiting_for_rfc_with_version(uint8_t version)
{
	// Clear the buffer
	oled_buffer_clear();

	// Draw the strings
	sd1306_draw_string(0, 0, "Information", FONT_SIZE_TITLE, white_pixel);
	sd1306_draw_string(OLED_LINE_1_X, OLED_LINE_1_Y, "Waiting for tag to", FONT_SIZE_LINE, white_pixel);
	sd1306_draw_string(OLED_LINE_2_X, OLED_LINE_2_Y, "be detected", FONT_SIZE_LINE, white_pixel);

	char versionBuffer[20];
	sprintf(versionBuffer, "MIFARE Version = %x", version);
	sd1306_draw_string(OLED_LINE_3_X, OLED_LINE_3_Y, versionBuffer, FONT_SIZE_LINE, white_pixel);

	// Send the buffer to OLED RAM
	sd1306_refresh();
}

void oled_template_show_serial(char* serial)
{
	// Clear the buffer
	oled_buffer_clear();

	// Draw the strings
	sd1306_draw_string(0, 0, "Information", FONT_SIZE_TITLE, white_pixel);
	sd1306_draw_string(OLED_LINE_1_X, OLED_LINE_1_Y, "Serial:", FONT_SIZE_LINE, white_pixel);
	sd1306_draw_string(OLED_LINE_2_X, OLED_LINE_2_Y, serial, FONT_SIZE_LINE, white_pixel);

	// Send the buffer to OLED RAM
	sd1306_refresh();
}
```

### Putting it all together - RFID + OLED + Azure

Since we have the basic functionality done now, we want to put it all together. When we scan a RFID tag, we look in a local array for the price information and display this on screen. By utilizing Azure we will now add the functionality to update this price information through **Device Twins** as well as **send an event to IoTHub** stating our scanned tag and price identified.

Doing this will require a few things that we will do (not displayed here for shortness reasons, see source code):

1. Add a custom event handler for the RFID and merge the code in there
2. Add OLED display methods for displaying the price
3. Including a [MAP datastructure](https://github.com/rxi/map/blob/master/src/) that we can utilize to hold our price for the tags
4. Updating the Azure Twin so that we are able to update the price for the tags through the Device Twin (cloud to device)

Once we adapted our code to incorporate this, we can then see something like this when testing (added comments for clarity)

```bash
Remote debugging from host 192.168.35.1
# 1. Initializing the application
[Application][INFO] Starting
[Application][INFO] Setting Azure Scope ID <MASKED>
[OLED][INFO] Initializing
[OLED][INFO] OLED found!
[MFRC522][INFO] Initializing
[MFRC522][SPI][INFO] Initializing
[MFRC522][SPI][INFO] Opened SPI Interface
[MFRC522][SPI][INFO] BusSpeed = 4000000
[MFRC522][SPI][INFO] SPIMode = 1
[MFRC522][SPI][INFO] BitOrder = SPI_BitOrder_MsbFirst
[MFRC522][SPI][INFO] FD Set on 4
[MFRC522][SPI][INFO] Initialized
[MFRC522][INFO] RFID Scanner found!
[ePoll][INFO] Initializing
# 2. Detecting the scanner version
[MFRC522][INFO] Trying to get version
[MFRC522][INFO] Detected version 146 (Hex: 92)
[MFRC522][INFO] Waiting for IoTHub Connection
# ...
[MFRC522][INFO] Waiting for IoTHub Connection
# 3. Configuring our IoT Hub Connection
[Azure IoT] Using HSM cert at /run/daa/<MASKED>
[IoTHub][INFO] IoTHubDeviceClient_LL_CreateWithAzureSphereDeviceAuthProvisioning returned 'AZURE_SPHERE_PROV_RESULT_OK'.
[IoTHub][INFO] Configuring Device Twin Callback and Connection Status Callback
[IoTHub][INFO] IoT Hub Authenticated: IOTHUB_CLIENT_CONNECTION_OK
# 4. Handling the Azure Device Twin Update
[IoTHub][INFO] Received IoT Twin Update from IoT Hub
[IoTHub][Twin][INFO] Updating PriceMap
[IoTHub][Twin][INFO] 8804399D -> Zombie: $15.50
[IoTHub][Twin][INFO] Updating price for 7908C820 to Normal: $14.11
[IoTHub][ERROR] Reported state for '7908C820' to value 'Normal: $14.11'.
[IoTHub][Twin][INFO] 88041B9D -> Skeleton: $20.00
[IoTHub][INFO] Device Twin reported properties update result: HTTP status code 400
# 5. Reading our card and displaying it to the screen
[MFRC522][INFO] Found a card: 1
[MFRC522][INFO] Dumping: 79
[MFRC522][INFO] Dumping: 8
[MFRC522][INFO] Dumping: c8
[MFRC522][INFO] Dumping: 20
[MFRC522][INFO] Dumping: 99
[MFRC522][INFO] Dumping: 0
[MFRC522][INFO] Dumping: 0
[MFRC522][INFO] Dumping: 0
[MFRC522][INFO] Serial: 7908C820
[MAP][INFO] Map Price: Normal: $14.11
```

### Testing

When we test this in real life, we will see something as shown in the videos below. What we see here is the scanning of tags on the device, executing a twin update and seeing the updated price on the device. Note that we also show the event data being sent to Azure through a consumer. This consumer is quite basic and looks like this:

```javascript
const config = require('./config');

const { Client } = require('azure-event-hubs');
const connectionString = "<YOUR_IOTHUB_CONNECTION_STRING>";
const consumerGroup = '$Default';

const printError = (err) => {
  console.log(err.message);
};

const client = Client.fromConnectionString(connectionString);
client.open()
.then(client.getPartitionIds.bind(client))
.then((partitionIds) => {
  return partitionIds.map((partitionId) => {
    client.createReceiver(consumerGroup, partitionId, { 'startAfterTime': Date.now() })
    .then((receiver) => {
      console.log(`[Receiver] Created partition receiver: [${partitionId}] for consumerGroup [${consumerGroup}]`);
      receiver.on('errorReceived', printError);
      receiver.on('message', (message) => {
        console.log(`[Receiver][${consumerGroup}][${partitionId}] Message received: ${JSON.stringify(message.body).toString()}`);
      });
    })
  })
})
.catch(printError);
```

**screencast**

<video width="960" height="540" controls autoplay>
  <source src="/assets/images/posts/azure-sphere-avnet/video-screencast.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

**device**

<video width="640" height="480" controls autoplay>
  <source src="/assets/images/posts/azure-sphere-avnet/video-hardware.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

To see the full code that was used to create this example, feel free to check this repository: [https://github.com/thebillkidy/PublicProjects/tree/master/C/AzureSphere-Avnet-E2E-Project](https://github.com/thebillkidy/PublicProjects/tree/master/C/AzureSphere-Avnet-E2E-Project).