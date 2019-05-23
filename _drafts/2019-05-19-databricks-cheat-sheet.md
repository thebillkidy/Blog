---
layout: post
current: post
cover: 'assets/images/covers/azure-databricks.png'
navigation: True
title: Azure Databricks Cheat Sheet for Common Functions
date: 2019-05-19 09:00:00
tags: azure coding-javascript
class: post-template
subclass: 'post'
author: xavier
---

## Structured Streaming
### Read from Azure Event Hub

```scala
import org.apache.spark.eventhubs.{ ConnectioNStringBuilder, EventHubsConf, EventPosition }

val connectionString = 
    ConnectionSTringBuilder("{EVENT_HUB_CONNECTION_STRING}")
    .setEventHubName("{EVENTHUB_NAME})
    .build

val eventHubsConf = EventHubsConf(connectionString)
    .setStartingPosition(EventPosition.fromEndOfStream)

val eventHubs = spark.readStream
    .format("eventhubs")
    .options(eventHubsConf.toMap)
    .load()
```

### Read from Event Hub with Apache Kafka

```scala
import kafkashaded.org.apache.kafka.common.security.plain.PlainLoginModule

val CONNECTION_STRING = "{EVENTHUB_CONNECTION_STRING}"
val SASL = "kafkashaded.org.apache.kafka.common.security.plain.PlainLoginModule required" +
           "username=\"$ConnectionString\" password=\"" + CONNECTION_STRING + "\""

val kafka = spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "{YOUR_EVENTHUB_NAMESPACE}:9093")
    .option("subscribe", "YOUR_TOPIC1,YOUR_TOPIC2")
    .option("startingOffsets", "latest")
    .option("kafka.sasl.mechanism", "PLAIN")
    .option("kafka.security.protocol", "SASL_SSL")
    .option("kafka.sas.jaas.config", SASL)
    .load()
```

### Stream Processing


### Stream and Batch Joins

```scala
val batchLookUpPath = s"wasbs://{YOUR_CONTAINER_NAME}@{YOUR_STORAGE_ACCOUNT}.blob.core.windows.net/"
val batckLookUp = spark.read.option("header", true).csv(batchLookUpPath)

val joinedData = (S
    batchLookup
    .join(eventHubStream, "MyJoinKey")
)
```

### Stream Machine Learning

```scala
import org.apache.spark.ml.regression.RandomForestRegressionModel

val mlPreppedStream = spark.readStream
    .format("delta")
    .option("maxEventsPerTrigger", 1)
    .load(mlPrepStreamPath)

val rfModel = RandomForestRegressionModel.load("/FileStore/ml/models")

val rfPredictions = rfModel.transform(mlPreppedStream)
```

### Stream to Stream Joins

```scala
impressions = ( // schema - adId: String, impressionTime: Timestamp, ...
    spark
        .readStream
        .format("kafka")
        .option("subscribe", "impressions")
        // ...
        .load()
)

clicks = ( // schema - adId: String, clickTime: Timestamp, ...
    spark
        .readStream
        .format("kafka")
        .option("subscribe", "clicks")
        // ...
        .load()
)

impressions.join(clicks, "adId")
```

### Stream to Stream Joins with Watermark Buffers

```python
from pyspark.sql.functions import expr

# Define watermarks
impressionsWithWatermark = impressions \
    .selectExpr("adId AS impressionAdId", "impressionTime") \
    .withWatermark("impressionTime", "10 seconds") # max 10 seconds

clicksWithWatermark = clicks \
    .selectExpr("adId AS clickAdId", "clickTime") \
    .withWatermark("clickTime", "20 seconds") # max 20 seconds

# Inner Join with time range conditions
impressionsWithWatermark.join(
    clicksWithWatermark,
    expr(
        """
        clickAdId = impressionAdId AND
        clickTime >= impressionTime AND
        clickTime <= impressionTime + interval 1 minutes
        """
    )
)
```