---
layout: post
current: post
cover: 'assets/images/covers/microsoft3.jpg'
navigation: True
title: Azure Optimization Tips and Tricks
date: 2020-03-30 09:00:00
tags: azure
class: post-template
subclass: 'post'
author: xavier
---

For most businesses out there it are hard times due to the recent crisis, causing a lot of pressure on optimizing OPEX costs as much as possible. That's why I would love to help all of you out there with some quick tips and tricks on how you can keep your spendings to a minimum on the Azure platform, or how you are able to gain quick benefits.

This list is for sure far of complete, but I will keep adding more along the way. Always feel free to comment below so I can add your tips and tricks to the list as well.

# Tips and Tricks - General

Let's start of with some general guidance when optimizing workloads:

## Shutdown/Resume vs Scale-Down/Scale-Up

One of the - by far easiest - ways of optimising your workload is to start looking into Shutting Down and Resuming or Scaling Down and Scaling Up your workload. However, when doing this we have to keep some points into account that might influence our decision here. Here you can find a list of advantages and disadvantages that each choice entails. 

||Shutdown/Resume|Scale-Down/Scale-Up|
|-|-|-|
|**Advantages**|• **Savings are more substantial** than scaling-down since compute will be turned off completely|• Very **easy to realize gain** (almost no engineering effort needed), especially on Development, Staging and Testing environments|
|**Disadvantages**|• **Engineering Effort is larger** compared to scale-down/scale-up<br />• **Requires automation code** to ensure successful start-up of the components|• **Requires upfront knowledge of current utilization rate** (might be more difficult to calculate)<br />• **Cost savings are not maximized** (though compensation happens due to low engineering cost)|

As a **summary** I would suggest to do the following when performing this excercise:
* What is the dependency graph of your architecture components?
* Is the trade-off engineering effort <> cost gains worth it?

To **realize the decision** made above, create a script that is able to automate the decision above, utilizing either the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) or [PowerShell Module](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps) together with [Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/) or [Azure Automation](https://docs.microsoft.com/en-us/azure/automation/)

> Note: an example of Starting/Stopping VMs during off-hours can be found here: [https://docs.microsoft.com/en-us/azure/automation/automation-solution-vm-management](https://docs.microsoft.com/en-us/azure/automation/automation-solution-vm-management)

# Tips and Tricks - Service Dependent

|Service|Tips|
|-|-|
|**Azure CosmosDB**|• Utilize [AutoPilot](https://docs.microsoft.com/en-us/azure/cosmos-db/provision-throughput-autopilot) if possible<br />• If multiple containers are used, try to enable [shared throughput](https://docs.microsoft.com/en-us/azure/cosmos-db/set-throughput)<br />• [Optimize your query performance](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-query-metrics#best-practices-for-query-performance)
|**Azure Databricks**|• When running automated jobs, utilize the **"Data Engineering"** tier! (Don't utilize the clusters page in Databricks, use an On-Demand cluster through the Jobs page or [Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/solution-template-databricks-notebook))
|**Azure Kubernetes Service (AKS)**|• Turn down the development, staging or production nodes towards 1 where possible.|
|**Virtual Machines (VM)**|• If you know your workload, you can easily apply [reserved instances](https://azure.microsoft.com/en-us/pricing/reserved-vm-instances/) where possible for a 1Y or 3Y commitment|
|**SQL DB**|• If you have multiple databases that have a varying load, it could be interesting to utilize [Elastic Pools](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-elastic-pool)|