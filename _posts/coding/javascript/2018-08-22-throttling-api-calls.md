---
layout: post
current: post
cover: 'assets/images/covers/coding.jpg'
navigation: True
title: Creating a throttled REST API Consumer
date: 2018-08-22 09:00:00
tags: tutorials javascript
class: post-template
subclass: 'post tag-tutorials'
author: xavier
---

A common thing in Node.js is to create a REST API consumer that will perform a REST call. Due to the rise of many REST APIs, you might find yourself in the situation that you want to execute 1000s of calls (for example: Azure Cognitive Services).

Now due to the limit of these services, you will often encounter being throttled and need to end up rewriting your project to work around these limitations. But how do we do this in Node.js?

Take the following example, where we are not throttling 1000 calls:

> In the example below, we simulate real REST calls with a wait between each, showing how they will be out of order!

```javascript
const delay = require('delay');

const start = async () => {
    let promises = [];

    for (let i = 1; i <= 1000; i++) {
        promises.push(new Promise(async (resolve, reject) => {
            // Delay between 0 and 500ms to simulate REST call
            await delay(Math.random() * 500);
            console.log(`Executing ${i}`);
        }))
    }
}

start();
```

But now we executed all of those 1000 calls instantly, what if we have a rate limit of X calls per second? If we start executing these promises (which will not execute all at the same time due to CPU core limitations / thread limitations - especially in Node.JS) we will hit this rate limit quite quickly.

We thus need to write a wrapper around this code above that will throttle it for us. A good basic idea here is to collect all our URLs into an array, loop over this array and do a Promise.all await at the end to await execution. How would this look in code?

> Note: Make sure to run `npm install delay` before running the code below.

```javascript
const delay = require('delay');

// Init our calls array -> in REST this would be URLs
let calls = [];
for (let i = 1; i <= 1000; i++) {
    calls.push(async (cb) => {
        // Delay between 0 and 500ms to simulate REST call
        await delay(Math.random() * 500);
        console.log(`Executing ${i}`);
        cb();
    });
}

// Total Call count for statistics
const totalCalls = calls.length;

// Set rate limit call count and time between those calls
const rateLimitCount = 10;
const rateLimitTime = 1000;

// Our Throttler
const start = async () => {
    // Go over them in a throttled way
    while (calls.length > 0) {
        console.log(`[${Math.abs(calls.length - totalCalls)}/${totalCalls}] Performing`);
        let callsToExecute = calls.slice(0, rateLimitCount);
        calls = calls.slice(rateLimitCount, calls.length);

        // Wrap our call in a promise and wait till cb is called
        // Note: We can also implement the promise earlier, but easier here for compatibility with older code
        let promises = [];
        callsToExecute.forEach((i) => promises.push(new Promise((resolve, reject) => i(resolve))));

        // Wait for all our alls to be done
        await Promise.all(promises);

        // Throttle time
        await delay(rateLimitTime);
    }

    console.log('Done!');
}

start();
```

The code above might look complex, but the only important part is the part within our `start()` method, which takes care of throttling all our calls.

Feel free to let me know in the comments below if you have problems or suggestions.
