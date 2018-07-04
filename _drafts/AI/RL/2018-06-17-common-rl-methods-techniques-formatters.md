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

**Formula:** $Q'(s, a) = Q(s, a) + \alpha[R(s, a) + \gamma max(Q'(s', a')) - Q(s, a)]$

### Deep Q-Learning Neural Network

* Use a Neural Network to approximate the action to take based on the state

We want to update Neural Network Weights to reduce the error.

### Monte Carlo Tree Search

### Experience Replay

* Allows the network to train itself using stored memories from it's experience
  * Done by storing our experience tuples $<s, a, r, s'>$ in a collection and feeding them back to our neural network (replay buffer)
  * However since we take actions after each other, these are highly correlated to each other
    * Therefore we *sample from the replay buffer at random*

**Formula:** $\Delta{w} = \alpha[(R + \gamma max_a \hat{Q}(s', a, w)) - \hat{Q}(s,a,w)] \nabla_w \hat{Q}(s,a,w)$

**Meanings**

* $(R + \gamma max_a \hat{Q}(s', a, w))$: Maximum Possible Q-Value for the NextState $Q'$
* $\hat{Q}(s,a,w)$: Current predicted Q-Value
* $(R + \gamma max_a \hat{Q}(s', a, w)) - \hat{Q}(s,a,w)$: TD Error
* $\nabla_w \hat{Q}(s,a,w)$: Gradient of current predicted Q-Value

**Algorithm**

* Initialize Environment $E$
* Initialize Replay Memory $M$ with capacity $N$ (= finite capacity)
* Initialize DQN weights $w$
* for episode in maxEpisode
  * $s$ = Environment State
  * for steps in maxSteps
    * // Pick action and execute it to land in new state
    * choose action $a$ from state $s$ using $\epsilon$-greedy (or linUCB)
    * take action $a$ $\rightarrow$ get reward $r$ and nextState $s'$
    * store experience tuple $<s, a, r, s'>$ in $M$
    * $s = s'$
    * // Replay our previous experience
    * set $Q'$ = $r(s,a) + \gamma max(Q(s'))$
    * update $w = \alpha(Q'(s,a,w) - Q(s,a,w)) * \hat{Q}(s,a,w)$


### Hindsight Experience Replay

## Resources

* [DQNN / Experience Replay](https://medium.freecodecamp.org/an-introduction-to-deep-q-learning-lets-play-doom-54d02d8017d8)