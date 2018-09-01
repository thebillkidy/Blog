---
layout: post
current: post
cover: 'assets/images/covers/databricks.png'
navigation: True
title: Building a real-time streaming dashboard
date: 2018-06-16 09:00:00
tags: dotnet
class: post-template
subclass: 'post tag-coding'
author: xavier
---

When you work with the Internet of Things (IoT) or other real-time data sources, there is one things that keeps bothering you, and that's a real-time visualization dashboard. So in this post, I will explain how you can set up a pipeline that allows you to visualize through 2 popular visualization tools: Chronograf and Grafana.

## Architecture

Let's start by discussing what we will be creating and why we are creating it like this. The eventual architecture will be something that looks like this:

TODO: <Insert Architecture>

We can identify several components in here:

### [Stream] EventHub

**Description:** EventHub Allows us to ingest and distribute events from one component to the other.

**Why?** We use an EventHub because we will be processing a lot of IoT events, which is easier if we have one single point where all our data comes in and that we can pipe to other components. Note that we are not using an IoT Hub which can also manage our IoT Devices, because we will be sending our data from a custom built script so there is no need for device management.

**Alternatives?**

* Apache Kafka (#opensource, kind of like EventHub)
* IoT Hub (Includes device management and things such as configuration pushing)

### [Spark Engine] Databricks #opensource

**Description:** Databricks is a platform that allows you to process big data and streams through the use of the Spark platform.

**Why?** We want to be able to ingest our stream, modify it and stream it to our dashboard. A component such as this allows for a easy redistribution, while being able to modify our stream. We can do things such as multiple endpoint streaming, data windowing, ...

**Alternatives?**

* Azure Stream Analytics
* CosmosDB (We use the change-feed here)


### TODO: <REMOVE> [Dashboard] PowerBI

**Description:** PowerBI is a suite for analyzing your data from any of the many connection points (Data warehouses, NoSQL Stores, SQL Stores, Spark, ...). It allows for both cold and hot data visualization.

**Why?** PowerBI is a very strong product being put on top by the [Gartner Magic Quadrant for Analytics and Business Intelligence platforms](https://powerbicdn.azureedge.net/mediahandler/blog/media/PowerBI/blog/8a6bb9a5-0f77-4249-bb61-f1de16bb5391.jpg) and allows for our real-time stream visualization.

**Alternatives?**

* Grafana (#opensource See below)
* Kibana (ELK stack)
* Chronograf

### <TODO> [Dashboard] Chronograf

### [Dashboard] Grafana

**Description:** Grafana is a tool for monitoring and analysing metrics through data sources such as Graphite, InfluxDB, Prometheus and many more.

**Why?** Grafana is being covered here since PowerBI has great streaming- and historic capabilities, but we are looking for the best of both worlds. Seeing that PowerBI does not allow us to refresh our cold data in an interval lower than [15 minutes](https://docs.microsoft.com/en-us/power-bi/refresh-data) (unless we use manual refresh which involves clicking the button).

**Alternatives?**

* PowerBI (See above)
* Kibana (ELK Stack)
* Chronograf

## Configuring our components

### InfluxDB & Grafana

TO configure your InfluxDB and Grafana containers, go see: [/howto-visualize-metrics-with-grafana-and-influxdb](/howto-visualize-metrics-with-grafana-and-influxdb)

### Event Hub

To configure our Event Hub, look on how you are able to do so in my Blog Post ["Sending and Receiving events with Azure Event Hub"](https://medium.com/@xaviergeerinck/sending-and-receiving-events-with-azure-event-hub-f92af9ad7fa0).

In here create an Event Hub, a consumer group and your Policy Key with the "Listen" permission. More information for this you can find [here](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-resource-manager-namespace-event-hub)

Make sure to note down the following details
* PolicyName
* PolicyKey
* NamespaceName - This is the name of where all your EventHubs are located
* EventHubName - This is the name of the EventHub you created
* ConsumerGroupName - This is the consumer group that you created under your EventHub. The default name is: `$Default`

### DataBricks

For our DataBricks, set up an account through the [awesome documentation](https://docs.microsoft.com/en-us/azure/azure-databricks/quickstart-create-databricks-workspace-portal)

Now we can log in on our Databricks portal and start creating our script that will ingest our EventHub. So create your first notebook (I am using Scala here) and let's get started.

#### Connecting to EventHub

First we set up the configuration details to connect to our EventHub

TODO

#### Streaming events to our InfluxDB Time Series Database

https://hub.docker.com/_/influxdb/

ports 8086 (HTTP API), 8083 (Administrator Interface) 
> Note: https://docs.influxdata.com/influxdb/v1.5/tools/web_admin/, web interface is not there anymore so not needed

INFLUXDB_ADMIN_USER, INFLUXDB_ADMIN_PASSWORD

https://hub.docker.com/_/chronograf/

https://github.com/fsanaulla/chronicler
https://github.com/fsanaulla/chronicler-spark

com.github.fsanaulla:chronicler-spark-structured-streaming_2.11:0.1.0

#### Streaming events to our PowerBI
<TODO>

## Setting up our Streaming Code in Databricks
<TODO>