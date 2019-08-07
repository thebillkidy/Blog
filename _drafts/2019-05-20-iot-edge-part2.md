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

> This is Part 2 in the Iot Edge series, view the [main article](/iot-edge) or go the [part 1](/iot-edge-part1) to view the previous article.

![/assets/images/posts/iot-edge/architecture2.png](/assets/images/posts/iot-edge/architecture2.png)

## Recap and next steps

In [part 1](/iot-edge-part1) we created our cloud infrastructure, our initial device connected to it and afterwards wrote a simulator module that we pushed to the edge device, that will send us the time every 30 seconds 

What we want to do now is to create 2 modules that both sit on edge:
* **Module A**: Our Simulator 
  * *Car Simulator:* Sending x data points in JSON every y seconds
  * *Video Simulator:* Sending x frames every y seconds
* **Module B**: Our AI model
  * This module will use a AI model that it fetches from cloud and validates our simulator data against. Once it satisfies the criteria configured it will send a response to the IoT Hub.

So let's get started!

## Module A - Simulators

### Module A - Car Simulator

As we learned in [part 1](/iot-edge-part1) we set up a new IoT Edge solution with the following parameters:

* **Path:** `/home/xavier/iot-edge`
* **Solution:** EdgeSolutionCarFilter
* **Module Template:** C# Module
* **Module Name:** ModuleSimulatorCar
* **Docker Repository:** `xavierregistry.azurecr.io/module-simulator-car`

For the code itself, we will start off with finding our dataset of points that we want our simulator to use. We will then send off each of these datapoints every second as our simulation.

> **Note:** In real-life you would not use a simulator but just use a module to capture your Video Feed/CAN Dongle/USB/... connected to the device

Luckily an excellent repository exist on GitHub that contains an interesting dataset for car datapoints that are comparable to a CAN bus: [https://github.com/cloudpose/smartphone_driving_dataset](https://github.com/cloudpose/smartphone_driving_dataset) 

This dataset (`dataset_car.csv`) has the following fields:

* Time
* Seconds
* Latitude / Y Position (Degrees)
* Longitude / X Position (Degrees)
* Distance (Miles)
* Speed (MPH)
* Steering Angle
* Throttle Position
* Engine RPM
* Lateral Gs
* Acceleration Gs

For the actual code:




### Module A - Video Simulator

For the Video simulator we will re-use the previous solution created 

* **Path:** `/home/xavier/iot-edge`
* **Solution:** EdgeSolutionCameraFilter
* **Module Template:** C# Module
* **Module Name:** ModuleSimulatorCamera
* **Docker Repository:** `xavierregistry.azurecr.io/module-simulator-camera`

For the data, we will - as mentioned - utilize the data from [https://github.com/cloudpose/smartphone_driving_dataset](https://github.com/cloudpose/smartphone_driving_dataset) which links to a dataset of 3,419 images for us to send.




## Module B - AI Model