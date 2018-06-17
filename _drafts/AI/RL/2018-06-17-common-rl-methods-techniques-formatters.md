---
layout: post
current: post
cover: 'assets/images/posts/rl.jpg'
navigation: True
title: Commonly Used RL Concepts / Methods / Techniques / Formatters
date: 2018-06-17 13:00:00
tags: reinforcement-learning machine-learning artificial-intelligence
class: post-template
subclass: 'post'
author: xavier
---

The purpose of this post is to give you a go to summary of some of the important techniques and concepts used within the Reinforcement Learning (RL) world. This is really meant as a summary for each concept and not an in depth resource, if you prefer this I will include resources at the bottom to help you go more in depth.

## Techniques / Formatting Methods

### Bucketization

* To help going from an infinite state to a discrete state, we use buckets
* These buckets will then hold values between certain ranges

Example: There are infinite values that fit in the range ]-3, 3[, if we put these in 2 buckets we would have ]-3, 0], [0, 3[ and thus less states possible.

## Reinforcement Learning Algorithms

### Q-Learning

* Uses a table of states and actions showing values of how good an action is in which state
* We iterate and update based on the reward we get from taking a certain action

### Deep Q-Learning Neural Network

* Use a Neural Network to approximate the action to take based on the state

### Monte Carlo Tree Search

### Experience Replay

* Solves 2 things, Forgetting previous experiences and Reducing the correlation between experiences
* Avoid Forgetting previous experiences
  * Create a "replay buffer"
* Reduce correlations between experiences
  * 

### Hindsight Experience Replay

## Resources

* [DQNN / Experience Replay](https://medium.freecodecamp.org/an-introduction-to-deep-q-learning-lets-play-doom-54d02d8017d8)