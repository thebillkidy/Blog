---
layout: post
current: post
cover: 'assets/images/covers/infrastructure.jpg'
navigation: True
title: Big Data Platform Comparisons
date: 2019-05-27 09:00:00
tags: azure big-data
class: post-template
subclass: 'post'
author: xavier
---

Choosing a platform for doing your Big Data processing tasks is not an easy choice. At one side you want to be flexible and open, but at another you would like a stable and robust platform that can handle your critical business workloads.

This is the reason that I decided to create a comparison of the different Big Data platforms from a **Microsoft** perspective.

> **Note:** I am confident that other major cloud vendors such as Google and AWS, or even other vendors also have have excellent Big Data platform products, but seeing that I am not a specialist in these, I would like to keep it to the ones I am proficient in.

> **Note 2:** This will also include a lot of assumptions to make the comparison as fair as possible.

The products that we will be covering are:

* [Azure Databricks](https://azure.microsoft.com/en-us/services/databricks/)
* [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/)
* [Machine Learning Services](https://azure.microsoft.com/en-us/services/machine-learning-service/)
* [Cloudera Cloudbreak (old Hortonworks)](https://hortonworks.com/open-source/cloudbreak/)
* [Apache Spark on Kubernetes (K8S)](https://github.com/apache/spark/tree/master/resource-managers/kubernetes)

> **Note:** I will not include a detailed overview of the services but rather a comparison. For a detailed overview, feel free to check the associated links for each service.

## Assumptions

As in any comparison, some assumptions were made. In this case the following assumptions were made:

* 1 Web Node was utilized where a web interface is required
  * **Size:** [D2v3](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-general#dv3-series-1)
  * **Solutions:** Cloudera Cloudbreak
* 2 Head Nodes were utilized where required for HA purposes
  * **Size:** [A3](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-general#av2-series)
  * **Solutions:** HDInsight, Cloudera Cloudbreak
* 3 Worker Nodes were utilized 
  * **Size:** [D13v2](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-memory#dsv2-series-11-15)
  * **Solutions:** Azure Databricks, HDInsight, Machine Learning Services, Cloudera Cloudbreak, Apache Spark on Kubernetes (K8S)
* No Data Disks were selected
* For Pausing enabled clusters, 8h was included (240h/mo) was taken, for others 24h (720h/mo)
  * Note: 8h pricing is also included in others, but has been wrapped with `()` for clarity reasons. They can pause but extra work will be required to support this.

## Comparison Matrix

| - |Spark on K8S|Azure Databricks|HDInsight|Cloudera Cloudbreak|Azure Machine Learning Services|
|---|:-:|:-:|:-:|:-:|:-:|
|**Multi Cloud**|Yes|Yes|No|Yes|Yes *(1)*|
|**Deployment Model**|IaaS / Half PaaS|PaaS|PaaS (with full cluster control)|IaaS|PaaS, with integrated support for compute on ML Services, VMs, Databricks, HDI and K8S|
|**Auto Scale**|Yes (will require manual configuration)|Yes|Yes (preview)|Yes|Yes (on Machine Learning Compute or Databricks)|
|**Compute Pause Support**|No (but scale-down yes and can be automated)|Yes|No (but scale-down yes, and can be automated)|Yes|Yes|
|**Language Support**|Scala, Python, R, SQL, Java, [.NET](https://github.com/dotnet/spark)|Scala, Python, R, SQL, Java|Scala, Python, R, SQL, Java|Scala, Python, R, SQL, Java|Python & REST|
|**Notebook Support**|No|Yes|Yes|Yes|Yes|
|**Scheduling Support**|No|Yes|Yes, through Oozie|Yes, through Oozie|Yes, Through Platform or SDK integration|
|**Tooling Re-training Required**|Server management through K8S|Databricks Interface|HDP Components|HDP Components & Cloudbreak Interface|SDK Interface OR GUI Interface in Azure Portal|
|**Extensibility**|No|No|Yes|Yes|Yes|
|**Performance Gain Out-Of-The-Box**|0%|40%|0%|0%|N/A|
|**Cost**|24h: 1,662.21 USD<br />(8h: 546.48 USD)|24h: 2,409.00 USD<br />8h: 803,88 USD<br />Note: perf increase added *(2)*|24h: 2,084.00 USD<br />(8h: 685.15 USD)|24h: 2,100.36 USD<br />8h: 749.43 USD<br />+375 license cost *(3)* / mo|Depends on K8S, HDI, Databricks VMs implementation|

**Notes:**
* **(1):** Multi Cloud since this is an offering that can be implemented through an SDK and is more on the Model Training and Operationalization part. Notebook support however has been included recently, making this a viable solution now. For Spark workloads, I however recommend to include another service with it.
* **(2):** Databricks offers an out of the box performance increase - see: [website1](https://databricks.com/blog/2017/07/12/benchmarking-big-data-sql-platforms-in-the-cloud.html) and [website2](https://github.com/databricks/benchmarks) for more details
* **(3):** For enterprise support, licenses are required. See [this website](https://hortonworks.com/services/support/enterprise/) for more information. For our comparison, we took a price of <span></span>1.500 USD per license for only the worker nodes (so 3 worker nodes * 1.500 USD / 12 months). Exact pricing needs to be checked with Cloudera and this is purely indicative!

## References

More references can be found for the following products at these links:

**HDInsight**
  * **AutoScale:** [https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-autoscale-clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-autoscale-clusters)
  * **Jupyter Notebook:** [https://docs.microsoft.com/en-us/azure/hdinsight/spark/apache-spark-jupyter-notebook-kernels](https://docs.microsoft.com/en-us/azure/hdinsight/spark/apache-spark-jupyter-notebook-kernels)
  * **Job Scheduling:** [https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-oozie-linux-mac#schedule-jobs](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-oozie-linux-mac#schedule-jobs)

**Spark on K8S**
  * **Autoscale:** [https://docs.microsoft.com/en-us/azure/aks/cluster-autoscaler](https://docs.microsoft.com/en-us/azure/aks/cluster-autoscaler) and [https://github.com/kedacore/keda](https://github.com/kedacore/keda)

**Cloudbreak**
  * **Autoscale:** [https://hortonworks.github.io/cloudbreak-documentation/latest/autoscaling/index.html](https://hortonworks.github.io/cloudbreak-documentation/latest/autoscaling/index.html)
  * **Notebooks:** [https://community.hortonworks.com/articles/104453/using-zeppelin-with-spark-21-on-hdp-26-cluster-bui.html](https://community.hortonworks.com/articles/104453/using-zeppelin-with-spark-21-on-hdp-26-cluster-bui.html)

**Azure Machine Learning Services**
  * **Compute Environments:** [https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-set-up-training-targets](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-set-up-training-targets)