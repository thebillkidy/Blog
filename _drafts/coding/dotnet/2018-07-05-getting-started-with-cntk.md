---
layout: post
current: post
cover: 'assets/images/covers/dotnet.jpg'
navigation: True
title: Getting started with CNTK using Dotnet Core
date: 2018-08-11 09:00:00
tags: dotnet
class: post-template
subclass: 'post tag-coding'
author: xavier
---

After learning Reinforcement learning for a while, I came to a new area that needed some "understanding" before I could continue my quest into the inner parts of it. It is on grasping the way that we can teach machines to recognize images through the use of neural networks. Now seeing that Neural Networks on themselves are covered very well by [other people](https://medium.com/@ageitgey/machine-learning-is-fun-part-3-deep-learning-and-convolutional-neural-networks-f40359318721) I won't go too much in detail on what a Neural Net is, instead I'd rather go more in depth on how we can actually work with it through a framework called **CNTK** and **dotnet core** to work towards implementing a Recurrent Neural Network (RNN) 

CNTK? CNTK stands for the [*Microsoft Cognitive Toolkit*](https://github.com/Microsoft/CNTK) and is an open-source deep-learning toolkit developed by Microsoft that allows you to describe neural networks as a series of computational steps via a directed graph. Sounds awesome right? Let's get started with it!

## Installing CNTK

According to this issue: [https://github.com/Microsoft/CNTK/issues/2352](https://github.com/Microsoft/CNTK/issues/2352) we seem be lucky, and dotnet core support was recently added, we are thus working on a cutting edge project!

To start to use it, the only thing we have to do is create a new console application and add the reference to it like this:

```bash
dotnet new console --name <your_name>
dotnet add <your_name> package CNTK.CPUOnly --version 2.6.0-rc0.dev20180811
```

> You can check the latest releases here: [https://www.nuget.org/packages/CNTK.CPUOnly](https://www.nuget.org/packages/CNTK.CPUOnly) be aware that we are using a RC (release candidate), which is not meant for production just yet.