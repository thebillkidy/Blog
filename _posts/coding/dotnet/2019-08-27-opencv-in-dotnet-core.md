---
layout: post
current: post
cover: 'assets/images/covers/dotnet.png'
navigation: True
title: Utilizing OpenCV in C# .NET Core to grab frames from a video
date: 2019-08-27 09:00:00
tags: azure coding-csharp
class: post-template
subclass: 'post'
author: xavier
---

While working on a blog post where I was utilizing .NET Core I wanted to be able to utilize OpenCV. [OpenCV](https://opencv.org/) is a library of functions that allow us to quickly perform computer vision tasks (e.g. making a picture black and white, canny edge, face recognition, ...). But how do we utilize this in .NET Core?

For the example in this Blog Post, we will work on the use case of **extracting frames from a video file** and saving these individually.

## Installing OpenCV

To install OpenCV, we will utilize a docker container (since most of our applications run there nowadays anyways). The following will take care of :

* Downloading and installing OpenCV
* Downloading and installing OpenCV-Contrib

```bash
FROM microsoft/dotnet:2.1-sdk AS build-env
MAINTAINER Xavier Geerinck <xageerin@microsoft.com>

ENV OPENCV_VERSION="4.1.1"
ENV OPENCV_INSTALLATION_DIR="/opt/opencv/"
ENV OPENCV_SHARP_VERSION="4.1.0.20190417"

WORKDIR /app

# =================================
# Install OpenCV 4 & OpenCV_contrib
# =================================
# Update Packages
RUN sudo apt update
RUN sudo apt -y install build-essential checkinstall cmake pkg-config yasm
RUN sudo apt -y install git gfortran
RUN sudo apt -y install libjpeg8-dev libjpeg-dev libpng-dev
RUN sudo apt -y install libjasper1
RUN sudo apt -y install libtiff-dev
RUN sudo apt -y install libavcodec-dev libavformat-dev libswscale-dev libdc1394-22-dev
RUN sudo apt -y install libxine2-dev libv4l-dev
RUN sudo apt -y install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
RUN sudo apt -y install libgtk2.0-dev libtbb-dev qt5-default
RUN sudo apt -y install libatlas-base-dev
RUN sudo apt -y install libfaac-dev libmp3lame-dev libtheora-dev
RUN sudo apt -y install libvorbis-dev libxvidcore-dev
RUN sudo apt -y install libopencore-amrnb-dev libopencore-amrwb-dev
RUN sudo apt -y install libavresample-dev
RUN sudo apt -y install x264 v4l-utils
RUN sudo apt -y install libprotobuf-dev protobuf-compiler
RUN sudo apt -y install libgoogle-glog-dev libgflags-dev
RUN sudo apt -y install libgphoto2-dev libeigen3-dev libhdf5-dev doxygen
RUN sudo apt -y install libtbb2 libjasper-dev libdc1394-22-dev

# Download version
RUN cd ${OPENCV_INSTALLATION_DIR}
RUN wget https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip -Oopencv-${OPENCV_VERSION}.zip
RUN unzip opencv-${OPENCV_VERSION}.zip
RUN wget https://github.com/opencv/opencv_contrib/archive/${OPENCV_VERSION}.zip -Oopencv_contrib-${OPENCV_VERSION}.zip
RUN unzip opencv_contrib-${OPENCV_VERSION}.zip

# Install OpenCV
RUN cd opencv-${OPENCV_VERSION}
RUN mkdir build && cd build
RUN cmake .. \
	-DCMAKE_BUILD_TYPE=Release \
	-DOPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-4.1.0/modules \
	# you might want to specify other CMake flags through -Dflag=value
RUN sudo make -j$(grep -c ^processor /proc/cpuinfo)
RUN sudo make install -j8
RUN sudo ldconfig

# Copy libs
#RUN cd $OPENCV_INSTALLATION_DIR/lib
#RUN cp -r * /usr/lib
```

## Installing OpenCV Sharp

To utilize OpenCV in .NET we luckily have access to a wrapper library called [OpenCVSharp](https://github.com/shimat/opencvsharp). So we will add this to our Dockerfile to be installed:

```bash
# =================================
# Install OpenCV Sharp
# =================================
RUN cd ${OPENCV_INSTALLATION_DIR}
RUN git clone https://github.com/shimat/opencvsharp.git opencvsharp
RUN cd opencvsharp
RUN git fetch --all --tags --prune && git checkout ${OPENCV_SHARP_VERSION}
RUN cd src
RUN mkdir build
RUN cd build
RUN cmake -D CMAKE_INSTALL_PREFIX=${OPENCV_INSTALLATION_DIR} ..
RUN sudo make -j$(grep -c ^processor /proc/cpuinfo)
RUN sudo make install
RUN sudo ldconfig
RUN sudo cp OpenCvSharpExtern/libOpenCvSharpExtern.so /usr/lib
```

## Creating our project

For our project we will now create a dotnet project, here we will simply take an existing `mp4` file and process it in our code.

```csharp
static void Main(string[] args)
{
	Process("./out.mp4");
}

static void Process(string videoPath)
{
	Console.WriteLine($"[VideoProcessor] Processing videoPath {videoPath}");
	Console.WriteLine("[VideoProcessor] " + (File.Exists(videoPath) ? "Video exists" : "Video does not exist"));

	VideoCapture capture = new VideoCapture(videoPath);

	// using (Window window = new Window("capture"))
	using (Mat image = new Mat()) // Frame image buffer
	{
		var frameIndex = 0;

		// Loop while we can read an image (aka: image.Empty is not true)
		do
		{
			// Read the next
			capture.Read(image);

			// We only want to save every FPS hit since we have 1 image per second -> mod
			if (frameIndex % capture.Fps == 0)
			{
				var saveResult = image.SaveImage($"image_{frameIndex}.png");
				Console.WriteLine($"[VideoProcessor] Saved image #{frameIndex}");
			}

			frameIndex++;
		} while (!image.Empty());
	}

	Console.WriteLine($"[VideoProcessor] Done Processing");
}
```

## Deploying our Project with Docker

To deploy our project, we now need of course to adapt our Dockerfile as well. To do this we will add the following code:

```bash
# =================================
# Install our .NET project
# =================================
COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

FROM microsoft/dotnet:2.1-runtime-stretch-slim
WORKDIR /app
COPY --from=build-env /app/out ./

RUN useradd -ms /bin/bash moduleuser
USER moduleuser

ENTRYPOINT ["dotnet", "ModuleFilterCamera.dll"]
```

We are now done and are able to utilize OpenCV in dotnet core!