---
layout: post
current: post
cover: 'assets/images/covers/docker.png'
navigation: True
title: Create a script to deploy a container automatically with Azure Container Registry
date: 2019-12-24 09:00:05
tags: azure coding coding-bash
class: post-template
subclass: 'post'
author: xavier
---

Currently I am working on a new web application that will require a server for signaling purposes. Now to run this server, I would like to utilize Azure Web Apps together with a container. Since I would like a low barrier to entry, I want to be able to run a command that takes care of:

1. Login to azure automatically
2. Setting up an Azure Container Registry service if it doesn't exist yet
3. Logs in to docker through the credentials it will automatically fetch
4. Builds the docker container
5. Pushes the docker container to the Azure Container Registry service

Therefor I created an `azure-login.sh` script that takes care of logging in the user automatically and allows the user to set the subscription, and a `acr-build-and-push-container.sh` script that takes care of the steps listed above.

I can now run the command: 

```bash
./acr-build-and-push-container.sh mycontainerregistry$RANDOM ../ webapplication:v0.0.1
```

Which will:

* Build a container based on a `Dockerfile` located at `../` 
* Push the image `webapplication:v0.0.1` to `mycontainerregistry$RANDOM`

> **Note:** `$RANDOM` will give us a random integer so that we don't create an already existing azure resource

## Source Code

**azure-login.sh**

```bash
#!/bin/bash
if ! type "az" > /dev/null; then
    echo "[AZ-Login] AZ CLI not installed, installing..."
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
fi

echo "[AZ-Login] AZ CLI Installed, continuing"
az login --output table --query '[].{name: name, subscriptionId: id, isDefault: isDefault}'
# az account list --output table
echo "[AZ-Login] Select Subscription"
read -p "Subscription: " var_azure_subscription
echo "[AZ-Login] Setting Subscription to $var_azure_subscription"
az account set --subscription $var_azure_subscription
echo "[AZ-Login] Logged in!"
```

**acr-build-and-push-container.sh**
```bash
#!/bin/bash
# =====================================================
# Parameters
# =====================================================
# Base Parameters
REQUIRE_LOGIN=${3:-"true"}
AZURE_LOCATION=westeurope
RESOURCE_GROUP=webrtc-file-dropper

# Specific Parameters
CONTAINER_REGISTRY_NAME=$1
DOCKER_FILE_LOCATION=$2
DOCKER_IMAGE_NAME_AND_VERSION=$3

# Print Parameters
echo "================================================="
echo "================== PARAMETERS ==================="
echo "================================================="
echo "AZURE_LOCATION: $AZURE_LOCATION"
echo "RESOURCE_GROUP: $RESOURCE_GROUP"
echo "REQUIRE_LOGIN: $REQUIRE_LOGIN"
echo "CONTAINER_REGISTRY_NAME: $CONTAINER_REGISTRY_NAME"
echo "DOCKER_FILE_LOCATION: $DOCKER_FILE_LOCATION"
echo "DOCKER_IMAGE_NAME_AND_VERSION: $DOCKER_IMAGE_NAME_AND_VERSION"

# =====================================================
# Functions
# =====================================================
exit_onerror() {
    if ! [ $? -eq 0 ]; then
        exit
    fi
}

# ================= PARAMETER CHECK ====================
if [ -z $CONTAINER_REGISTRY_NAME ]; then
    echo "Usage: $0 <container_registry_name> <dockerfile_location> <docker_image_name_and_version"
    echo "Example: $0 mycontainerregistry\$RANDOM ./ my-image:v1"
    exit
fi

# ====================== LOGIN ==========================
if [[ $REQUIRE_LOGIN == "true" || $REQUIRE_LOGIN == "1" ]]; then
    ./azure-login.sh
fi

# =======================================================
# PRE-REQUISITES
# =======================================================
echo "================================================="
echo "=============== PRE-REQUISITES =================="
echo "================================================="

# Install docker if not installed
if ! type "docker" > /dev/null; then
    echo "[Docker] Docker not installed, installing..."
    sudo apt-get update
    sudo apt install docker.io
fi

# Make sure we can reach docker
if [[ $(docker ps 2>&1) == "Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?" ]]; then
    echo "[Docker] Can not reach the Docker Daemon, check if 'unix:///var/run/docker.sock' exists"
    echo "[Docker] Note - WSL 1: Expose daemon on tcp://localhost:2375 and run 'echo \"export DOCKER_HOST=tcp://localhost:2375\" >> ~/.bashrc && source ~/.bashrc'"
    exit
fi

echo "[Docker] Installed, continuing"

# Create Resource Group
echo "[AZ-Group] Creating resource group $RESOURCE_GROUP"
az group create -l $AZURE_LOCATION -n $RESOURCE_GROUP > /dev/null
exit_onerror

# Make sure container registry exists, else create it
if [[ $(az acr show --name $CONTAINER_REGISTRY_NAME 2>&1) == "ERROR: The resource with name '$CONTAINER_REGISTRY_NAME' and type 'Microsoft.ContainerRegistry/registries' could not be found in subscription"* ]]; then
    echo "[AZ-ACR] Container Registry with name $CONTAINER_REGISTRY_NAME does not exist, attempting to create one with 'Basic' sku"

     # skus: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-skus
    az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_REGISTRY_NAME \
    --sku "Basic" \
    > /dev/null

    exit_onerror
fi

echo "[AZ-ACR] Container Registry $CONTAINER_REGISTRY_NAME exists"

# =======================================================
# BUILD CONTAINER
# =======================================================
echo "================================================="
echo "============= BUILDING CONTAINER ================"
echo "================================================="
echo "[Docker] Building container"
docker build -f "$DOCKER_FILE_LOCATIONDockerfile" -t "$CONTAINER_REGISTRY_NAME.azurecr.io/$DOCKER_IMAGE_NAME_AND_VERSION" $DOCKER_FILE_LOCATION
exit_onerror

echo "================================================="
echo "============== PUSHING CONTAINER ================"
echo "================================================="
echo "[AZ-ACR] Enabling admin"
az acr update -n $CONTAINER_REGISTRY_NAME --admin-enabled true 1> /dev/null
exit_onerror

echo "[AZ-ACR] Fetching credentials"
ACR_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --query "passwords[0].value")
exit_onerror

echo "[Docker] Logging in"
# Note: use sh -c since bash interprets it wrong and will fail to login
sh -c "docker login -u $CONTAINER_REGISTRY_NAME -p $ACR_PASSWORD $CONTAINER_REGISTRY_NAME.azurecr.io"

echo "[AZ-ACR] Pushing container"
docker push "$CONTAINER_REGISTRY_NAME.azurecr.io/$DOCKER_IMAGE_NAME_AND_VERSION"
```