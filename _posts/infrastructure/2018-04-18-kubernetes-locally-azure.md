---
layout: post
current: post
cover:  assets/images/covers/kubernetes.jpg
navigation: True
title: Create a local kubernetes development cluster and scale it with the cloud
date: 2018-04-18 14:11:00
tags: howto tutorials
class: post-template
subclass: 'post tag-howto tag-tutorials'
author: xavier
---

# Crawler
## Minikube / Kubernetes
1. Install minikube.exe to C:\
2. Start: ./minikube.exe start

### Minikube commands
|Command|Description|
|-|-|
|`./minikube.exe start`|Starts the Kubernetes cluster|
|`./minikube.exe dashboard`|Open the Kubernetes dashboard|
|`./minikube.exe docker-env`|Get the docker-env to connect to|
|`./minikube.exe service <deployment-name>`|Access a service in the browser|

### Kubernetes commands
|Command|Description|
|-|-|
|Creating a deployment|`kubectl run <deployment-name> --image=<image_name>:<version> --port=<port_exposed>`|
|View deployments|`kubectl get deployments`|
|View Pods|`kubectl get pods`|
|View Logs from a pod|`kubectl logs <pod-name>`|
|Make a container accessible from outside K8S|`kubectl expose deployment <deployment-name> --type=LoadBalancer`|
|View Services|`kubectl get services`|
|Delete a deployment|`kubectl delete deployment <deployment-name>`|

### Running a deployment on Azure
#### Creating an Azure AKS instance through the CLI

> Note: If you do not have the Azure CLI installed, you can also use https://shell.azure.com/

1. See if you got access to your account through `az account list`
  * If you do not have access use `az login` to login to your account
2. Set your subscription with `az account set --subscription <name_or_id>`
3. Create an AKS with `az aks create -g <resource_group> -n <name_of_aks_cluster> --node-vm-size Standard_B1ms --location westeurope --node-count 5 --ssh-key-value <path_to_ssh_pub>`
4. Configure your kubectl to connect to the 

> Note: View the VM sizes with `az vm list-sizes --location westeurope`, see the locations through `az account list-locations`
> Note2: See instances at https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/
> Note2: Filter instances with jq: `az vm list-sizes --location westeurope | jq '.[] | select(.name | contains("Standard_A"))'`


#### Using Minikube docker VM in Ubuntu Subsystem
Minikube starts a VM with a Docker daemon in it (running on Linux). Therefore we can connect to it through our subsystem by setting the params

```
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.1.35:2376"
export DOCKER_CERT_PATH="/mnt/c/Users/Nutzer/.minikube/certs"
export DOCKER_API_VERSION="1.23"
```

To connect to Kubernetes on this host:
```
kubectl config set-cluster minikube --server=https://192.168.1.35:8443 --certificate-authority=/mnt/c/Users/Nutzer/.minikube/ca.crt
kubectl config set-context minikube --cluster=minikube --user=minikube
kubectl config set-credentials minikube --client-certificate=/mnt/c/Users/Nutzer/.minikube/client.crt --client-key=/mnt/c/Users/Nutzer/.minikube/client.key
kubectl config use-context minikube
```

if we then run `docker ps` we can see all our deployed containers.

> Why do this? Well docker build and other commands do not run well under windows. Therefore it is better to build our containers on a linux environment.

### Creating and deploying a Dockerfile
#### Build dockerfile
First set your minikube docker forward:
`& minikube docker-env | Invoke-Expression`

Then you can build your image using the docker daemon within the Minikube environment:
`docker build -t <image_name>:<version> <dir>` 

example: 

`docker build -t node_image:v1 .`

#### Deploying the newly build docker image in Minikube
`kubectl run <deployment-name> --image=<image_name>:<version> --port=<port_exposed>`

example: `kubectl run node-image --image=node_image:v1`