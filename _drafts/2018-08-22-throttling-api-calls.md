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

```javascript
// Init our calls array -> in REST this would be URLs
let calls = [];
for (let i = 1; i <= 1000; i++) {
    calls.push(i);
}

// Go over them



```



```javascript
const fs = require('fs');
const delay = require('delay');
const config = require('./config');
const AsyncUtil = require('./Utils/async');
const API = require('./API/CognitiveServiceVision');
const dataFolder = './data/';
const outputFolder = './output/';

const api = new API(config.thirdParty.cognitiveServices.imageAnalyze.apiKey);

// Get list of images in path with ascending time
let files = fs.readdirSync(dataFolder).filter(i => i.endsWith('.jpg')).sort();

// Go through files, getting the metadata
let csvResult = "shortcode;url;likes;comments;tags;\n"; // init buffer
let count = 0;
let skipped = 0;

// Process each image, getting the tags through Vision Cognitive Service, and checking the json
// Note: Out of order will appear here!
const start = async () => {
    // Go through promises, but throttled
    const limit = 10; // 10 at a time

    while (files.length > 0) {
        console.log(`[Progress] Processing ${limit} of the ${files.length} images`);
        let currentFiles = files.slice(0, limit);
        files = files.slice(limit, files.length);

         // Prepare promises
         let promises = [];
         currentFiles.forEach(i => {
            promises.push(new Promise(async (resolve, reject) => {
                // Get tags
                const imageBinary = await api.readImageByPath(dataFolder + i);
                const res = await api.analyzeImage(imageBinary);
                const tags = res.tags.map(t => t.name).join(",");
        
                // Get JSON content
                try {
                    const file = require(`${dataFolder}${i.replace('.jpg', '.json')}`);
                    csvResult += `${file.shortcode};${file.display_url};${file.edge_media_preview_like.count};${file.edge_media_to_comment.count};${tags};\n`;
        
                    count++;
                } catch (e) {
                    skipped++;
                }
        
                // Update progress
                console.log(`[Progress] ${count + skipped}/${files.length}`);

                return resolve();
            }));
        })
    
        console.log('awaiting promises');
        await Promise.all(promises);
        console.log(`Sleeping for 1000ms`);
        await delay(1000);
    }

    // Write result
    fs.writeFileSync(outputFolder + 'result.csv', csvResult);

    console.log(`Processed ${count + skipped} files, success: ${count} skipped: ${skipped} and saved to ${outputFolder}result.csv`);
}

start();
```