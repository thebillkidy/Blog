---
layout: post
current: post
cover: 'assets/images/covers/grafana.png'
navigation: True
title: How-To Visualize Metrics with Grafana and Chronograf by using InfluxDB
date: 2018-08-29 09:00:00
tags: dotnet
class: post-template
subclass: 'post tag-coding'
author: xavier
---

Visualizing is an important part of working with data. Here I will walk you step by step on how you can create a working Visualization dashboard with Grafana and Chronograf which query events through InfluxDB.

This post is part of the "Real Time Streaming Dashboard" series which can be found here: [/real-time-streaming-dashboard](/real-time-streaming-dashboard)

## InfluxDB Container

Starting a container is easy by using Azure Container Instances, for this we go to the marketplace to create a new container and fill in the details as shown below:
![/assets/images/posts/visualize-metrics-with-grafana-and-influxdb/container-influxdb-1.png](/assets/images/posts/visualize-metrics-with-grafana-and-influxdb/container-influxdb-1.png)

![/assets/images/posts/visualize-metrics-with-grafana-and-influxdb/container-influxdb-2.png](/assets/images/posts/visualize-metrics-with-grafana-and-influxdb/container-influxdb-2.png)

![/assets/images/posts/visualize-metrics-with-grafana-and-influxdb/container-influxdb-3.png](/assets/images/posts/visualize-metrics-with-grafana-and-influxdb/container-influxdb-3.png)

If everything went ok, you will now be able to access InfluxDB on your FQDN:8086 endpoint through: `http://<FQDN>:8086` which will show a `

## Chronograf Container
<TODO>

## Grafana Container

Just as we did with the Prometheus container, we will create a container instance and fill in the details as shown below:

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/container-grafana-1.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/container-grafana-1.png)

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/container-grafana-2.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/container-grafana-2.png)

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/container-grafana-3.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/container-grafana-3.png)

If everything went ok, you will now be able to go to your `http://<FQDN>:3000` and be presented with the Grafana login screen.

> Note: The default login details are `"admin"/"admin"`, to change those, use the environment variables as described in: [http://docs.grafana.org/installation/docker/](http://docs.grafana.org/installation/docker/)

Once all this worked, we will now continue logging in to our Grafana instance. When we log in for the first time, we will be presented by a screen with a green button called "Add data source". We click it so we can configure our data source (see below) whereafter we click "Save & Test" to confirm if it's working. One everything is working, then go back to your home page by entering the URL: `http://<FQDN>:3000/`

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana-setup-1.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana-setup-1.png)

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana-setup-2.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana-setup-2.png)

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana-setup-3.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana-setup-3.png)

Where you can now click "Add Dashboard" and start configuring your dashboard for your application. In the end you could end up with something like this:

![/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana.png](/assets/images/posts/visualize-metrics-with-grafana-and-prometheus/grafana.png)