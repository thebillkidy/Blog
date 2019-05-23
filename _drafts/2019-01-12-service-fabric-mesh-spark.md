---
layout: post
current: post
cover: 'assets/images/covers/experience.jpg'
navigation: True
title: Running Apache Spark on Service Fabric Mesh
date: 2019-01-06 09:00:00
tags: infrastructure machine-learning reinforcement-learning spark big-data
class: post-template
subclass: 'post tag-experience tag-startups'
author: xavier
---

In recent months I have been working on getting more familiar with Reinforcement Learning and how it can benefit us all in daily life. For this I have been studying the algorithms behind it, as well as the ecosystem powering it. One of the mosts popular components in this ecosystem is OpenAI. OpenAI released an environment called the "OpenAI Gym" that allows us to easily spin up games, read the state of the world and take actions in it.

To be able to do this, you are of course in need of a strong cluster that is capable of running OpenGL on top of it. My first try was to look at Databricks, seeing that it is my to-go tool for all my Big Data needs, but this seemed to be quite hard to accomplish because it does not support OpenGL to be ran. After brainstorming a little bit, I was also from the opinion that there must be an easier way to achieve this, making me take a look at **Service Fabric Mesh**.

## What is Service Fabric Mesh?

Service Fabric Mesh is an Azure Offering that allows you to run any application with full control of its environment, without having to worry about orchestrating the cluster beneath it: [documentation](https://docs.microsoft.com/en-us/azure/service-fabric-mesh/). Another way to see this is by reading the excellent post about how you are able to [run Minecraft on top of Service Fabric Mesh](https://blogs.msdn.microsoft.com/azureservicefabric/2019/01/11/running-minecraft-on-service-fabric-mesh/)

> Note: Interesting here is that Service Fabric Mesh allows you to spin up unique storage accounts for certain instances, making it perfect for game server hosting such as Minecraft. This is something quite difficult to achieve with Kubernetes.

## Installing Service Fabric Mesh in our CLI

Seeing that Service Fabric Mesh is still in preview, we first will have to enable the extension in our CLI to be able to utilize it. For that reason, run the following:

```bash
az extension add --name mesh
```

## Deploying our first application

As always, we start with a simple HelloWorld application to see how easy (or hard...) it is to deploy an application. Following this awesome tutorial: [https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-quickstart-deploy-container](https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-quickstart-deploy-container) allows us to run the following commands:

```bash
# Initial Azure Setup
az login
az account set --subscription "<SUBSCRIPTION_ID>"

# Resource Group Creationg
az group create --name "<RESOURCE_GROUP_NAME>" --location <LOCATION>

# Deploy the application
az mesh deployment create --resource-group "<RESOURCE_GROUP_NAME>" --template-uri https://raw.githubusercontent.com/Azure-Samples/service-fabric-mesh/master/templates/helloworld/helloworld.linux.json --parameters "{'location': {'value': '<LOCATION>'}}" 

# After it is done, check the output or run: 
# To find the publicIPAddress in the displayed JSON
az group deployment show --name helloworld.linux --resource-group "<RESOURCE_GROUP_NAME>"

# Delete resource group
az group delete --name "Xavier-SFMesh"
```

Check the status of your applications and logs with these commands:

```bash
# View the app details through:
az mesh app show --resource-group Xavier-SFMesh --name "<APP_NAME>"

# View Application Logs
az mesh code-package-log get --resource-group "<RESOURCE_GROUP_NAME>" --application-name "<APP_NAME>" --service-name "<SERVICE_NAME>" --replica-name 0 --code-package-name "<CODE_PACKAGE_NAME>
```

## Deploying Spark with OpenAI Gym Installed

Ok, our Introduction is now done and the boring part is over, let's go more in-depth ;) how can we run a Spark Cluster with OpenAI Gym installed on it?

Well since Service Fabric mesh is a container orchestrator, we need to bundle our application as a container before we will be able to run it. So let's get started with first building our container that includes spark and jupyter notebook.

### Creating our Docker Container with Spark, Jupyter and OpenAI


```bash
# Login to our Docker Repository
# --> We use --password for easy purposes, for security do not run this on an untrusted environment
docker login --username=<HUB_USERNAME> --password=<HUB_PASSWORD>

# Build Image, e.g. "docker build -t thebillkidy/spark:v0.0.1 ."
docker build -t <HUB_USERNAME>/<REPOSITORY>:<IMG_TAG> .

# Push the image
docker push <HUB_USERNAME>/<REPOSITORY>:<IMG_TAG>
```

### Deploying to Service Fabric

> First of all, it's interesting to note that Service Fabric Mesh is **in Preview and is completely free** with a limit of 12 cores and 48 GB RAM per application! [https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-faq](https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-faq)

Now we pushed our Docker Container to the hub, we can start creating our Service Fabric Mesh configuration. For that we will be creating an ARM template and configuring the following:

* Network
* Application
* Service

For the operating system type, we can check the [documentation-operatingsystemtypes](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfmeshrp-model-operatingsystemtypes) listing the different types we can use. For our Spark Container we will use the `linux` `osType`.

Container Code:
https://docs.microsoft.com/en-us/rest/api/servicefabric/sfmeshrp-model-containercodepackageproperties

Disk Sizes (Small=32Gb, Medium=64Gb, Large=128Gb):
I am mounting it on /mnt/data
https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-model-applicationscopedvolumecreationparametersservicefabricvolumedisk

Deploy:
az mesh deployment create --resource-group "Xavier-SFMesh" --template-file ./spark.json --parameters "{'location': {'value': 'westeurope' }}"

See Status:

```bash
az group deployment show --name spark --resource-group Xavier-SFMesh | jq '.properties.provisioningState'
```