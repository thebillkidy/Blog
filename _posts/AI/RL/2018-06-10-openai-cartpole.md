---
layout: post
current: post
cover: 'assets/images/covers/openai.jpg'
navigation: True
title: OpenAI Gym Problems - Solving the CartPole Gym
date: 2018-06-10 09:00:00
tags: reinforcement-learning machine-learning artificial-intelligence
class: post-template
subclass: 'post'
author: xavier
---

In a previous post we set-up the OpenAI Gym to interface with our Javascript environment. Let's now look at how we can use this interface to run the CartPole example and solve it with the theory that we learned in previous blog posts.

Requirements:

* [An introduction to Reinforcement Learning (RL)](/rl-intro)
* [The Markov Property, Chain, Reward Process and Decision Process](/markov-property-chain-reward-decision)
* [Bellman Equations](/bellman-equations)
* [How to run OpenAI Gym on Windows and with Javascript](/running-openai-gym-on-windows-and-js)
* [Bucketization](/creating-a-bucketing-function)

## Setting up our Experiment

We are again going to use Javascript to solve this, so everything you did before in the first article in our requirements comes in handy. Start by creating a new directory with our `package.json` and a `index.js` file for our main entry point.

> **Note:** To make things easier, it's recommended to add a line that will start our server in the `package.json` file under the `scripts`: `nodemon -x 'python ../OpenAI-Gym/server.py'`. This way we can run `npm run server` to start our server, just make sure that you also run `npm install nodemon --save-dev` to ensure that the package is installed. Make sure to edit the path to point to the correct directories (in my case I put my experiments just one directory above the OpenAI-Gym files)

In the newly created `index.js` file we can now write some boilerplate code that will allow us to run our environment and visualize it. See the bottom of this article for the contents of this file.

## Getting to know the different methods

We learned the basics of RL in a previous article (see requirements) where we learned the following cycle:

1. We get an initial observation from an environment (the world) which we call our state $s$
2. Based on this state $s$, our agent will choose an action $a$
3. This action will modify our world, and receive a reward based on the output of it
4. We go back to step 2

These steps are implemented in OpenAI through the following methods:

1. Get our initial observation: `state.observation = await client.envReset(instanceId)`
2. Now decide which action to take based on the observation and the *previous* reward: `agent.chooseAction(state.observation, state.reward, state.done)`
3. Get a new observation from our world: `state = await client.envStep(instanceId, actionToTake, true);`
4. We go back to step 2

To be able to make everything dynamic and create a true self-learning algorithm, OpenAI provides several other methods as well:

* Create our environment: `await client.envCreate(envId);`
* Get our actionSpace containing the different actions that we can take
  * **Example:** For `CartPole-v0` this returns: `{ info: { n: 2, name: 'Discrete' } }`
  * **Method:** `await client.envActionSpaceInfo(instanceId);`
* Get our observationSpace containing the different observations that will be returned
  * **Example:** For `CartPole-v0` this returns: `{ info: { high: [], low: [], name: 'Box', shape: [ 4 ] } }`
  * **Method:** `await client.envObservationSpaceInfo(instanceId);`
* Starting and closing the monitoring process: `await client.envMonitorStart(instanceId, outDir, true);`, `await client.envMonitorClose(instanceId);`
* Upload the results to view it online: `await client.upload(outDir)`

## Solving the CartPole problem

### Discovering the inputs

So in our CartPole example, let's take a look at one of our state observations:

```json
{
  done: false,
  info: {},
  observation: [
    0.10040040129814863,
    0.5559659866710018,
    -0.17649755837025902,
    -1.1301794535568273
  ],
  reward: 1
}
```

Basically, these numbers are 4 unknown random continuous numbers, that we do not know what they do in our algorithm... (though we can make an interpretation of them with our human brain and say that they represent **position $x$**, **velocity $v$**, **angle $\theta$** and **angular velocity $\alpha$**).

Next to these 4 random numbers, we also know by observing the action space that we can take 2 specific discrete actions (again by using our human brain we can classify this as moving the cart to the left or moving it to the right).

### Solving the problem

Applying what we learned in the previous article of [RL Intro][/rl-intro], we know that we now need to create a policy that shows us which state we will land in after taking a certain action. By then combining this with the [Bellman Equations](/bellman-equations), we are able to create an optimal $\pi^{\*}$ that will maximize the return in every state. So we follow our boilerplate of every reinforcement algorithm, stating that we first check our environment, then take an action and based on the reward of that action update our q-function. Or summarized:

1. Observe the environment
2. Based on the observed environment, take an action
3. Now look at the reward that we got from taking an action, and update our Q-Table with this reward.

To start with point 1, we want to be able to represent our observation as a state index. This is needed to be able to construct our Q-Table which will consist of our state and actions. For this we use a method called [Bucketization](/creating-a-bucketing-function) which will convert our observations from a continuous state (the numbers that fit between our lower bound and upper bound can be described as ]$-\infty$, $\infty$[) towards a discrete state (we "bucket" our numbers, returning only a subset of indexes rather than $\infty$ ones), allowing us to keep our states minimal and represent them in our memory.

> Note: I did limit the velocity speed and the angle of our cartpole to achieve convergence faster.

For point 2, we will then use what we learned in the [Multi-armed bandit framework](/n-arms-bandit-framework) article, stating that we take our actions as returned by taking the maximum value for that state it's actions (`Math.max(Q[s]`) but that we add an **exploration factor** that will still take a random action on some points, but still minimizes regret.

And as our last point 3, we then update our Q-Table by utilizing the Bellman Equation which results in the single line

```javascript
this.q[oldStateIdx][action] += alpha * (reward + this.gamma * this.q[newStateIdx].getMaxValue() - this.q[oldStateIdx][action]);
```

Successfully coding this and applying, will give us the following result:

<video width="640" height="480" autoplay>
  <source src="/assets/videos/cartpole.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

## Files

### Index.js Template

```javascript
/**
 * For more information, check: https://gym.openai.com/docs/
 */
const gym = require('../OpenAI-Gym/gym-http-api/binding-js/dist/lib/gymHTTPClient');
const Bucket = require('./Bucket');
const episodeCount = 1000;
const maxTimeSteps = 250;
const outDir = "/tmp/random-agent/results";
const numTrials = 3;
const envId = "CartPole-v0";
const client = new gym.default("http://127.0.0.1:5000");

// Parameter to enable debug
const PRINT_DEBUG = true;

class Experiment {
  constructor(agentClass) {
    this.environment = null;
    this.actionSpaceInfo = null;
    this.agent = null;
  }

  async initialize() {
    // Create our environment
    this.environment = await client.envCreate(envId);

    // Our ActionSpace
    // For CartPole-v0 this returns: { info: { n: 2, name: 'Discrete' } }
    this.actionSpaceInfo = await client.envActionSpaceInfo(this.environment.instance_id);

    // Our ObservationSpace
    // For CartPole-v0 this returns: { info: { high: [XXX], low: [XXX], name: 'Box', shape: [ 4 ] } }
    this.observationSpaceInfo = await client.envObservationSpaceInfo(this.environment.instance_id);

    // Rebind our velocity and angular velocity parameters, the pole should stand still as much as possible
    this.observationSpaceInfo.info.high[1] = 0.5;
    this.observationSpaceInfo.info.low[1] = -0.5;
    this.observationSpaceInfo.info.high[3] = Math.radians(50);
    this.observationSpaceInfo.info.low[3] = -Math.radians(50);

    // Set our learning agent
    this.agent = new CartPoleAgent(this.actionSpaceInfo.info["n"], this.observationSpaceInfo.info.shape[0], this.observationSpaceInfo.info);
  }

  async run() {
    let oldObservation = [];

    await this.initialize();

    // Start Monitoring
    await client.envMonitorStart(this.environment.instance_id, outDir, true);

    // For every episode
    for (let episode = 0; episode < episodeCount; episode++) {
      // Reset the whole environment to start over
      let environment = {
        done: false,
        info: {},
        observation: await client.envReset(this.environment.instance_id), // envReset gives an initial observation
        reward: 0,
      }

      // Keep executing while we can:
      // if state.done = true, then that means the pole tipped to far, or we died
      // if t >= maxTimeSteps, then we did not solve it fast enough
      let t = 0;
      while (!environment.done && t < maxTimeSteps) {
        environment = await this.agent.act(client, this.environment.instance_id, episode, environment.observation);
        t++;
      }

      console.log(`Episode ${episode} ended after ${t} timesteps`);
    }

    // Stop Monitoring
    await client.envMonitorClose(this.environment.instance_id);
    console.log(outDir);
  }
}

// Create and run our experiment
const experiment = new Experiment();
experiment.run();

// Our Agent in charge of learning based on the observation and reward
class CartPoleAgent {
  constructor(numberOfActions, numberOfObservations, observationSpaceInfo) {
    this.numberOfActions = numberOfActions;
    this.numberOfObservations = numberOfObservations;
    this.observationSpaceInfo = observationSpaceInfo;

    this.gamma = 1.0; // Discount factor
    this.minEpsilon = 0.1; // Exploration factor
    this.minAlpha = 0.1; // Learning Rate
    this.adaDivisor = 25;

    // Create buckets and states, for the CartPole we know that it's x, v, theta, alpha (position, velocity, angle, angular velocity)
    this.bucketArrays = this.initializeBuckets([1, 1, 8, 10]);
    this.states = this.initializeStates(this.bucketArrays);
    this.q = this.initializeQTable(this.states.length, this.numberOfActions);

    if (PRINT_DEBUG) {
      this.printDebug();
    }
  }

  initializeStates(buckets) {
    let bucketIndexes = [];
    buckets.forEach((bucket) => {
      bucketIndexes.push(bucket.bucketIndexes);
    })

    let states = cartesianProduct(...bucketIndexes);

    return states;
  }

  /**
   * 
   * We have an amount of observations, but to limit the states we can have we specify ranges or "buckets" for the values
   * In our initialization method, we define the amount of "steps" for each observation bucket 
   * Example: 1, 1, 6, 12 means that for observation #0 we set 1 bucket, #2 also 1, #3 6 buckets and #4 12 buckets
   *          which represents that we will create 12 different steps for observation #4
   * @param {Array} buckets 
   */
  initializeBuckets(bucketSizes) {
    let buckets = [];

    for (let i = 0; i < this.numberOfObservations; i++) {
      const bucketSize = bucketSizes[i];
      const upperBound = this.observationSpaceInfo.high[i];
      const lowerBound = this.observationSpaceInfo.low[i];
      buckets.push(new Bucket(bucketSize, lowerBound, upperBound));
    }

    return buckets;
  }

  /**
   * Since the amount of spaces that we can have is huge, we need to limit this
   * 
   * This limiting is done through using "buckets", or we also say that we put everything that is between X and Y in bucket Z
   * 
   * 
   * For every feature we specify a range between where the values can be
   * TODO: Our Q-Table is [state<tuple>][action] so we need to define the tuple which is our number of observations
   * Therefore we need to "compact" them or write a "range" so that we do not overextend
   * 
   * Note: this is also called "discretization"
   */
  initializeQTable(stateCount, actionCount) {
    let q = []; // Our Q-Table

    for (let stateIdx = 0; stateIdx < stateCount; stateIdx++) {
      q[stateIdx] = [];

      for (let actionIdx = 0; actionIdx < actionCount; actionIdx++) {
        q[stateIdx][actionIdx] = 0;
      }
    }

    return q;
  }

  /**
   * Convert our observation to a state index based on the buckets
   * @param {*} states 
   * @param {*} bucketArrays 
   * @param {*} observations 
   */
  observationToStateIndex(states, bucketArrays, observations) {
    let observationBucketIndexes = [];

    for (let i = 0; i < observations.length; i++) {
      observationBucketIndexes.push(bucketArrays[i].getBucketIdxForValue(observations[i]));
    }

    let stateIndex = states.map(i => i.toString()).indexOf(observationBucketIndexes.toString());
    return stateIndex;
  }

  /**
   * 
   * @param {Array} observation array of observations (e.g. [1, 6, 9, 2.3])
   * @param {number} reward The reward we got from taking the previous action
   */
  async act(client, instanceId, episode, observation) {
    // ========================================================
    // 1. Map the current observation to a state
    // ========================================================
    // We get a number of values back, convert these to states
    let stateIndex = this.observationToStateIndex(this.states, this.bucketArrays, observation);

    // Learning discount factor and learning rate
    const epsilon = this.getEpsilon(episode);
    const alpha = this.getAlpha(episode);

    // ========================================================
    // 2. Based on our observation, choose and take an action and view the change in environment
    // ========================================================
    // Choose an action
    const action = this.chooseAction(stateIndex, epsilon);
    let newEnvironment = await client.envStep(instanceId, action, true); // returns { done, info, observation, reward }
    
    // ========================================================
    // 3. Based on result of the action, update our Q value
    // ========================================================
    let newStateIndex = this.observationToStateIndex(this.states, this.bucketArrays, newEnvironment.observation);
    this.updateQ(stateIndex, action, newEnvironment.reward, newStateIndex, alpha);

    return newEnvironment;
  }

  /**
   * Update our Q-Table based on the Bellman Equation for Action-Value
   * @param {number} oldStateIdx 
   * @param {number} action 
   * @param {number} reward 
   * @param {number} newStateIdx 
   * @param {number} alpha 
   */
  updateQ(oldStateIdx, action, reward, newStateIdx, alpha) {
    this.q[oldStateIdx][action] += alpha * (reward + this.gamma * this.q[newStateIdx].getMaxValue() - this.q[oldStateIdx][action]);
  }

  /**
   * For exploration, return random action if Math.random <= explorationFactor (epsilon), else max Q value for the current state
   * @param {int} state 
   */
  chooseAction(stateIndex, epsilon) {
    let random = Math.random();
    let isRandom = (Math.random() <= epsilon);

    // If we want to explore (depending on epsilon), take a random action
    if (isRandom) {
      return Math.floor(Math.random() * this.numberOfActions);
    }

    return this.q[stateIndex].getIndexOfMaxValue();
  }

  /**
   * Our exploration factor
   * 
   * We use a dynamic parameter dependent on the episode, to be able to reduce exploration over our timeframe
   * @param {*} t 
   */
  getEpsilon(t) {
    return Math.max(this.minEpsilon, Math.min(1.0, 1.0 - Math.log10((t + 1) / this.adaDivisor)));
  }

  /**
   * Our Learning factor
   * 
   * We use a dynamic parameter dependent on the episode, to be able to reduce learning over our timeframe
   * @param {*} t 
   */
  getAlpha(t) {
    return Math.max(this.minAlpha, Math.min(0.5, 1.0 - Math.log10((t + 1) / this.adaDivisor)));
  }

  /**
   * We get an observation (e.g.) [1, 6, 9, 2.3] which defines our "state" or what we currently see.
   * To get our state we need to look at each feature value (1, 6, ...) and define in which bucket these fit. Then we can resolve this to a state idx
   * 
   * Our bucket id is then 
   * 
   * In this method we define this to a unique entry for our Q-Table
   * 
   * @param {*} observation 
   */
  convertObservationToBucketIndexes(observation) {
    let bucketIndexes = [];

    for (let i = 0; i < observation.length; i++) {
      let bucketIndex = Math.floor((observation[i] - this.bucketArrays[i].lowerBound) / this.bucketArrays[i].bucketSize);
      bucketIndexes.push(bucketIndex);
    }

    return bucketIndexes;
  }

  /**
   * Help method to view some details about our algorithm
   */
  printDebug() {
    console.log('=======================================');
    console.log('Buckets');
    console.log('=======================================');
    console.table(this.bucketArrays);

    console.log('=======================================');
    console.log('Possible States');
    console.log('=======================================');
    console.table(this.states);

    console.log('=======================================');
    console.log('Initial Q-Table');
    console.log('=======================================');
    console.table(this.q);
  }
}

/**
 * Get the index value of the maximum value in an array
 * e.g. if our array is [2, 6, 3, 5] it will return 1 since 6 is the highest
 */
Array.prototype.getIndexOfMaxValue = function () {
  return this.indexOf(Math.max(...this));
}

/**
 * Return the highest value in our array
 */
Array.prototype.getMaxValue = function () {
  return Math.max(...this);
}

/**
 * Generate the cartesian product between sets
 * 
 * In other terms: generate all possible combinations of multiple arrays
 * 
 * https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
 * 
 * @param {Array} inArr an array of numbers
 */
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesianProduct = (a, b, ...c) => (b ? cartesianProduct(f(a, b), ...c) : a);

/**
 * Convert degrees to radians
 * @param {number} degrees 
 */
Math.radians = (degrees) => degrees * Math.PI / 180;

/**
 * Convert radians to degrees
 * @param {number} radians 
 */
Math.degrees = (radians) => radians * 180 / Math.PI;
```



### Bucket.js

```javascript
class Bucket {
  constructor(bucketCount, rangeLow, rangeHigh) {
    this.bucketCount = bucketCount;
    this.rangeLow = rangeLow;
    this.rangeHigh = rangeHigh;
    this.stepSize = (Math.abs(rangeLow) + Math.abs(rangeHigh)) / bucketCount;
    this.buckets = [];

    // For easiness we include the indexes
    this.bucketIndexes = [];

    for (let i = 0; i < bucketCount; i++) {
      this.bucketIndexes.push(i);
    }

    this.initBuckets();
  }

  initBuckets() {
    for (let i = 0; i < this.bucketCount; i++) {
      this.buckets[i] = [];
    }
  }

  addValueToBucket(val) {
    let idx = this.getBucketIdxForValue(val);
    this.buckets[idx].push(val);
  }

  getBucketIdxForValue(val) {
    let idx = 0;

    // Find bucket, put values on the outer size of the range in the last bucket
    while ((idx < this.bucketCount - 1) && val > this.rangeLow + this.stepSize * (idx + 1)) {
      idx++;
    }

    return idx;
  }
}

module.exports = Bucket;
```

## References

While creating this solution, I used the following articles as a reference.

* [https://medium.com/@tuzzer/cart-pole-balancing-with-q-learning-b54c6068d947](https://medium.com/@tuzzer/cart-pole-balancing-with-q-learning-b54c6068d947)
* [https://ferdinand-muetsch.de/cartpole-with-qlearning-first-experiences-with-openai-gym.html](https://ferdinand-muetsch.de/cartpole-with-qlearning-first-experiences-with-openai-gym.html)
* [https://threads-iiith.quora.com/Deep-Q-Learning-with-Neural-Networks-on-Cart-Pole](https://threads-iiith.quora.com/Deep-Q-Learning-with-Neural-Networks-on-Cart-Pole)
* [https://gist.github.com/n1try/af0b8476ae4106ec098fea1dfe57f578](https://gist.github.com/n1try/af0b8476ae4106ec098fea1dfe57f578) 
* [https://gist.github.com/n1try/2a6722407117e4d668921fce53845432#file-dqn_cartpole-py](https://gist.github.com/n1try/2a6722407117e4d668921fce53845432#file-dqn_cartpole-py)
