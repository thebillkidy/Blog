
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

**Paper:** [http://www.cs.rhul.ac.uk/~chrisw/new_thesis.pdf](http://www.cs.rhul.ac.uk/~chrisw/new_thesis.pdf)

Based on a lookup table, choose the action with the best Q-Value for the given state. This Q-Value is updated based on the reward received for taking an action.

![/assets/images/posts/rl-algorithms/q-learning.png](/assets/images/posts/rl-algorithms/q-learning.png)

### Deep Q-Network (DQN) with Experience Replay

**Paper:** [https://arxiv.org/abs/1312.5602](https://arxiv.org/abs/1312.5602)

**Patent:** [https://patentimages.storage.googleapis.com/71/91/4a/c5cf4ffa56f705/US20150100530A1.pdf](https://patentimages.storage.googleapis.com/71/91/4a/c5cf4ffa56f705/US20150100530A1.pdf)

A big disadvantage with Q-Learning is that as soon as the state space becomes too big, that it will be hard to keep everything into memory. That's why Deep Q-Networks were invented. With the biggest difference being that we will use a Neural Network to approximate the Q-Value for a given state (returning a vector with all Q-Values for all different actions possible). The weights of the Neural Network are updated by including them in our earlier Bellman Equation.

We also utilize something called **Experience Replay** which will store our Tuple(s, a, r, s') into a sort of "buffer", which we will then randomly replay into our Neural Network to reduce the experience being forgotten over the time. (We send these in in random sequence to reduce the correlation between experiences)

![/assets/images/posts/rl-algorithms/dqn.png](/assets/images/posts/rl-algorithms/dqn.png)

> To improve the results using DQN the images often get pre-processed to use grayscale images, crop away the unneeded information and use 4 frames as input to resolve the "Temporal Limitation" problem (we need to get a sense of motion - this is not possible with only 1 frame)

### SARSA

**Paper:** [http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.17.2539&rep=rep1&type=pdf](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.17.2539&rep=rep1&type=pdf)

SARSA is just as Q-Learning, expect it being an on-policy algorithm, learning the Q-Value based on action taken by the current Behaviour Policy rather than the Target Policy. 

![/assets/images/posts/rl-algorithms/sarsa.png](/assets/images/posts/rl-algorithms/sarsa.png)

### Deep Deterministic Policy Gradient (DDPG)

**Paper:** [https://arxiv.org/abs/1509.02971](https://arxiv.org/abs/1509.02971)

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

**Paper:** [https://arxiv.org/pdf/1602.01783.pdf](https://arxiv.org/pdf/1602.01783.pdf)

A3C stands for Asynchronous Actor Critic designed by DeepMind, where the words were chosen carefully for what the algorithm actually does:

* **Asynchronous:** It involves executing environments in parallel to increase diversity of the training data
* **Advantage:** Policy Gradient updates are done using the advantage function (deepmind used n-step returns)
* **Actor-Critic:** It is an actor critic method

> Rather than using A3C it is more advantagous to use A2C seeing that it is synchronous and offers equal performance [https://arxiv.org/abs/1708.05144](https://arxiv.org/abs/1708.05144). This will let the threads wait on each other to finish the experience before performing the update, being more efficient due to the larger batch size.

![/assets/images/posts/rl-algorithms/a3c.png](/assets/images/posts/rl-algorithms/a3c.png)

### Policy Optimization Algorithms

#### The Fundamental Problem

Policy Gradient algorithms are responsible for solving previously unsolvable games and learning robots to walk and being resilient to it. The problem however with such algorithms is that they are very sensitive to the stepsize, resulting in a slow convergence rate or a bad decision being taken. This is due to the use of Gradient Ascent which will find the path to follow for the steepest increase in rewards, but it is hard to choose the right stepsize here.

#### Trust-Region Policy Optimization (TRPO)

**Paper:** [https://arxiv.org/abs/1502.05477](https://arxiv.org/abs/1502.05477)

TRPO Utilizes 2 methods to optimize this: Line Search and Trust Region
* Line Search: Determine the function of descending and step towards it (think of Gradient Descent)
* Trust Region: Determine the maximum step size to explore and locate the optimal point within this trust region

![/assets/images/posts/rl-algorithms/trpo.png](/assets/images/posts/rl-algorithms/trpo.png)

#### PPO (Proximal Policy Optimization)

**Paper:** [https://arxiv.org/abs/1707.06347](https://arxiv.org/abs/1707.06347)

Just as TRPO, Proximal Policy Optimization will try to optimize the step size used to converge our Policy Gradient method faster. The main challenge that existed in TRPO however was that it wasn't compatible with algorithms that share parameters between a policy and value function.

Proximal Policy Optimization allows us to easily implement the cost function, run gradient descent and receive excellent results.

![/assets/images/posts/rl-algorithms/ppo.png](/assets/images/posts/rl-algorithms/ppo.png)

## Resources

This article would never have been possible without the many resources utilized for creating it. Feel free to check them if you require more in-depth details about many of the algorithms shown above.

https://www4.stat.ncsu.edu/~gross/BIO560%20webpage/slides/Jan102013.pdf
https://ai.stackexchange.com/questions/4456/whats-the-difference-between-model-free-and-model-based-reinforcement-learning 
https://artint.info/html/ArtInt_268.html 
https://en.wikipedia.org/wiki/Reinforcement_learning
https://towardsdatascience.com/introduction-to-various-reinforcement-learning-algorithms-i-q-learning-sarsa-dqn-ddpg-72a5e0cb6287
https://pemami4911.github.io/blog/2016/08/21/ddpg-rl.html
https://danieltakeshi.github.io/2018/06/28/a2c-a3c/
https://medium.com/@jonathan_hui/rl-trust-region-policy-optimization-trpo-explained-a6ee04eeeee9
https://towardsdatascience.com/introduction-to-various-reinforcement-learning-algorithms-part-ii-trpo-ppo-87f2c5919bb9
https://blog.openai.com/openai-baselines-ppo/
https://medium.com/@jonathan_hui/rl-proximal-policy-optimization-ppo-explained-77f014ec3f12