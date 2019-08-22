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

> This is Part 4 in the Iot Edge series, view the [main article](/iot-edge) or go the [part 3](/iot-edge-part3-simulator-camera) to view the previous article.

![/assets/images/posts/iot-edge/architecture2.png](/assets/images/posts/iot-edge/architecture2.png)

## Recap and next steps

We just built our 2 simulators that will produce the data that we want to filter. Before we can create our modules to do this, we will first train an AI model that works on top of this data.

What is this AI model going to do? Well for car data there are a lot of use cases we can have, examples are: location prediction, distance detection, pothole detection, ...

In this case we will go for speed prediction, which has a couple of benefits for us:
1. We can have a regression use case (prediction)
2. We have a real-world example: speed detection can be used to make sure that we are slowing down, or what the adaptation would be for future cycles.
3. We can have real-time data coming in for the future cycles (prediction data) that we can send to cloud to enable future use cases (e.g. stream processing, ...)

Let's get started!

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

Remembering our [simulator code](/iot-edge-part-2-simulator-car) for our car data, this was replaying points from a csv and sending them to our device hub. How would this work in a real-world use case? If we think about this we can define the following steps that should be followed for our IoT Edge device to utilize a nice working AI model:

1. Gather data
2. Train our AI model
3. Deploy our AI model on edge
4. Predict values of our Edge device based on the AI model
5. Repeat

For the sake of simplicity of this article, we will first focus on creating everything manually so that in a later article we can talk about automating all these steps. 

### Step 1. Gathering Data

Since for this article we are sending everything from a CSV file that already contains this gathered data, we can state that step 1. has been finished, so up to step 2!

### Step 2. Training our AI model

We will predict the speed of our car depending on some parameters from the CSV file. Choosing these parameters is critical to have a good working model. In our case we will go for the following as input parameters:

* Throttle Position
* Engine RPM
* Acceleration GS

With our output parameter being:

* Speed MPH

Now how will we train this model? For that we will use [ML.NET](https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet) which allows us to do this quite easily. Let's get started (for an introduction, feel free to check: [Predicting Instagram with ML.NET](/predicting-instagram-with-dotnet-ml))

> **Note:** The reason we are utilizing ML.NET is because it's quite simple to use, plus it allows us to export our model as a `ONNX` format which is the open standard for ML Models.

#### Step 2.1. Creating our ML Project (ML.NET Setup)

We first start by creating a new .NET solution and adding the `Microsoft.ML` dependency to it.

```bash
# Create a new .NET solution
# dotnet new <type> -o <outDir>
dotnet new console -o MLCarFilter

# Add Microsoft.ML as a reference
# dotnet add <solution> package <packageName>
dotnet add MLCarFilter package Microsoft.ML
```

After this is done, we **copy over the `car.csv` file** to our project root. Now we can start writing our prediction code.


#### Step 2.2. Adding our ML code

For our prediction, we can base ourselves on the material from the ML.NET. After searching a bit, I came on the following repository that explains how to utilize a **regression** algorithm in ML.NET (which is what we want to use): [Regression_TaxiFarePrediction](https://github.com/dotnet/machinelearning-samples/tree/master/samples/csharp/getting-started/Regression_TaxiFarePrediction).







### Step 3. Deploying our AI model on Edge

### Step 4. Predicting values of our Edge Device based on the deployed AI model


In our case, step 1 is done since we are alread



### Deploying our Edge Module Filter

