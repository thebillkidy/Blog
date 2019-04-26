---
layout: post
current: post
cover: 'assets/images/covers/stream.jpeg'
navigation: True
title: Sampling a real-time stream
date: 2019-04-23 09:00:00
tags: coding coding-javascript big-data
class: post-template
subclass: 'post tag-coding'
author: xavier
---

A common problem when working with real-time streams is that you are unaware of the data going in there due to the vast amount of systems connected to it and producing data. Therefor it is interesting to be able to "sample" a stream, where you will connect to the stream with your credentials, wait till an event comes in and then end the connection.

But how can we do this easily? What code can make enable us to do this? Well there are some parts that we need to keep in mind when designing:

1. Streams can be byfrom different producers (Azure Event Hub, Apache Kafka, Socket Stream, ...)
1. Streams can receive events in a very large time span (> 10min)
2. Streams can be very fast (millions of events per second)
3. Streams can have events arriving out of order
4. ...

In the scope for our little project are numbers 1, 2 and 3. So let's discuss on how we can tackle those and how it resolves into creating our sampler.

## 1. Streams can be from different producers

Every producer has their own SDK. But how can we make a sampler that supports more than just one? Well it's all about interfaces! (or actually more commonly called the [**Strategy Pattern**](https://en.wikipedia.org/wiki/Strategy_pattern)).

We will create 2 methods (`open()` and `close()`) that our strategies have to implement, so that our parent class can call these methods, without worrying if the underlying class has them or not.

**[IStream.ts](https://github.com/thebillkidy/PublicProjects/blob/master/JS/Azure/EventHub/StreamSample/stream/IStream.ts)**

```javascript
export default interface IStream {
    open(e: EventEmitter) : void;
    close() : void;
}
```

In this way, we can relatively easily implement providers for:

* [Azure Event Hub](https://github.com/thebillkidy/PublicProjects/blob/master/JS/Azure/EventHub/StreamSample/stream/streamEventHub.ts)
* [Socket](https://github.com/thebillkidy/PublicProjects/blob/master/JS/Azure/EventHub/StreamSample/stream/streamSocket.ts)

## 2. Streams can have a large time span between events

Since streams don't always send events every X seconds, we need to make sure that when designing a sampler, that we take this into account. Therefor we need to create a kind of "timeout" mechanism, that kills the stream if nothing is received within the following seconds.

In Javascript we can relatively easily do this by utilizing the `setTimeout` function that will call a function once it is done

```javascript
const timeout = 1000; // 1 second
let timeoutFunction = setTimeout(() => console.log('triggered'), timeout);
```

## 3. Streams can have events arriving very fast

Streams are supposed to be fast by nature, so how do we only get one event? Well most of the providers allow you to process incoming messages. But to instantly stop when something arrived, we are best off to use an `EventEmitter` that will fire as soon as something arrives. 

This way our main process can catch this event and call our `close()` method from point 1.

For our Socket Stream this looks like this (with `onData()` doing just this):

```javascript
async open(eventEmitter) {
    this.eventEmitter = eventEmitter;

    return new Promise((resolve, reject) => {
        this.connection = net.connect(this.port, this.host, () => {
            return resolve();
        });

        this.connection.on('data', this.onData.bind(this));
        console.log('[StreamSocket] Stream Opened');
    });
}

onData(msg) {
    this.eventEmitter.emit('stream_message_received', msg);
}
```

## 4. Merging 2 promises with only one firing

Now the most difficult part comes: "How do we cancel another promise if the other one fired?"

To solve this, I utilized the `EventEmitter` as a kind of `bus` concept. The different promises (timeout or event received) will then fire an event through this `EventEmitter`, so that `once()` an event is received, it will return a main promise.

Illustrating this:

```javascript
let bus = new EventEmitter();

let result = await new Promise(async (resolve, reject) => {
    bus.once('event_1', (message) => resolve('event1'));
    bus.once('event_2', () => resolve('event2'));

    // Fire event 1 or 2
    setTimeout(() => bus.emit('event_1'), Math.random() * 4000);
    setTimeout(() => bus.emit('event_2'), Math.random() * 4000);
});

console.log(result);
```

## 5. Conclusion

By merging the concepts above, we can now write a sampler that will connect to our different streams and wait till OR a message arrived OR a timeout was received, whereafter it will return us the result through an API that can be written.

To see this in working code, feel free to check this repository: [https://github.com/thebillkidy/PublicProjects/tree/master/JS/Azure/EventHub/StreamSample](https://github.com/thebillkidy/PublicProjects/tree/master/JS/Azure/EventHub/StreamSample)