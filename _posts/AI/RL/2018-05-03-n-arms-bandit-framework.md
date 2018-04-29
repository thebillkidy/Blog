---
layout: post
current: post
cover: 'assets/images/posts/multi-armed-bandits.jpg'
navigation: True
title: Multi-armed bandit framework
date: 2018-05-03 09:00:00
tags: reinforcement-learning machine-learning artificial-intelligence
class: post-template
subclass: 'post'
author: xavier
---

To start solving the problem of exploration, we are going to introduce the **Multi-armed bandits framework**. But what exactly does this solve? Just think that you are executing a clinical trial with 4 pills. You know that the pills have a survival rate but you don't know what that survival rate is. Your goal: find the pill with the highest chance of survival in X trials.

This is an example of a **Multi-bandit framework**, to put this more formal: 

Given $K$ actions (=arms) from a list of actions $A = {a_1, a_2, ..., a_k}$ and knowing that the reward $r$ for a certain action is unknown $R_a = Pr(r \mid a)$

> Note: for those who are new to probability theory, $\mid$ is a conditional, so $Pr(r \mid a)$ means the probability of getting reward $r$ if action $a$ happens.

Now at each time step $t = 1, 2, ..., T$

1. Choose an action: $a_t \in A$
2. See the reward received: $r_t ~ Pr(r mid a_t)$

<span style="font-size: 2.5rem; text-align: center; display: block;">**Goal:** Maximize $\sum_tr_t$</span>

We call this kind of setup a *stochastic* setup, since $r_t$ is stochastic.

> Note: Stochastic means something that is randomly determined.

## Regret

What is important in this framework, is to be able to quantify the "price of information", or in other words: "If I choose path B instead of A, how hard will my reward decrease? how much will I regret taking path B?".

This means that we can say that for a successful algorithm, we want to to minimize our regret $L_t$, or maximize the reward $\sum_t{r_t}$

Our regret can be formulated as: $L_T$ = "The optimal way" - "what we managed to achieve without knowing the optimal route" = $L_T = T\mathbf{E}[r \mid a^{*}] - \sum_T\mathbf{E}[r \mid a_t]$ .

## Exploration Algorithms

### The Naive Algoritm

Let's go back to the example of the pills, where we have T time steps (= population) and k actions. How would we divide the pills naively?

Here we would just pick a *round-robin* approach, where we divide the pills equally. 

But we can do better!

### Greedy Algorithm

A greedy algorithm is an algorithm that makes the choice that seems to be the best at the moment. Which means that we will make a local-optimal choice rather than a global-optimal solution. 

Now what happens if we try to apply this greedy algorithm to our Pill division problem? Then we would pick the pill that yields the best results, how you would say? By counting the amounts we were successful, and then keeping to pick this one.

We thus want to estimate what the reward could be for any of the actions? or in mathematical terms: $\hat{r}_a \approx \mathbf{E} [ r \mid a ]$, but how can we calculate this?

> Note $\mathbf{E}$ represents the *expected value* , or what is our random variable expected to be if we repeat something $\infty$ times?

Well let's create a new variable that represents on how many times we chose a sample: $n_a$, then we say that $\hat{r}_a = \frac{r_t}{n_a}$. So our best action would be defined by $a_t = argmax \hat{r}_a$

The problem with this algorithm however, is that it could lock-on suboptimal forever due to the fact that we do not do any exploration. For example, if we take pills and we have a positive result the first time, then we would not go and try the other ones.

Our Greedy Algorithm has **linear regret**

```javascript
/**
 * Use the greedy empirical estimate to choose an arm
 * 
 * @param {Array} armCounts nArms * 2, representing the observed counts
 * @returns {Integer} the arm to be pulled at the next timestep (0 index based)
 */
const greedyChoice = (armCounts) => {
  let pMax = -1;
  let choice = -1;

  for (let i = 0; i < armCounts.length; i++) {
    let nPull = (armCounts[i][0] + armCounts[i][1]);

    if (nPull < 0.5) {
      pHat = 0.5;
    } else {
      pHat = armCounts[i][0] / nPull;
    }

    if (pHat > pMax) {
      pMax = pHat;
      choice = i;
    }
  }

  return choice;
}
```

### Optimistic Greedy Algorithm ($\epsilon$-Greedy)

Since the greedy algorith locks-on a suboptimal choice, we want to be able to "explore" more to try to find the global minimum. Therefore we will have to introduce a probability to explore. This probability is what we can write as our $\epsilon$ variable.

So formal this will be that with probability $\epsilon$ we will select a random action and with probability 1 - $\epsilon$ we will select our best action.

```javascript
/**
 * Use the greedy empirical estimate to choose an arm
 * 
 * @param {Array} armCounts nArms * 2, representing the observed counts
 * @param {Integer} epsilon A value between 0 and 1 representing 
 *                          how much chance there is to pick a random action
 * @returns {Integer} the arm to be pulled at the next timestep (0 index based)
 */
const greedyEpsilonChoice = (armCounts, epsilon) => {
  let choice = -1;

  if (Math.random() < epsilon) {
    choice = Math.floor((Math.random() * armCounts.length));
  } else {
    choice = greedyChoice(armCounts);
  }

  return choice;
}
```

### Upper Confidence Bound (UCB) Algorithm

We just saw two algorithms (Greedy and $\epsilon$-greedy) that are able to achieve linear regret. But can we do better? Well as proven Lai and Robbins, it appears that the lower bound of Regret is Logarithmic. But how can we achieve this?

Well we can achieve this through a principle known as *optimism in the face of uncertainty*. To achieve low regret, we only need to identify the optimal action. Therefore we need use to use the collected data to eliminate actions that are sub-optimal as much as possible.

The algorithm is written as follows:

1. For each action a, maintain the amount of times we took that action $n_a$ and the empirical average of pay-offs for that action $\hat{r}_a$
2. For the first $k$ rounds, play each action once
3. At round t, play $a_t = argmax(\hat{r}_a + \sqrt{\frac{2logt}{n_a}})$

This algorithm achieves a Logarithmic regret, but only if the amount of rounds is larger than our amount of actions. It does this by adding an exp bonus to unexplored actions/less frequently called actions, represented by $\sqrt{\frac{2logt}{n_a}}$. This however decreases rapidly once $n_a$ increases.

```javascript
/**
 * @param {Array} armCounts nArms * 2, representing the observed counts
 * @param {Integer} timestep the number of timesteps elapsed
 * @returns {Integer} the arm to be pulled at the next timestep (0 index based)
 */
const ucbChoice = (armCounts, timestep) => {
  let pMax = -1;
  let choice = -1;

  for (let i = 0; i < armCounts.length; i++) {
    let nPull == (armCounts[i][0] + armCounts[i][1]);

    if (nPull < 0.5) {
      nPull = 1;
    }

    let pHat = armCounts[i][0] / nPull;
    let pUpper = pHat + Math.sqrt(Math.log(timestep) / nPull);

    if (pUpper > pMax) {
      pMax = pUpper;
      choice = i;
    }
  }

  return choice;
}
```

### Posterior Sampling Algorithm (=Thompson Sampling)

If we have prior knowledge on what the payoffs could be, then posterior sampling says to take action a according to the probability that a is optimal. Resulting in a convergence to the a* method.

In our drug discovery example, the rewards were *Bernoulli* (live or die), which is a *random Binary Variable*).

We can thus say that Rewards = Bernoulli($P_a$), assuming that $P_a \approx Beta(1, 1)$ with $Beta$ being a Beta distribution.

> Note: A beta distribution is a uniform chance distribution with 2 parameters.

Algorithm:

1. Maintain patients who lived or died
2. At round T
  * $\hat{P}_a \approx Beta(1 + live, 1 + die)$ (the posterior distribution for each arm)
  * Play $a_t = argmax(P_a)$. (We will play the most optimistic looking sample)

```javascript
/**
 * @param {Array} armCounts nArms * 2, representing the observed counts
 * @returns {Integer} the arm to be pulled at the next timestep (0 index based)
 */
const posteriorSamplingChoice = (armCounts, timestep) => {
  let pMax = -1;
  let choice = -1;
  let priorA = 1;
  let priorB = 1;

  for (let i = 0; i < armCounts.length; i++) {
    let pSample = rBeta(armCounts[i][0] + priorA, armCounts[i][1] + priorB);

    if (pSample > pMax) {
      pMax = pSample;
      choice = i;
    }
  }

  return choice;
}

function rbeta(alpha, beta) {
  var alpha_gamma = rgamma(alpha, 1);
  return alpha_gamma / (alpha_gamma + rgamma(beta, 1));
}

var SG_MAGICCONST = 1 + Math.log(4.5);
var LOG4 = Math.log(4.0);

function rgamma(alpha, beta) {
  // does not check that alpha > 0 && beta > 0
  if (alpha > 1) {
    // Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral
    // shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74
    var ainv = Math.sqrt(2.0 * alpha - 1.0);
    var bbb = alpha - LOG4;
    var ccc = alpha + ainv;

    while (true) {
      var u1 = Math.random();
      if (!((1e-7 < u1) && (u1 < 0.9999999))) {
        continue;
      }
      var u2 = 1.0 - Math.random();
      v = Math.log(u1/(1.0-u1))/ainv;
      x = alpha*Math.exp(v);
      var z = u1*u1*u2;
      var r = bbb+ccc*v-x;
      if (r + SG_MAGICCONST - 4.5*z >= 0.0 || r >= Math.log(z)) {
        return x * beta;
      }
    }
  }
  else if (alpha == 1.0) {
    var u = Math.random();
    while (u <= 1e-7) {
      u = Math.random();
    }
    return -Math.log(u) * beta;
  }
  else { 
    // 0 < alpha < 1
    // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
    while (true) {
      var u3 = Math.random();
      var b = (Math.E + alpha)/Math.E;
      var p = b*u3;
      if (p <= 1.0) {
        x = Math.pow(p, (1.0/alpha));
      }
      else {
        x = -Math.log((b-p)/alpha);
      }
      var u4 = Math.random();
      if (p > 1.0) {
        if (u4 <= Math.pow(x, (alpha - 1.0))) {
          break;
        }
      }
      else if (u4 <= Math.exp(-x)) {
        break;
      }
    }
    return x * beta;
  }
}
```

## References

* [https://www.edx.org/course/reinforcement-learning-explained](https://www.edx.org/course/reinforcement-learning-explained)
* [http://iosband.github.io/2015/07/28/Beat-the-bandit.html](http://iosband.github.io/2015/07/28/Beat-the-bandit.html)
* [Tze Leung Lai and Herbert Robbins. Asymptotically efﬁcient adaptive allocation rules. Advances in applied mathematics, 6(1):4–22, 1985](https://ac.els-cdn.com/0196885885900028/1-s2.0-0196885885900028-main.pdf?_tid=26e19e4d-690a-4275-a0c1-64c0bd26f1b5&acdnat=1525014288_cc7f41ecd4796166f70a32b9b3e969c3)
* [https://jeremykun.com/2013/10/28/optimism-in-the-face-of-uncertainty-the-ucb1-algorithm/](https://jeremykun.com/2013/10/28/optimism-in-the-face-of-uncertainty-the-ucb1-algorithm/)
* [https://stackoverflow.com/questions/9590225/is-there-a-library-to-generate-random-numbers-according-to-a-beta-distribution-f](https://stackoverflow.com/questions/9590225/is-there-a-library-to-generate-random-numbers-according-to-a-beta-distribution-f)