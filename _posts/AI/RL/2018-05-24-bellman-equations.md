---
layout: post
current: post
cover: 'assets/images/covers/rl3.png'
navigation: True
title: Bellman Equations
date: 2018-05-24 23:00:00
tags: ai ai-ml ai-rl
class: post-template
subclass: 'post'
author: xavier
---

## Summary

So what did we learn up until now in our [Introduction](/rl-intro) and [Markov Property, Chain, Reward Process and Decision Process](/markov-property-chain-reward-decision) posts?

Initially we defined our basic concepts:

* **State:** What does our current environment look like?
* **Action:** What action are we taking?
* **Policy:** When taking action $a$ in state $s$, where do we go to?

Whereafter we introduced a concept of *reward* in our MRP

* **Immediate Reward $R_t$:** We want to steer our agent towards the action with the highest reward. Example: We want it to go forward on a cliff, and not fall off. This is given through the sum of our future rewards: $R_t = r_{t + 1} + r_{t + 2} + ... + r_T$
* **Discounted Reward $G_t$** To prevent us from constantly following the same path and reward, we add a discount factor that will reduce the reward over time. Written as: $G_t = R_{t + 1} + γ R_{t + 2} + γ^2R_{t + 3} + ... = \sum^{\infty}_{k=0}γ^k R\_{t+k+1}$

To this we also added probabilities due to the fact of it being described as an MDP and that nothing is certain.

* **Transition Probability:** What is the expected state to end up in after taking a certain action? $P_{ss'}^a = P[S_{t+1} = s' \mid S_t = s, A_t = a]$
* **Reward Probability:** What is the expected reward of ending up in a certain state after taking an action? $R_s^a = E[r_{t+1} \mid S_t = s, A_t = a]$

So that we were finally able to write 2 new functions that allow us to interpret our expected value of a certain state.

* **State-Value Function:** Value when we follow policy $\pi$ forever starting from our state $s$ given by $V^{\pi}(s) = \mathbb{E}\_{\pi}[G\_t \mid s\_t = s] = \mathbb{E}\_{\pi}[\sum^{\infty}\_{k=0}γ^kr\_{t+k+1} \mid s\_t=s]$
* **Action-Value Function:** Value when we follow policy $\pi$ after taking action $a$ on our state $s$ given by $Q_{\pi}(s, a) = \mathbb{E}\_{\pi}[G_t \mid s\_t = s, a\_t = a] = \mathbb{E}\_{\pi}[\sum^{\infty}\_{k=0}γ^kr_{t+k+1} \mid s\_t=s,a\_t=a]$

Now we know that, how are we able to create some kind of algorithm that allows us to find a path through our states, taking specific actions, that will eventually lead to the highest return. Knowing that our states do not depend on each other? (See MDP). Or in math terms, **how can we find our optimal policy $\pi^*$ which maximizes the return in every state?**.

For this, let us introduce something called **Bellman Equations**.

## Bellman Equations

### Introduction

As written in the book by Sutton and Barto, the Bellman equation is an approach towards **solving the term of "optimal control"**. Which is done through the creation of a **functional equation that describes the problem of designing a controller to minimize a measure of a dynamical system's behavior over time.**. This approach of Bellman utilizes the concepts of a state and a value function as we saw before.

> **Note:** A value function we could also write as the "*optimal return function*"

Afterwards, this class of methods for solving these optimal control problems came to be known as dynamic programming.

> **Dynamic Programming:** is a method for solving a complex problem by breaking it down into a collection of simpler subproblems, solving each of those subproblems just once, and storing their solutions.

To know if we can solve a problem through the use of Dynamic Programming, we can take a look at the *Principle of Optimality* which was also created by Richard E. Bellman.

> **Principle of Optimality:** An optimal policy has the property that whatever the initial state and initial decision are, the remaining decision must constitute an optimal policy with regard to the state resulting from the fist decision.

### Bellman Equation - State-Value Function $V^\pi(s)$

So what the Bellman function will actually does, is that it will allow us to write an equation that will **represent our State-Value Function $V^\pi(s)$ as a recursive relationship between the value of a state and the value of its successor states**.

$$\begin{equation}
\begin{split}
V^\pi(s) =& \mathbb{E}_{\pi}[G_t | S_t = s] \\
         =& \mathbb{E}_{\pi}[r_{t+1} + \gamma G_{T+1} | S_t = s] \\
         =& \sum_{a} \pi(a | s) \sum_{s', r} P(s' , r | s, a)[ r + \gamma \mathbb{E}_{\pi}[G_{t + 1} | S_{t + 1} = s] ] \\
         =& \sum_{a} \pi(a | s) \sum_{s', r} P(s' , r | s, a)[ r + \gamma v_{\pi}(s') ], \forall s \in S
\end{split}
\end{equation}$$

> **Note:** We do not go into detail here on how it works or to derive it, for more details about that, feel free to read the paper.

If we now want to find the best value function $V^\*$, then that means that we need to find: $V^\*(s) = max_{\pi}V^{\pi}(s)$ or in terms of our last equation: $V^\*(s) = max_{a} \sum_{s', r} P(s' , r \| s, a)[ r + \gamma V^{\*}(s') ]$ which is our **Bellman Optimality Equation**

### Bellman Equation - Action-Value Function $Q^\pi(s,a)$

For the Action-Value Function we follow the same intuition as in the State-Value one, but here including the action. Eventually leading us to this equation:

$$\begin{equation}
\begin{split}
Q^\pi(s, a) =& \mathbb{E}_{\pi}[G_t | S_t = s, A_t = a] \\
            =& \sum_{a} \pi(a | s) \sum_{s', r} P(s' , r | s, a)[ r + \gamma v_{\pi}(s') ]
\end{split}
\end{equation}$$

Which leads to our **Bellman Optimality Equation**: $Q^\*(s, a) =\sum_{s', r} P(s' , r \| s, a)[ r + \gamma  max_{a'} Q^{\*}(s', a') ]$

## Solving

In the next article, we will talk about some algorithms that will allow us to solve something called a "GridWorld" later on.

## References
* [https://www.scss.tcd.ie/~luzs/t/cs7032/solvemdps.pdf](https://www.scss.tcd.ie/~luzs/t/cs7032/solvemdps.pdf)
* [https://joshgreaves.com/reinforcement-learning/understanding-rl-the-bellman-equations/](https://joshgreaves.com/reinforcement-learning/understanding-rl-the-bellman-equations/)
* [https://en.wikipedia.org/wiki/Reinforcement_learning](https://en.wikipedia.org/wiki/Reinforcement_learning)
* [The Theory of Dynamic Programming - Richard Bellman](http://www.dtic.mil/dtic/tr/fulltext/u2/604386.pdf)
* [http://incompleteideas.net/book/ebook/node40.html](http://incompleteideas.net/book/ebook/node40.html)
* [Reinforcement Learning: An Introduction, 2nd edition, Richard S. Sutton and Andrew G. Barto](https://drive.google.com/file/d/1xeUDVGWGUUv1-ccUMAZHJLej2C7aAFWY/view)
* [https://datascience.stackexchange.com/questions/9832/what-is-the-q-function-and-what-is-the-v-function-in-reinforcement-learning](https://datascience.stackexchange.com/questions/9832/what-is-the-q-function-and-what-is-the-v-function-in-reinforcement-learning)