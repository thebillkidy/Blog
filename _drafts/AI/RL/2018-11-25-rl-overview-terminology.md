Tags:     Machine LearningReinforcement LearningQ LearningArtificial IntelligenceMonte Carlo

# Reinforcement Learning - An Overview of Today 

Reinforcement Learning took big leaps recently, so big that they are being used more and more in production environments (just think about Facebook using RL for its notification push system, or even for optimizing the bandwith in their 360 degree videos) but what are the algorithms powering all of these systems? That's what I want to explain in this article. Consider this article as a abstract overview of the algorithms and the main difference between them, do not consider this as an in-depth article on every single algorithm out there.

> This is not an introduction into Reinforcement Learning, for the introduction feel free to check: https://xaviergeerinck.com/rl-intro

## Important Terminology

### Models: Deterministics vs Stochastic

* **Deterministic:** No randomness, what you see is what you get. Just think about a formula always returning what you expect. In the case of Reinforcement Learning we will always be able to say which action to take belongs to which state.
* **Stochastic:** Include randomness, return a distribution of which action to take belonging to which states with a probability to them.

### Models: Model-based vs Model-free

**Model-based algorithms** try to create models (think of this as a mathmatical formula) that is able to represent the world. Based on this they are then able to predict the next state they are going to be in.

**Model-free algorithms** however purely act on experience, when an action is taken we update our policy or value function and continue. Every timestep we learn something new.

### Policies: On-Policy vs Off-Policy

A policy defines the "strategy" of an agent in a given environment. Or more specifically, what is the action that the Agent is going to take in a given environment? Here we have different distinctions in our policies:

* **Behaviour Policy:** Policy that controls the current actions
* **Target Policy:** The policy being evaluated and/or learned

With 2 different kind of learning methods:

* **On-Policy:** It learns the value of the policy being carried out by the agent, including the exploration steps. (Behaviour Policy == Target Policy)
* **Off-Policy:** It learns the value of the Optimal Target Policy independently on the agent's actions based on the Behaviour Policy. (Behaviour Policy != Target Policy)

### Space: Discrete vs Continuous

* **Discrete:** Finite set of numbers (e.g. the numbers on a dice 1, 2, 3, 4, 5 or 6 with only those numbers being able to be returned)
* **Continuous:** Set of numbers within a certain range (e.g. the rotation of a steering wheel [-360, 360] with all numbers in between such as 10.99293).

### Advantage

**Advantage (A):** A(s, a) = Q(s, a)- V(s)
* Q(s,a) being the Q-Value in a specific state and action
* V(s) being the average action value

This formula thus depicts how good an action is compared to the average action.
How good is an action compared to the average action?


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

## Algorithms

### Monte Carlo

All Monte Carlo methods use the idea of estimating the state-value by taking the average the observed returns after visits to a state, the more returns are observed, the more we converge to the expected value.

* Example: Blackjack, take -1 for losing, +1 for winning and 0 for drawing. We only use the terminal state as reward and not the intermediate steps

> Note: can only be used on episodic tasks (ones with a terminal state)

#### Algorithm: MC for Policy Evaluation $v_{\pi}(s)$

* Sample episodes of experience under $\pi$
* Every time $t$ that state $s$ is visited in an episode
  * Increment counter $N(s) = N(s) + 1$
  * Increment accumulated total return $H(s) = H(s) + G_t$
  * Value is estimated by mean return $V(s) = H(s) / N(s)$
* By law of large numbers, $V(s) = v_{\pi}(s)$ as $N(s) \rightarrow \infty$

We can also do an incremental update per episode, then we for each state $s$ with return $G_t$ we do:

* $N(S_t) = N(S_t) + 1
* $V(S_t) = V(S_t) + \frac{1}{N(S_t)}(G_t - V(S_t))$  

> Note: MC is not efficient

### Q-Learning

#### Q-Learning

Based on a lookup table, choose the action with the best Q-Value for the given state. This Q-Value is updated based on the reward received for taking an action.

![/assets/images/posts/rl-algorithms/q-learning.png](/assets/images/posts/rl-algorithms/q-learning.png)

### DQN (Deep Q-Network) with Experience Replay

A big disadvantage with Q-Learning is that as soon as the state space becomes too big, that it will be hard to keep everything into memory. That's why Deep Q-Networks were invented. With the biggest difference being that we will use a Neural Network to approximate the Q-Value for a given state (returning a vector with all Q-Values for all different actions possible). The weights of the Neural Network are updated by including them in our earlier Bellman Equation.

We also utilize something called **Experience Replay** which will store our Tuple(s, a, r, s') into a sort of "buffer", which we will then randomly replay into our Neural Network to reduce the experience being forgotten over the time. (We send these in in random sequence to reduce the correlation between experiences)

![/assets/images/posts/rl-algorithms/dqn.png](/assets/images/posts/rl-algorithms/dqn.png)

> To improve the results using DQN the images often get pre-processed to use grayscale images, crop away the unneeded information and use 4 frames as input to resolve the "Temporal Limitation" problem (we need to get a sense of motion - this is not possible with only 1 frame)

### SARSA

SARSA is just as Q-Learning, expect it being an on-policy algorithm, learning the Q-Value based on action taken by the current Behaviour Policy rather than the Target Policy. 

![/assets/images/posts/rl-algorithms/sarsa.png](/assets/images/posts/rl-algorithms/sarsa.png)

### DDPG (Deep Deterministic Policy Gradient)

DQN already solved the problem of large State Spaces, but it didn't solve the problem of large Action Spaces. 

#### Actor-Critic Architectures

DDPG is an **Actor-Critic** algorithm, this means that the policy function (actor) is represented independently from the value function (critic). We can think this of someone playing a game (student), while constantly being corrected by an expert in this game (teacher). Or in more mathematical terms, the actor generates an action given the current state of an environment, and the critic will calculate the TD (Temporal-Difference) error signal given the state and resulting reward.

This is represented by the architecture below:

![/assets/images/posts/rl-algorithms/actor-critic.png](/assets/images/posts/rl-algorithms/actor-critic.png)

#### Applying Actor-Critic on DDPG

DDPG uses 2 neural networks (one for the critic and one for the actor). These 2 networks will calculate their prediction and the TD error is calculated based on those.

**Actor Neural Network:** This takes the current state as input and outputs a single real value from the continuous action space
* This is updated through the Deterministic Policy Gradient Theorem

**Critic Neural Network:** This takes the actor its action and the current state as input and will output the Q-Value.
* This is updated through the weights from the TD error signal

![/assets/images/posts/rl-algorithms/ddpg.png](/assets/images/posts/rl-algorithms/ddpg.png)

### Asynchronous Advantage Actor-Critic (A3C)

A3C stands for [Asynchronous Actor Critic](https://arxiv.org/pdf/1602.01783.pdf) designed by DeepMind, where the words were chosen carefully for what the algorithm actually does:

* **Asynchronous:** It involves executing environments in parallel to increase diversity of the training data
* **Advantage:** Policy Gradient updates are done using the advantage function (deepmind used n-step returns)
* **Actor-Critic:** It is an actor critic method

> Rather than using A3C it is more advantagous to use A2C seeing that it is synchronous and offers equal performance [https://arxiv.org/abs/1708.05144](https://arxiv.org/abs/1708.05144). This will let the threads wait on each other to finish the experience before performing the update, being more efficient due to the larger batch size.

![/assets/images/posts/rl-algorithms/a3c.png](/assets/images/posts/rl-algorithms/a3c.png)

### TRPO (Trust-Region Policy Optimization)

### PPO (Proximal Policy Optimization)

![/assets/images/posts/rl-algorithms/ppo.png](/assets/images/posts/rl-algorithms/ppo.png)

## Resources
https://www4.stat.ncsu.edu/~gross/BIO560%20webpage/slides/Jan102013.pdf
https://ai.stackexchange.com/questions/4456/whats-the-difference-between-model-free-and-model-based-reinforcement-learning 
https://artint.info/html/ArtInt_268.html 
https://en.wikipedia.org/wiki/Reinforcement_learning
https://towardsdatascience.com/introduction-to-various-reinforcement-learning-algorithms-i-q-learning-sarsa-dqn-ddpg-72a5e0cb6287
https://pemami4911.github.io/blog/2016/08/21/ddpg-rl.html
https://danieltakeshi.github.io/2018/06/28/a2c-a3c/
