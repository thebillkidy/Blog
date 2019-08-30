# Smart Retail with the AVNet MT3620 Starter Kit and an NFC scanner

So I just received the AVNet MT3620 Starter Kit device and wanted to get started with it! Here I'll explain you how to do just this and how we will adapt our previously created [Minecraft Puppet Scanner](/minecraft-rfc-scanner) to do 2 things:

1. When we scan a puppet, we are able to view this on the screen
2. When we scan a normal NFC Tag, we will use the **Twin Configuration** to display that product.

How does the device look like?

![/assets/images/posts/azure-sphere-avnet/device-1.jpg](/assets/images/posts/azure-sphere-avnet/device-1.jpg)
![/assets/images/posts/azure-sphere-avnet/device-2.jpg](/assets/images/posts/azure-sphere-avnet/device-2.jpg)
![/assets/images/posts/azure-sphere-avnet/device-3.jpg](/assets/images/posts/azure-sphere-avnet/device-3.jpg)
![/assets/images/posts/azure-sphere-avnet/device-4.jpg](/assets/images/posts/azure-sphere-avnet/device-4.jpg)

Enough showing off, let's get started!

## Activate network and Claim the device

First off when we receive a new Azure Sphere device is to [activate its network](https://docs.microsoft.com/en-us/azure-sphere/install/configure-wifi) and [claim it](https://docs.microsoft.com/en-us/azure-sphere/install/claim-device). 

> **Note:** Special at Azure Sphere is that these devices always have a radio built in, enabling network connectivity.

### Activating Network

```bash
# Show the status of the WiFi connection
azsphere device wifi show-status

# Connect the device to WiFi
azsphere device wifi add --ssid <yourSSID> --key <yourKey>
```

### Claiming the device

```bash
# Login to Azure and see the tenants
azsphere login

# Select the tenant (XavierAzureSphereTenant)
azsphere tenant select -i aca3da0d-5493-45e6-aea2-85c47962770d

# Claim the device
azsphere device claim
``` 

## Connecting the hardware

### Serial Peripheral Interface (SPI)

Once we are connected to the internet, we want to connect our RFID-RC522 NFC scanner. This scanner communicates over a 4-pin [Serial Peripheral Interface (SPI)](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface). This interface has 4 logic signals:

![/assets/images/posts/azure-sphere-avnet/spi.png](/assets/images/posts/azure-sphere-avnet/spi.png)

* **SCLK:** Serial Clock (often called **SCK**)
* **MOSI:** Master Output Slave Input (often called **SDO on master**)
* **MISO:** Master Input Slave Output (often called **SDI on master**)
* **SS:** Slave Select (often called **CS**)

How data transmission will happen now is through the following steps:

1. The master sets SCLK (our clock)
2. The master selects the slave device (SS) with a logic level 0 on the select line
3. During each SPI clock cycle:
    * Master sends a bit on the MOSI line and slave reads it
    * Slave sends a bit on the MISO line and the master reads it

### Connecting RFID RC522 NFC on SPI Azure Sphere

![/assets/images/posts/azure-sphere-avnet/diagram.png](/assets/images/posts/azure-sphere-avnet/diagram.png)

When looking at our **MT3620 AVNET Sphere Starter Kit Diagram** we can see that it utilizes **ISU1** for SPI mode with **SDO, SDI, SCK** on the 2 **MikroBUS Connectors**. This is also shown in the [Azure Sphere Starter Kit User Guide](https://www.element14.com/community/docs/DOC-92359/l/azure-sphere-starter-kit-user-guide-v14?ICID=azuresphere-kit-datasheet-widget) on page 19. This states:

**Click Socket #1:**

* **SCLK (=SCK):** GPIO31_SCLK1_TX1
* **MOSI (=SDO):** GPIO32_MOSI1_RTS1_CLK1
* **MISO (=SDI):** GPIO33_MISO1_RX1_DATA1 
* **SS (=CS):** GPIO34_CSA1_CTS1 Select
* **SDA:** GPIO38_MISO2_RXD2_SDA2

**Click Socket #2:**

* **SCLK (=SCK):** GPIO31_SCLK1_TX1
* **MOSI (=SDO):** GPIO32_MOSI1_RTS1_CLK1
* **MISO (=SDI):** GPIO33_MISO1_RX1_DATA1 
* **SS (=CS):** GPIO35_CSB0 Select
* **SDA:** GPIO38_MISO2_RXD2_SDA2



## Puppet Scanner

## Normal Scanner with Azure Twin Update


Connecting AZ Sphere Board

Started off with deploying the demo as specified in: https://www.element14.com/community/groups/internet-of-things/blog/2019/04/24/avnets-azure-sphere-starter-kit-out-of-box-demo-part-1-of-3?ICID=azuresphere-kit-datasheet-widget

What we want to do: Have Board connect to IoT Hub -> Pulls configuration from IOT Hub -> Shows configured product on display screen -> When NFC tag is presented it will update the on-edge board to the configuration details it fetched through IoT Hub -> When then IoT Hub Twin updated, when tag presented again it will show the latest

Setting up project
-> run azsphere.exe device prep-debug to make sure it's prepped for debugging and app sideloading

For our RFC Scanner we will utilize SPI (since library supports this)

Interesting: https://github.com/Azure/azure-sphere-samples/tree/master/Samples/SPI/SPI_LSM6DS3_HighLevelApp

https://github.com/Azure/azure-sphere-samples/tree/master/Samples/I2C/I2C_LSM6DS3_HighLevelApp

Coding:

1. Start off with a blank VS Studio Project on Green Blink
1. We copy over pin connections from the first reference design app (see GitHub for Avnet) 
2. Start off with a blank

Download lib: https://github.com/miguelbalboa/rfid/blob/master/src/MFRC522.h and install by creating files