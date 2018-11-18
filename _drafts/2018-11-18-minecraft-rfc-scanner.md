---
layout: post
current: post
cover: 'assets/images/covers/minecraft.jpg'
navigation: True
title: Building a Minecraft Puppet Scanner with IoT Hub, a NFC 522 Reader and an Arduino Board
date: 2018-12-06 09:00:00
tags: iot data python
class: post-template
subclass: 'post tag-coding'
author: xavier
---

In Belgium we every year celebrate the coming of "Sinterklaas" on the 6th of December, a celebration for children where this mythologic figure delivers presents for all the children that behaved well that year. (see: https://en.wikipedia.org/wiki/Sinterklaas for more information). To follow this tradition, many companies hold internal events where children of the employees are invited to participate in all kinds of events. I was asked to participate in one of these events and come up with a workshop for children of all ranges - being divided in 2 groups (the very young ones, and the somewhat older ones).

## The Idea

The foundation of any idea starts with finding a base reasoning that will act as a guideline throughout the idea itself. Which in this case was that I want to spike the interest for technology in these childen, so that one day they might be interested in enrolling into technology studies 

> This is also often referred to as STEM (Science, Technology, Engineering and Mathematics). Which is an ongoing initiative world-wide to stimulate children chosing for these education areas

After some brain storming the idea popped up of creating a sort of game where the children would have to match "dolls" together with "stands" (that all almost look the same) through the use of technology. In this case the technology being a simple nfc-reader that would read the tags under these stands whereafter a message is send to an Event Hub to be able to visualize the messages as a visual on a website. To make this more attractive the "Minecraft" theme was chosen so that every kid would be able to recognize it and think of it as more fun. In this case, the dolls would be Minecraft themed and the stands would be decorated as "redstone ore" blocks.

## Purchasing and Assembling the needed material

So now we have the idea, what is needed to make this a reality?

* NFC Reader (In my case a RFID-RC522 reader)
* Raspberry PI
* Jumper Cables
* Breadboard (to be able to connect the reader to the raspberry pi)
* Lego for the stands (let's go back to being a kid again ;))
* Lego for the puppets

### Purchasing our Lego

After a quick shopping spree on our favorite Webshop together with a quick trip to the Lego store to purchase the material for the stands (a big thanks to the employees in there that helped me find all the material I needed) resulted in some Minecraft boxes and lego components to build everything we need:

**Puppets:**

![/assets/images/posts/minecraft-nfc/lego-box-1.jpg](/assets/images/posts/minecraft-nfc/lego-box-1.jpg)
![/assets/images/posts/minecraft-nfc/lego-box-2.jpg](/assets/images/posts/minecraft-nfc/lego-box-2.jpg)

**Stand Components:**

![/assets/images/posts/minecraft-nfc/lego-purchase-1.jpg](/assets/images/posts/minecraft-nfc/lego-purchase-1.jpg)
![/assets/images/posts/minecraft-nfc/lego-purchase-2.jpg](/assets/images/posts/minecraft-nfc/lego-purchase-2.jpg)
![/assets/images/posts/minecraft-nfc/lego-purchase-3.jpg](/assets/images/posts/minecraft-nfc/lego-purchase-3.jpg)

### Assembing our Lego Stand

Now we have our Lego, let's get started with building our stands for our Minecraft dolls. Here you can find the different steps that I used towards building those stands:

![/assets/images/posts/minecraft-nfc/lego-stand-part-1.jpg](/assets/images/posts/minecraft-nfc/lego-stand-part-1.jpg)
![/assets/images/posts/minecraft-nfc/lego-stand-part-2.jpg](/assets/images/posts/minecraft-nfc/lego-stand-part-2.jpg)
![/assets/images/posts/minecraft-nfc/lego-stand-part-3.jpg](/assets/images/posts/minecraft-nfc/lego-stand-part-3.jpg)
![/assets/images/posts/minecraft-nfc/lego-stand-part-4.jpg](/assets/images/posts/minecraft-nfc/lego-stand-part-4.jpg)
![/assets/images/posts/minecraft-nfc/lego-stand-part-5.jpg](/assets/images/posts/minecraft-nfc/lego-stand-part-5.jpg)

![/assets/images/posts/minecraft-nfc/lego-stand-finished.jpg](/assets/images/posts/minecraft-nfc/lego-stand-finished.jpg)

### Soldering our NFC Reader

After purchasing the RFID-255 reader a sharp eye will notice that it comes into a small package with nothing being assembled. 

![/assets/images/posts/minecraft-nfc/nfc-tags-and-reader.jpg](/assets/images/posts/minecraft-nfc/nfc-tags-and-reader.jpg)

A quick soldering trip later then resulted in something usable that we can easily stick on a breadboard

![/assets/images/posts/minecraft-nfc/nfc-reader-soldering.jpg](/assets/images/posts/minecraft-nfc/nfc-reader-soldering.jpg)
![/assets/images/posts/minecraft-nfc/nfc-reader-soldering-done.jpg](/assets/images/posts/minecraft-nfc/nfc-reader-soldering-done.jpg)
![/assets/images/posts/minecraft-nfc/nfc-reader-breadboard.jpg](/assets/images/posts/minecraft-nfc/nfc-reader-breadboard.jpg)

### Connecting the NFC Reader to our Raspberry PI

TODO

## Creating our code

Now everything is connected, the only thing left to do is write the actual code for 2 components that will do several things:

### NFC Reader Code

TODO

#### 1. Detecting our NFC Tag
#### 2. Extracting our NFC Tag Data
#### 3. Sending our data to Event Hub

#### Result

### Website Code

#### 1. Creating the base website layout

For the layout of the website, I decided to start from the design presented by the original Minecraft website [https://minecraft.net/en-us/](https://minecraft.net/en-us/) which is very recognizable and easy to recreatae using css and html, in just a few lines of codes we can get to this result:

![/assets/images/posts/minecraft-nfc/website-start.png](/assets/images/posts/minecraft-nfc/website-start.png)

#### 2. Getting the incoming data from Event Hub

Once the website base template is made, we need to hook it up to our EventHub. For this I reused my previous [work](/amqp-in-browser) that explains how you can easily hook your website to Event Hub and consume the events coming in through the AMQP protocol.

#### 3. Displaying our picture

Now we have our events coming in, we just have to add these few lines of code to process the events and update our HTML tree to show a picture:

```javascript
var decodedMessage = Utf8ArrayToStr(context.message.body.content);
var decodedMessages = decodedMessage.split('\n'); // Apparently multiple json messages per payload
var decodedMessage = JSON.parse(decodedMessages[0]);

console.log("Got Message: ");
console.log(decodedMessage);

document.querySelector("#content").innerHTML = "<img id=\"minecraft\" />";
document.querySelector("#minecraft").src = "/images/dolls/" + decodedMessage.name + ".png";
```

#### Result

When done successfully we are now able to put a doll on the NFC reader which will present us with the following screen:

![/assets/images/posts/minecraft-nfc/website-doll.png](/assets/images/posts/minecraft-nfc/website-doll.png)

Allowing the children to play around with the tags to match the different dolls to these tags.