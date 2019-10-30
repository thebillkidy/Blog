Title: Deploying Ghost 3.0 on an Azure Container Instance with files stored on Azure Files

https://hub.docker.com/_/ghost/?tab=description

So I've been running my site as a static built site through the excellent use of Jekyll. Which meant that each time I pushed my markdown files to git that a pipeline was being triggered that would automatically compile everything to HTML.

This has worked splendidly and it's still the system I love, however some things were missing that I really would like to include:
* Admin panel to manage my posts
* Newsletter management 
* Email update on new posts
* Integrated Analytics

Which had me come up with an extension on my blog: "How can I create an admin panel that would still allow me to keep my existing set-up?" Well this was answered beautifully by the release of [Ghost 3.0](https://ghost.org/blog/3-0/)!

> Note: I've always loved Ghost (especially the editor!), but it always lacked static sites due to its architecture nature. However since recent developments they've completely decoupled this now.

There are a few options we could run Ghost as:
1. Download the source code and install it
2. Buy the monthly plan on Ghost
3. Host it on a container (Azure Container Instance)
4. Host it on an app server (Azure App Service)

Comparing the options above, I concluded to utilize option #4, why?

1. Too much work
2. Too expensive (29$ for the basic plan if annual plan)
3. Also expensive (37.85$ for 1 GB, 1 vCPU) 
	* Next to this, when you want to mount the Azure File share you will need to specify the "mfsymlinks" option for symlinks, which is not supported yet on Azure Container Instance
4. Cheapest! 13.14$ for 1 instance under the Basic tier (which is made for Dev/Test but is fine for 1 user accessing the admin panel ;))


TODO: Explain more

## Installing

### Configuring the subscription

First set your subscription:

```bash
# Show subscription
az account list

# Set subscription
az account set --subscription <id>
```

### Creating the storage account ad File Share

So that we can run the following bash script I quickly created to create an Azure Files share that we mount on our Container Instance that will run our Docker instance.


```bash
# =======================================================
# Parameters
# =======================================================
ACI_PERS_RESOURCE_GROUP=my-blog
ACI_PERS_STORAGE_ACCOUNT_NAME=myblogstorage$RANDOM
ACI_PERS_LOCATION=westeurope
ACI_PERS_SHARE_NAME=blog-posts

APP_SERVICE_RESOURCE_GROUP=$ACI_PERS_RESOURCE_GROUP
APP_SERVICE_PLAN_NAME=XavierGhostAppServicePlan$RANDOM
APP_SERVICE_NAME=XavierGhostAppService$RANDOM
APP_SERVICE_CONTAINER_PATH=ghost:latest
APP_SERVICE_LOCATION=$ACI_PERS_LOCATION
APP_SERVICE_SKU=B1

# Create Resource Group
az group create -l $ACI_PERS_LOCATION -n $ACI_PERS_RESOURCE_GROUP

# =======================================================
# Create the File Share
# =======================================================
# Create the storage account with the parameters
az storage account create \
    --resource-group $ACI_PERS_RESOURCE_GROUP \
    --name $ACI_PERS_STORAGE_ACCOUNT_NAME \
    --location $ACI_PERS_LOCATION \
    --sku Standard_LRS

# Create the file share
az storage share create --name $ACI_PERS_SHARE_NAME --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME
#az storage container create --name $ACI_PERS_SHARE_NAME --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME

# =======================================================
# Get Storage Credentials
# =======================================================
STORAGE_KEY=$(az storage account keys list --resource-group $ACI_PERS_RESOURCE_GROUP --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME --query "[0].value" --output tsv)
echo $STORAGE_KEY

# =======================================================
# Deploy Container
# =======================================================
# Expose port 80, nginx is utilized to automatically redirect to 2368
# Mount Azure Files under /var/lib/ghost
#az container create \
#    --resource-group $ACI_PERS_RESOURCE_GROUP \
#    --name ghost-blog \
#    --image ghost:latest \
#    --cpu 1 \
#    --memory 1 \
#    --ports 80 \
#    --dns-name-label xavier-ghost \
#    --azure-file-volume-account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
#    --azure-file-volume-account-key $STORAGE_KEY \
#    --azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
#    --azure-file-volume-mount-path /var/lib/ghost/content
	
	
# =======================================================
# App Service Deployment with the Ghost Container
# =======================================================
# Create an App Service Plan 
#     Note: we do not add --is-linux since we need mounting and it's not supported there - https://docs.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest
az appservice plan create --name $APP_SERVICE_PLAN_NAME --resource-group $APP_SERVICE_RESOURCE_GROUP --location $APP_SERVICE_LOCATION --sku $APP_SERVICE_SKU --is-linux

# Create a Web App
az webapp create --name $APP_SERVICE_NAME --plan $APP_SERVICE_PLAN_NAME --resource-group $APP_SERVICE_RESOURCE_GROUP --deployment-container-image-name $APP_SERVICE_CONTAINER_PATH

# Set custom port
az webapp config appsettings set --resource-group $APP_SERVICE_RESOURCE_GROUP --name $APP_SERVICE_NAME --settings WEBSITES_PORT=2368
az webapp config appsettings set --resource-group $APP_SERVICE_RESOURCE_GROUP --name $APP_SERVICE_NAME --settings url=https://$APP_SERVICE_NAME.azurewebsites.net/

# Configure Web App with a Custom Docker Container from Docker Hub
# az webapp config container set --docker-custom-image-name $APP_SERVICE_CONTAINER_PATH --name $APP_SERVICE_NAME --resource-group $APP_SERVICE_RESOURCE_GROUP

# Turn on docker logging
# Will be visible in: https://$APP_SERVICE_NAME.scm.azurewebsites.net/api/logs/docker
az webapp log config --name $APP_SERVICE_NAME --resource-group $APP_SERVICE_RESOURCE_GROUP --docker-container-logging filesystem

# Mount or Azure Files
az webapp config storage-account add \
    -g $APP_SERVICE_RESOURCE_GROUP \
    -n $APP_SERVICE_NAME \
    --custom-id CustomId \
    --storage-type AzureFiles \
    --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
    --share-name $ACI_PERS_SHARE_NAME \
    --access-key $STORAGE_KEY \
    --mount-path /var/lib/ghost/content

#az webapp config storage-account add \
#    -g $APP_SERVICE_RESOURCE_GROUP \
#    -n $APP_SERVICE_NAME \
#    --custom-id CustomId \
#    --storage-type AzureBlob \
#    --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
#    --share-name $ACI_PERS_SHARE_NAME \
#    --access-key $STORAGE_KEY \
#    --mount-path /var/lib/ghost/content


# Copy the result of the following command into a browser to see the web app.
echo http://$APP_SERVICE_NAME.azurewebsites.net
echo https://$APP_SERVICE_NAME.scm.azurewebsites.net/api/logstream
echo https://$APP_SERVICE_NAME.scm.azurewebsites.net/api/logs/docker
```


az webapp log tail --name $APP_SERVICE_NAME --resource-group $APP_SERVICE_RESOURCE_GROUP

/path/to/ghost/blog:/var/lib/ghost/content ghost:1-alpine
 -p 3001:2368 