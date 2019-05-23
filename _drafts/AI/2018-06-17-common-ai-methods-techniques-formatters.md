---
layout: post
current: post
cover: 'assets/images/posts/ai.jpg'
navigation: True
title: Commonly Used AI Concepts / Methods / Techniques / Formatters
date: 2018-06-17 13:00:00
tags: reinforcement-learning machine-learning artificial-intelligence
class: post-template
subclass: 'post'
author: xavier
---

The purpose of this post is to give you a go to summary of some of the important techniques and concepts used within the Artifical Intelligence (AI) world. This is really meant as a summary for each concept and not an in depth resource, if you prefer this I will include resources at the bottom to help you go more in depth.

## Neural Networks

### Classic Neural Networks

![/assets/images/posts/ai-rl-concepts/classical-nn.png](/assets/images/posts/ai-rl-concepts/classical-nn.png)

### Deep Neural Network

* Has more layers than traditional Neural Networks (More than 3 layers, including input and output)
* We train our features based on the previous layer's output
  * Is called **Feature Hierarchy**
* Uses a GPU for speed-ups

![/assets/images/posts/ai-rl-concepts/deep-nn.png](/assets/images/posts/ai-rl-concepts/deep-nn.png)

### Convolutional Neural Network

* Convolution: A biological process that says that the connectivity between neurons resembles the organization of the animal its visual cortex
* Idea: Object is the same, no matter where it appears in a picture
* Steps
  * 1) Break image in overlapping image tiles
  * 2) Feed each tile into a small neural network (keep the same neural network weights for every single tile)
  * 3) Save these results into an array
  * 4) Downsample using *max pooling*
  * 5) Input step 4 in a new neural network and check if it is a match

![/assets/images/posts/ai-rl-concepts/convolutional-nn.png](/assets/images/posts/ai-rl-concepts/convolutional-nn.png)

![/assets/images/posts/ai-rl-concepts/convolutional-nn-2.png](/assets/images/posts/ai-rl-concepts/convolutional-nn-2.png)

## Techniques / Formatting Methods

### Temporal Limitation

* Can you tell the direction in 1 image? NO --> This is what we call temporal limitation
* We thus use a *stack of frames* that allows us to tell what kind of movement is happening

![/assets/images/posts/ai-rl-concepts/temporal-limitation.png](/assets/images/posts/ai-rl-concepts/temporal-limitation.png)

### Representing Images in a Neural Network

* Images can not be represented since Neural Networks use numbers
* If we have a 64x64px image, we can then get the value of how "dark" a pixel is.
* Mapping all of these, thus requires an array of length 4096

![/assets/images/posts/ai-rl-concepts/image-nn.png](/assets/images/posts/ai-rl-concepts/image-nn.png)

### Synthetic Training Data Creation

* When we train a neural network for example to recognize an "8", we use a dataset where all the 8'ths are in the middle.
* This however will fail if we suddenly put one in a corner
* By writing a script, we can manipulate our original dataset and create a **synthetic training dataset** resulting in more recognitions.

### Max Pooling Algorithm

* In a 2D array, we look at a X*X size in our grid and output the biggest number

![/assets/images/posts/ai-rl-concepts/max-pooling.png](/assets/images/posts/ai-rl-concepts/max-pooling.png)


## Measuring Methods

### Accuracy

* True Positives: Correctly identified as what we want
* True Negatives: Correctly identified as not what we want
* False Positives: Wrongly identified as what we want
* False Negatives: Wrongly identified as what we not want

### Recall and Precision

* Precision: If we predicted what we want, how often was it really what we wanted? (true positives + all positive guesses)
* Recall: What percentage of what wanted to find did we find? (true positives + total images of what we wanted)

## Resources

* [Deep NN / Convolutional NN](https://medium.com/@ageitgey/machine-learning-is-fun-part-3-deep-learning-and-convolutional-neural-networks-f40359318721)