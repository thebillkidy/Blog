# Reinforcement Algorithms

## Model Free Learning

A model-free based learning algorithm uses only its action $a$ and reward $r$ to find the best action
A model-based learning uses the environment, action and reward

### Monte Carlo Learning

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

### Temporal Difference Learning

Since MC is not efficient, we have something called Temporal Difference learning. TD is a combination of MC ideas and DP ideas.

* Unlike MC, TD will learn from incomplete episodes by bootstrapping
* TD updates a guess towards a guess

**In MC:** $V(S_t) = V(S_t) + \alpha[G_t - V(S_t))]$ where $\alpha$ is the constant step-size and $G_t$ is the **target** (actual *return* after time t)

**In TD:** $V(S_t) = V(S_t) + \alpha [R_{t + 1} + \gamma V(S_{t + 1}) - V(S_t)]$ where $R_{t + 1} + \gamma V(S_{t + 1}$ has a **target** that *estimates the return*

So $\delta = R_{t + 1} + \gamma V(S_{t + 1})$ is called the *TD error*

> Note: TD will thus update the states instantly, while MC will only update it at the end.


### Differences 

|Description|MC|TD|
|-|-|-|
|when can it learn?|At the end of episodes (complete episodes)|After every step (incomplete episodes)|
|Can learn in finite/infinite environments?|No, only in finite ones|Yes in finite and infinite ones|
|Variance/Bias|High Variance, Zero Bias --> Simple but not sensitive to initial value|Low Variance, Some Bias --> More efficient than MC and more sensitive to initial value|

Bias: Error from erroneous assumptions, if high, it can cause an algorithm to miss the relevant relations between features and target outputs (underfitting).
Variance: Error from sensitivity to small fluctuations in the training set. If High, it can cause an algorithm to model the random noise in the training data rather than the intended outputs (overfitting)

> When using TD, having good initial values helps more than having good initial values for MC

Example: Random Walk
Description: you have 5 states between 2 walls, you start in the middle and always have 50% chance going right or left. What is the value function if completely left is reward 0 and completely right is reward 1. (see p125 Sutton & Barto)
Conclusion: TD Converges to true value faster than MC

### Relationship between TD, DP and MC

* These blend into each other in different ways
  * n-step algorithms (provide a bridge from TD to Monte Carlo Methods)
  * TD($\lambda$) (unifies them)


