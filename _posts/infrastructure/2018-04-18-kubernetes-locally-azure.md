---
layout: post
current: post
cover:  assets/images/covers/kubernetes.jpg
navigation: True
title: Create a local kubernetes development cluster and scale it with the cloud
date: 2018-04-18 14:11:00
tags: howto tutorials
class: post-template
subclass: 'post tag-howto tag-kubernetes'
author: xavier
---

So you want to create a Kubernetes cluster to start testing your docker deployment? But you would like to test this locally first? Well, then this post is for you. Here we will go in depth on how you can set up your local development environment, and then port it to the cloud when you need the scale.

## Local Development Environment - Minikube

### Installation and starting it (Windows)

1. Install `kubectl`, see https://kubernetes.io/docs/tasks/tools/install-kubectl/ for more information
    * Note: I have installed this on the Windows Subsystem for Linux (WSL) since I already had it running on there. It also proved that I could access my `kubectl` from any other environment.
2. For Minikube, I ran `choco install minikube --version 0.25.0 --allow-downgrade` (older version since the most recent one was bugged - https://github.com/docker/machine/issues/4342)
    * Note: Chocolatey is a windows package manager, find more about it here: https://chocolatey.org/
3. Run: `minikube start --vm-driver="hyperv" --hyperv-virtual-switch="<YOUR_SWITCH>"` to start the Kubernetes cluster in the HyperV hypervisor
    * To find the <YOUR_SWITCH>, go to `Hyper-V Manager` in windows. At the right you will see `Virtual Switch Manager`, click this and find your Ethernet Adapter name. In my case this was named: `Realtek PCIe GBE Family Controller Virtual Switch`

> Note: Once you ran `minikube start` you should be able to access kubectl. If this is not the case (as for me, because I was running WSL), check the next points. Else you can skip straight towards the Commands section.

### Connecting your kubectl command to your Kubernetes cluster

Since our Kubernetes cluster is running on HyperV, we need to configure our local kubectl command to connect to this cluster. Depending on what you are using, these commands may differ. Let's go deeper on how we can configure this for PowerShell and WSL.

#### Configuring kubectl for PowerShell

Configuring kubectl for use with PowerShell is very easy. For this you just have to run the following command: `& minikube docker-env | Invoke-Expression` which will configure your Docker client to connect to the Docker Daemon running in the HyperV

#### Configuring kubectl for Windows Subsystem for Linux (WSL)

I also wanted to access my `docker` daemon, this we can do through these commands

```bash
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://<your_ip>:2376"
export DOCKER_CERT_PATH="/mnt/c/Users/<user>/.minikube/certs"
export DOCKER_API_VERSION="1.23"
```

> You can now test this by running `docker ps` to see your running containers.

Now we also need to set our `kubectl` command, which we can do like this:

```bash
kubectl config set-cluster minikube --server=https://<your_local_ip>:8443 --certificate-authority=/mnt/c/Users/<user>/.minikube/ca.crt
kubectl config set-context minikube --cluster=minikube --user=minikube
kubectl config set-credentials minikube --client-certificate=/mnt/c/Users/<user>/.minikube/client.crt --client-key=/mnt/c/Users/<user>/.minikube/client.key
kubectl config use-context minikube
```

> You can not test this by running `kubectl proxy` which should allow you to access the dashboard on http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/

## Cloud Deployment - Azure

### Creating an Azure AKS instance through the CLI

> Note: If you do not have the Azure CLI installed, you can also use https://shell.azure.com/

1. Start by checking if you have access to your account by running `az account list`
  * Note: If you do not have access use `az login` to login to your account
2. Set your subscription with `az account set --subscription <name_or_id>`
3. Create an AKS with `az aks create -g <resource_group> -n <name_of_aks_cluster> --node-vm-size Standard_B1ms --location westeurope --node-count 5 --ssh-key-value <path_to_ssh_pub>`
4. Configure your kubectl to connect to the kubernetes cluster

### Getting the right VM Size

You can view the VM sizes through the CLI with `az vm list-sizes --location westeurope`, and the locations through `az account list-locations`

> Note: Filter instances with jq: `az vm list-sizes --location westeurope | jq '.[] | select(.name | contains("Standard_A"))'`

Another way to view those sizes is through the Website: https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/

## Creating and deploying a Dockerfile in your Kubernetes Cluster

### 1. Build dockerfile

Build your image using the docker daemon:
`docker build -t <image_name>:<version> <dir>`

example: 

`docker build -t node_image:v1 .`

> Note: If you would like to skip WSL and just use Powershell, then you can configure docker to connect to the Docker Daemon in your HyperV through `& minikube docker-env | Invoke-Expression`

### 2. Deploying the newly build docker image

`kubectl run <deployment-name> --image=<image_name>:<version> --port=<port_exposed>`

example: `kubectl run node-image --image=node_image:v1`

### 3. Monitoring your deployment

Once you started your Kubernetes cluster, you can monitor it through the Kubernetes UI. To get access to this UI, you need to run the following command:

```bash
kubectl proxy
```

Whereafter a local UI server will be created that you can access through this link: http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/

## Command Reference

To get you up to speed with Minikube and Kubernetes, I included a list of useful commands as a reference

### Minikube

|Command|Description|
|-|-|
|`minikube start`|Starts the Kubernetes cluster|
|`minikube dashboard`|Open the Kubernetes dashboard|
|`minikube docker-env`|Get the docker-env to connect to|
|`minikube service <deployment-name>`|Access a service in the browser|

### Kubernetes

|Command|Description|
|-|-|
|Access dashboard|`kubectl proxy`, now view http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/#!/overview?namespace=default for the dashboard|
|Creating a deployment|`kubectl run <deployment-name> --image=<image_name>:<version> --port=<port_exposed>`|
|View deployments|`kubectl get deployments`|
|View Pods|`kubectl get pods`|
|View Logs from a pod|`kubectl logs <pod-name>`|
|Make a container accessible from outside K8S|`kubectl expose deployment <deployment-name> --type=LoadBalancer`|
|View Services|`kubectl get services`|
|Delete a deployment|`kubectl delete deployment <deployment-name>`|

## FAQ

When you have problems, always try this first:

1. Start PowerShell as Administrator
2. Run `minikube delete`
3. Run `minikube start --vm-driver hyperv`
