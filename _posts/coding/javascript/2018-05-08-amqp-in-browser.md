---
layout: post
current: post
cover: 'assets/images/covers/coding.jpg'
navigation: True
title: Getting AMQP to work in your browser
date: 2018-05-08 09:00:00
tags: tutorials javascript
class: post-template
subclass: 'post tag-tutorials'
author: xavier
---

For one of my customers, I had to be able to connect to an EventHub through the browser, so how did I do this? So we know that EventHub works with the AMQP protocol, so what if we could get this working in the frontend?

After fiddling a bit with different kind of solutions, I went with a quick and dirty way to get this working. To start, let's download the RHEA library which allows us to send messages using the AMQP protocol [https://github.com/amqp/rhea](https://github.com/amqp/rhea). This library however is designed to work with Node.js, so we will have to make some adaptations to get this working in our browser using Browserify.

## Changes to get RHEA working in a browser context

### lib/types.js

```javascript
} else if (o instanceof Buffer) {
	return types.wrap_binary(o);
}
```

change to

```javascript
} else if (o instanceof Buffer || o instanceof ArrayBuffer) {
	return types.wrap_binary(o);
}
```

### lib/container.js

Add the following code somewhere.

```javascript
Container.prototype.disconnect = function () {
    this.connection.close();
};
```

Modify:

```javascript
Container.prototype.connect = function (options) {
    return new Connection(options, this).connect();
};
```

to

```javascript
Container.prototype.connect = function (options) {
  this.connection = new Connection(options, this);
  return this.connection.connect();
};
```

### Build

```bash
# Note: this might fail on the tests, ignore it
npm install

# Note: this will output rhea.js in the ./dist folder
npm run browserify
```

## Connecting to an EventHub

To connect to our EventHub, feel free to use the code below:

```javascript
// [eventHubPath]/ConsumerGroups/[consumerGroup]/Partitions/[partitionId]
// Endpoint=sb://<eventhub>.servicebus.windows.net/;SharedAccessKeyName=<sharedAccessKeyName>;SharedAccessKey=<sharedAccessKey>;EntityPath=<entity-path>
// wss://<eventhub>.servicebus.windows.net:443/$servicebus/websocket -->
var hostName = "<eventhub>.servicebus.windows.net";
var sharedAccessKeyName = "RootManageSharedAccessKey";
var sharedAccessKey = "<sharedAccessKey>";
var wsServer = "wss://" + hostName + ":443/$servicebus/websocket"; // Our websocket server
var eventhubName = "<eventhubName>";
var eventHubConsumerGroup = "<eventhubConsumerGroup>";
var connectionSettings = {
  "hostname": hostName,
  "container_id": "conn" + new Date().getTime(),
  "max_frame_size": 4294967295,
  "channel_max": 65535,
  "idle_timeout": 120000,
  "outgoing_locales": 'en-US',
  "incoming_locales": 'en-US',
  "offered_capabilities": null,
  "desired_capabilities": null,
  "properties": {},
  "connection_details": null, // Will be set below!
  "reconnect": false,
  "username": sharedAccessKeyName,
  "password": sharedAccessKey,
  "onSuccess": null,
  "onFailure": null,
}

// Connect to the EventHub over AMQP
var sender;
var client = require("rhea");
var ws = client.websocket_connect(WebSocket);

connectionSettings.connection_details = ws(wsServer, ["AMQPWSB10"]);
client.on('connection_open', function (ctx) {
  console.log('Connection Opened');

  // Connect to a topic, $management contains our partitions
  // More: https://github.com/Azure/azure-event-hubs-node/blob/91ba72d47f0fbc0e07318c221102bbcb01df271a/send_receive/lib/client.js#L169
  connection.open_receiver('$management');
  sender = connection.open_sender('$management');
});

client.on('connection_error', function (ctx) {
  console.log('Connection Error: ' + ctx);
});

client.on('connection_close', function (ctx) {
  console.log('Connection Closed');
});

client.on('receiver_open', function (ctx) {
  console.log('Receiver open');
  console.log(ctx);
});

client.on('sendable', function (context) {
  // Our sender to the $management topic has been opened
  // Send a message to our $management topic to fetch our partitions
  sender.send({
    body: client.message.data_section(str2ab('[]')),
    application_properties: {
      operation: 'READ',
      name: eventhubName,
      type: 'com.microsoft:eventhub'
    }
  });
});

client.on("message", function (context) {
  if (context.receiver.source.address === '$management') {
    var p = context.message.body;
    var partitionCount = p.partition_count;

    // Open receivers for all my partitions
    for (var i = 0; i < partitionCount; i++) {
      console.log('Opening receiver for ' + '/' + eventhubName + '/ConsumerGroups/' + eventHubConsumerGroup + '/Partitions/' + i)
      connection.open_receiver({
        source: {
          address: '/' + eventhubName + '/ConsumerGroups/' + eventHubConsumerGroup + '/Partitions/' + i,
          filter: client.filter.selector("amqp.annotation.x-opt-enqueuedtimeutc > " + (new Date().getTime()))
        }
      });
    }
  }

  // Process message
  if (!context.message.body.content) {
    return;
  }

  var decodedMessage = Utf8ArrayToStr(context.message.body.content);
  var decodedMessages = decodedMessage.split('\n'); // Apparently multiple json messages per payload
  console.log(decodedMessages);
});


client.on("error", function (ctx) {
  console.log(ctx);
})

var connection = client.connect(connectionSettings);
```

## References

* https://github.com/amqp/rhea
* https://blogs.msdn.microsoft.com/zhiqing/2017/03/28/how-to-use-amqp-protocol-in-browser-javascript/ 
* https://github.com/michaeljqzq/NOT_AZURE_IotDevTool_Service/blob/master/util.ts
* https://github.com/Azure/azure-event-hubs-node/blob/91ba72d47f0fbc0e07318c221102bbcb01df271a/send_receive/lib/client.js#L169