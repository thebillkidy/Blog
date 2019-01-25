---
layout: post
current: post
cover: 'assets/images/covers/rl.jpg'
navigation: True
title: Reinforcement Learning - Terminology
date: 2018-11-29 09:00:00
tags: ai ai-ml ai-rl
class: post-template
subclass: 'post'
author: xavier
---


Tags:     Machine LearningReinforcement LearningQ LearningArtificial IntelligenceMonte Carlo

# Reinforcement Learning - An Overview of Today 

Reinforcement Learning took big leaps recently, so big that they are being used more and more in production environments (just think about Facebook using RL for its notification push system, or even for optimizing the bandwith in their 360 degree videos) but what does all the terminology mean? This is what I want to explain in the article below.

> This is not an introduction into Reinforcement Learning, for the introduction feel free to check: https://xaviergeerinck.com/rl-intro

> For an in-depth overview of the algorithms listed at the bottom of this article, feel free to check the fantastic OpenAI Documentation at [
https://spinningup.openai.com/en/latest/](
https://spinningup.openai.com/en/latest/)

## Important Terminology

### **Models:** Deterministics vs Stochastic

* **Deterministic:** No randomness, what you see is what you get. Just think about a formula always returning what you expect. In the case of Reinforcement Learning we will always be able to say which action to take belongs to which state.
* **Stochastic:** Include randomness, return a distribution of which action to take belonging to which states with a probability to them.

### **Models:** Model-based vs Model-free

**Model-based algorithms** try to create models (think of this as a mathmatical formula) that is able to represent the world. Based on this they are then able to predict the next state they are going to be in.

**Model-free algorithms** however purely act on experience, when an action is taken we update our policy or value function and continue. Every timestep we learn something new.

### **Policies:** On-Policy vs Off-Policy

A policy defines the "strategy" of an agent in a given environment. Or more specifically, what is the action that the Agent is going to take in a given environment? Here we have different distinctions in our policies:

* **Behaviour Policy:** Policy that controls the current actions
* **Target Policy:** The policy being evaluated and/or learned

With 2 different kind of learning methods:

* **On-Policy:** It learns the value of the policy being carried out by the agent, including the exploration steps. (Behaviour Policy == Target Policy). We thus use the latest version of our policy to make decisions in real-time.
* **Off-Policy:** It learns the value of the Optimal Target Policy independently on the agent's actions based on the Behaviour Policy. (Behaviour Policy != Target Policy)

### **Space:** Discrete vs Continuous

* **Discrete:** Finite set of numbers (e.g. the numbers on a dice 1, 2, 3, 4, 5 or 6 with only those numbers being able to be returned)
* **Continuous:** Set of numbers within a certain range (e.g. the rotation of a steering wheel [-360, 360] with all numbers in between such as 10.99293).

### **Advantage**

**Advantage (A):** A(s, a) = Q(s, a)- V(s)
* Q(s,a) being the Q-Value in a specific state and action
* V(s) being the average action value

This formula thus depicts how good an action is compared to the average action. How good is an action compared to the average action?

## Algorithms Overview

In the world of Reinforcement Learning 2 big different types of algorithms being used:

* **Value Based** algorithms: they use a Value function that describes how good it is to take a certain action in a given state.
    * Mostly used in an environment with a finite amount of states
    * Are faster than Policy based functions due to the finite amount of states
* **Policy Based** algorithms: They map a state to an action
    * These however converge a lot to a local maximum, but are slower than Value Functions

### Algorithms Comparison

|Algorithm|Description|Model|Policy|Action Space|State Space|Operator|
|-|-|-|-|-|-|-|
|Monte Carlo|Every visit to Monte Carlo|Model-Free|Off-Policy|Discrete|Discrete|Sample-Means|
|Q-Learning|State-action-reward-state|Model-Free|Off-Policy|Discrete|Discrete|Q-Value|
|SARSA|State-action-reward-state-action|Model-Free|On-Policy|Discrete|Discrete|Q-Value|
|Q-Learning $\lambda$|State-action-reward-state with eligibility traces|Model-Free|Off-Policy|Discrete|Discrete|Q-Value|
|SARSA $\lambda$|State-action-reward-state-action with eligibility traces|Model-Free|On-Policy|Discrete|Discrete|Q-Value|
|DQN|Deep Q Network|Model-Free|Off-Policy|Discrete|Continuous|Q-Value|
|DDPG|Deep Deterministic Policy Gradient|Model-Free|Off-Policy|Continuous|Continuous|Q-Value|
|A3C|Asynchronous Actor-Critic|Model-Free|Off-Policy|Continuous|Continuous|Q-Value|
|NAF|Q-Learning with Normalized Advantage Functions|Model-Free|Off-Policy|Continuous|Continuous|Advantage|
|TRPO|Trust Region Policy Optimization|Model-Free|On-Policy|Continuous|Continuous|Advantage|
|PPO|Proximal Policy Optimization|Model-Free|On-Policy|Continuous|Continuous|Advantage|
