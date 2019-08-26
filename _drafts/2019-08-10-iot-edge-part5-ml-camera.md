---
layout: post
current: post
cover: 'assets/images/covers/iot.jpg'
navigation: True
title: Part 5 - Creating an on-edge image processor with Cognitive ServicesCar Data
date: 2019-08-10 09:00:05
tags: azure coding-javascript iot
class: post-template
subclass: 'post'
author: xavier
---

> This is Part 5 in the Iot Edge series, view the [main article](/iot-edge) or go the [part 4](/iot-edge-part4-ml-car) to view the previous article.

![/assets/images/posts/iot-edge/architecture2.png](/assets/images/posts/iot-edge/architecture2.png)

## Recap and next steps

Before we built our Machine Learning model for our car data to predict some values. In this module we now want to analyze the camera simulator video that was put on our Host machine (remember the host machine has modules running, the first simulator module will produce a video that it will put on the Host).

For this module we want to detect useful information from our camera video (such as cars, plates, pedestrians, ...) and send these to our main IoT Hub.

## Initial Setup

### Configuration

For our creation of this module, we will use the following settings:

* **Path:** `/home/xavier/iot-edge`
* **Solution:** EdgeSolutionCameraFilter
* **Module Template:** C# Module
* **Module Name:** ModuleFilterCamera
* **Docker Repository:** `xavierregistry.azurecr.io/module-filter-camera`
  
## Coding

### Solution Analysis

Splitting this solution up into sub-problems, we can now identify the following steps:

1. We will need something that can split our video stream frame-per-frame (as we would do with a camera input)
2. We will need a tool that can analyze our video images and get useful information from them
3. We will need to send the extracted information to our IoTHub

### Step 1. Splitting our Video stream frame-per-frame

We wrote our simulator before that was bundling our images in the `data/` folder into a `.mp4` video. This video should now be available on the host, so this is the data that will utilize. Now how are we able to **split this video into different frames** again and process these frames one-by-one?

This is actually a quite tricky question! One way to approach this is by utilizing `ffmpeg` and extracting the video into frames in a specific process. Another one is utilizing a package called [`OpenCvSharp`](https://github.com/shimat/opencvsharp) which includes a `VideoCapture` class that can do this. We will go for the latter in this post.

#### Installing OpenCVSharp

> **Note:** Important to see is that only `Windows` or `Ubuntu 18.04` are supported in the `OpenCvSharp` library!

Start by including this package as a reference in our project.

```bash
dotnet add package OpenCvSharp4
dotnet add package OpenCvSharp4.runtime.ubuntu.18.04-x64
# for Windows: dotnet add package OpenCvSharp4.runtime.win
```

However when installing this on an Ubuntu, it will not be able to find the reference to the `libOpenCvSharpExtern.so` file (with error: `Unable to load shared library 'OpenCvSharpExtern' or one of its dependencies.`). We can see in our `project.assets.json` file that this should reside in the folder `runtimes/ubuntu-x64/native/libOpenCvSharpExtern.so`.

After looking for this file through a find command (``), I was able to find it back at ``. However for our project this is not as trivial since it should reside in the `/usr/local/lib` or `/usr/lib` folders. Therefor I decided to **manually build it**.

#### Building OpenCVSharp

Luckily building OpenCVSharp is quite trivial. It's also easy since we are able to re-utilize this in our Docker files. 

```bash
export OPENCVSHARP_VERSION "4.1.0.20190417"
git clone https://github.com/shimat/opencvsharp.git
cd opencvsharp
git fetch --all --tags --prune && git checkout ${OPENCVSHARP_VERSION}

# Build Wrapper
cd src
mkdir build
cd build
cmake -D CMAKE_INSTALL_PREFIX=${YOUR_OPENCV_INSTALL_PATH} ..
make -j 
make install

# Copy .so to /usr/lib
OpenCvSharpExtern/libOpenCvSharpExtern.so /usr/lib
```

export LD_LIBRARY_PATH="/lib:/usr/lib:/usr/local/lib"

Then in our `Program.cs` we can write the following:

```csharp
using OpenCvSharp;

// Other Code ...



```

### Step 2. Analyze our images and extract information

For our analysis of the frames that we extracted in step 1, we will now use a service called `Azure Cognitive Services`. This allows us to have `on-edge` modules that help us to analyze the data locally with AI models, rather than having to train our own AI models.



### Step 3. Sending the extracted information to IoTHub