---
layout: post
current: post
cover: 'assets/images/covers/iot.jpg'
navigation: True
title: Part 4 - Creating a Automated Machine Learning model based on our Car Data
date: 2019-08-10 09:00:05
tags: azure coding-javascript iot
class: post-template
subclass: 'post'
author: xavier
---

> This is Part 5 in the Iot Edge series, view the [main article](/iot-edge) or go the [part 4](/iot-edge-part4-ml-car) to view the previous article.

![/assets/images/posts/iot-edge/architecture2.png](/assets/images/posts/iot-edge/architecture2.png)

## Recap and next steps

Before we built our Machine Learning model for our car data to predict some values. In this module we now want to analyze the camera simulator video that was put on our Host machine (remember the host machine has modules running, the first simulator module will produce a video that it will put on the Host).

For this module we want to detect useful information from our camera video (such as cars, plates, pedestrians, ...) and send these to our main IoT Hub.

## Initial Setup

### Configuration

For our creation of this module, we will use the following settings:

* **Path:** `/home/xavier/iot-edge`
* **Solution:** EdgeSolutionCameraFilter
* **Module Template:** C# Module
* **Module Name:** ModuleFilterCamera
* **Docker Repository:** `xavierregistry.azurecr.io/module-filter-camera`
  
## Coding

### Solution Analysis

Splitting this solution up into sub-problems, we can now identify the following steps:

1. We will need something that can split our video stream frame-per-frame (as we would do with a camera input)
2. We will need a tool that can analyze our video images and get useful information from them
3. We will need to send the extracted information to our IoTHub

### Step 1. Splitting our Video stream frame-per-frame

We wrote our simulator before that was bundling our images in the `data/` folder into a `.mp4` video. This video should now be available on the host, so this is the data that will utilize.

How can we now split this video frame into different frames?

TODO

### Step 2. Analyze our images and extract information

For our analysis of the frames that we extracted in step 1, we will now use a service called `Azure Cognitive Services`. This allows us to have `on-edge` modules that help us to analyze the data locally with AI models, rather than having to train our own AI models.



### Step 3. Sending the extracted information to IoTHub