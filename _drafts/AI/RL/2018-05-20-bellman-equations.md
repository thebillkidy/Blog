---
layout: post
current: post
cover: 'assets/images/covers/rl3.png'
navigation: True
title: Markov Decision Process & Bellman Equations
date: 2018-05-20 09:00:00
tags: reinforcement-learning machine-learning artificial-intelligence
class: post-template
subclass: 'post'
author: xavier
---

Now we know what the  [Markov Property, Chain, Reward Process and Decision Process](/markov-property-chain-reward-decision) are, we can go more in detail on why they are actually so useful in the domain of Reinforcement Learning. 

But let's first come back on what we tackled in our [introduction](/rl-intro). Here we said that the goal of Reinforcement Learning is to let a machine find a solution for when we are in a certain state $s$, by taking certain actions $a$. We say that we know which actions we should take to reach a certain state $s'$, because we know the policy $\pi$ which transitions us to the next state $s'$ through a certain probability $p$.

In Reinforcement Learning we say that we want to find the path from start to finish that will result in the highest reward $r$. Applying this to our policy $\pi$, we can say that **we want to find an optimal policy $\pi^*$ which maximizes the return in ever state**.

But how do we find this optimal policy? This is what we will tackle in this article, through the use of something that we call **Bellman Equations**.

## Bellman Equations

### Introduction

As written in the book by Sutton and Barto, the Bellman equation is an approach towards **solving the term of "optimal control"**. Which is done through the creation of a **functional equation that describes the problem of designing a controller to minimize a measure of a dynamical system's behavior over time.**. This approach of Bellman utilizes the concepts of a state and a value function as we saw before.

> **Note:** A value function we could also write as the "*optimal return function*"

Afterwards, this class of methods for solving these optimal control problems came to be known as dynamic programming.

> **Dynamic Programming:** is a method for solving a complex problem by breaking it down into a collection of simpler subproblems, solving each of those subproblems just once, and storing their solutions.

To know if we can solve a problem through the use of Dynamic Programming, we can take a look at the *Principle of Optimality* which was also created by Richard E. Bellman.

> **Principle of Optimality:** An optimal policy has the property that whatever the initial state and initial decision are, the remaining decision must constitute an optimal policy with regard to the state resulting from the fist decision.

### Bellman Equation - State-Value Function $V^\pi(s)$

Looking back at our introduction, we could see that the State-Value function is described as the Value of state $s$, when following policy $\pi$ or $V^{\pi}(s) = E_{\pi}[R_t|s_t = s]$

Which in its turn comes from the fact that:

$$
R_t = r_{t + 1} + \gamma r_{t + 2} + \gamma^2 r_{t + 3} + \gamma^3 r_{t + 4} ...
$$

$$
R_t = r_{t + 1} + \gamma(r_{t + 2} + \gamma r_{t + 3} + \gamma^2 r_{t + 4} ...)
$$

$$
R_t = r_{t + 1} + \gamma R_{t + 1}
$$

Making it so that we can write our State-Value function as: 

$$V^{\pi}(s) = E_{\pi}[r_{t + 1} + \gamma V^{\pi}(s_{t + 1}) | s_t = s]$$

Removing the expectation operator:

$$V^{\pi}(s) = \sum_{s'}P^{\pi(s)}_{ss'}[R^{\pi(s)}_{ss'} + \gamma V^{\pi}(s')]$$


### Bellman Equation - Action-Value Function $Q^\pi(s,a)$

Value of state $s$, taking action $a$, and thereafter following policy $\pi$ or $Q_{\pi}(s, a) = E_{\pi}[R_t|s_t = s, a_t = a]$




Finding this optimal policy


One of the key elements in here were the [Policy and Value Function](/rl-intro), which defines the policy $\pi$ to find the actions that we should take to go to a certain state, and the value function which tells us the value of taking a certain action in some state when following this policy $\pi$.

To come to a solution 

## References
* [https://www.scss.tcd.ie/~luzs/t/cs7032/solvemdps.pdf](https://www.scss.tcd.ie/~luzs/t/cs7032/solvemdps.pdf)
* [https://joshgreaves.com/reinforcement-learning/understanding-rl-the-bellman-equations/](https://joshgreaves.com/reinforcement-learning/understanding-rl-the-bellman-equations/)
* [https://en.wikipedia.org/wiki/Reinforcement_learning](https://en.wikipedia.org/wiki/Reinforcement_learning)
* [The Theory of Dynamic Programming - Richard Bellman](http://www.dtic.mil/dtic/tr/fulltext/u2/604386.pdf)
* [http://incompleteideas.net/book/ebook/node40.html](http://incompleteideas.net/book/ebook/node40.html)
* [Reinforcement Learning: An Introduction, 2nd edition, Richard S. Sutton and Andrew G. Barto](https://drive.google.com/file/d/1xeUDVGWGUUv1-ccUMAZHJLej2C7aAFWY/view)