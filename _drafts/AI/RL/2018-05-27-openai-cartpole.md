---
layout: post
current: post
cover: 'assets/images/covers/rl3.png'
navigation: True
title: Solving OpenAI Gym Problems - Getting to know OpenAI through the CartPole example
date: 2018-05-27 09:00:00
tags: reinforcement-learning machine-learning artificial-intelligence
class: post-template
subclass: 'post'
author: xavier
---

In a previous post we set-up the OpenAI Gym to interface with our Javascript environment. Let's now look at how we can use this interface to run the CartPole example and solve it with the theory learned until now.

Requirements:

* [How to run OpenAI Gym on Windows and with Javascript](/running-openai-gym-on-windows-and-js)
TODO: * [Policy Evaluation, Improvement, Iteration and Value Iteration](/policy-evaluation-improvement-iteration-value-iteration)
* [Bellman Equations](/bellman-equations)
* [The Markov Property, Chain, Reward Process and Decision Process](/markov-property-chain-reward-decision)
* [An introduction to Reinforcement Learning (RL)](/rl-intro)

## Setting up our Experiment

We are again going to use Javascript to solve this, so everything you did before in the first article in our requirements comes in handy. Create a new directory with our `package.json` and a `index.js` file for our main entry point.

> **Note:** To make things easier, it's recommended to add a line that will start our server in the `package.json` file under the `scripts`: `nodemon -x 'python ../OpenAI-Gym/server.py'`. That way we can run `npm run server` to start our server, just make sure that you also run `npm install nodemon --save-dev` to ensure that the package is installed. Make sure to edit the path to point to the correct directories (in my case I put my experiments just one directory above the OpenAI-Gym files)

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

Basically, these are 4 random continuous numbers that we do not know what they do in our algorithm... (though we can make an interpretation of them with our human brains and say that they represent **position $x$**, **velocity $v$**, **angle $\theta$** and **angular velocity $\alpha$**).

Next to these 4 random numbers, we also know by observing the action space that we can take 2 specific discrete actions (again by using our human brain we can classify this as moving the cart to the left or moving it to the right).

Applying what we learned in the previous article of [RL Intro][/rl-intro], we know that we need to create a policy that shows us which actions we can take and optimise this using our [Bellman Equations](/bellman-equations) to result in the best value.





--> exploration stuff
Well remember what we discussed in the [Multi-armed bandit framework](/n-arms-bandit-framework) article? There we learned that we need to choose actions, while still exploring other actions. 

## Files

### Index.js Template

```javascript
/**
 * For more information, check: https://gym.openai.com/docs/
 */
const gym = require('../OpenAI-Gym/gym-http-api/binding-js/dist/lib/gymHTTPClient');

const episodeCount = 1000;
const maxTimeSteps = 250;
const outDir = "/tmp/random-agent/results";
const numTrials = 3;
const envId = "CartPole-v0";
const client = new gym.default("http://127.0.0.1:5000");

class Experiment {
  constructor() {
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
    // For CartPole-v0 this returns: { info: { high: [], low: [], name: 'Box', shape: [ 4 ] } }
    this.observationSpaceInfo = await client.envObservationSpaceInfo(this.environment.instance_id);

    // Set our learning agent
    this.agent = new RandomDiscreteAgent(this.actionSpaceInfo.info["n"], this.observationSpaceInfo.info.shape[0]);
  }

  async run() {
    await this.initialize();

    // Start Monitoring
    await client.envMonitorStart(this.environment.instance_id, outDir, true);

    // For every episode
    for (let episode = 0; episode < episodeCount; episode++) {
      // Reset the whole environment to start over
      let state = {
        done: false,
        info: {},
        observation: await client.envReset(this.environment.instance_id), // envReset gives an initial observation
        reward: 1,
      }

      // Keep executing while we can:
      // if state.done = true, then that means the pole tipped to far, or we died
      // if t >= maxTimeSteps, then we did not solve it fast enough
      let t = 0;
      while (!state.done && t < maxTimeSteps) {
        t++;

        // Decide which action to take based on our observations and reward achieved on previous action
        const action = this.agent.act(state.observation, state.reward, state.done);

        // Execute this action in our environment
        // Returns: { observation, reward, done, info }
        state = await client.envStep(this.environment.instance_id, action, true);
      }

      console.log(`Episode ${episode} ended after ${t} timesteps with done == ${state.done}, received reward: ${state.reward}`);
    }

    // Stop Monitoring
    await client.envMonitorClose(this.environment.instance_id);

    // Upload the results to OpenAI
    console.log(await client.upload(outDir));
  }
}

// Create and run our experiment
const experiment = new Experiment();
experiment.run();

// Our Agent in charge of learning based on the observation and reward
class RandomDiscreteAgent {
  constructor(numberOfActions, numberOfObservations) {
    this.numberOfActions = numberOfActions;
    this.numberOfObservations = numberOfObservations;
  }

  act(observation, reward) {
    return Math.floor(Math.random() * this.numberOfActions);
  }
}
```

## References

While creating this solution, I had a lot of help by reading the following articles. 

> Please note that these are not directly copied over since the theory results from earlier blog post and that these are written in Python while this solution is in Javascript.

* [https://medium.com/@tuzzer/cart-pole-balancing-with-q-learning-b54c6068d947](https://medium.com/@tuzzer/cart-pole-balancing-with-q-learning-b54c6068d947)
* [https://ferdinand-muetsch.de/cartpole-with-qlearning-first-experiences-with-openai-gym.html](https://ferdinand-muetsch.de/cartpole-with-qlearning-first-experiences-with-openai-gym.html)
* [https://threads-iiith.quora.com/Deep-Q-Learning-with-Neural-Networks-on-Cart-Pole](https://threads-iiith.quora.com/Deep-Q-Learning-with-Neural-Networks-on-Cart-Pole)
* [https://gist.github.com/n1try/af0b8476ae4106ec098fea1dfe57f578](https://gist.github.com/n1try/af0b8476ae4106ec098fea1dfe57f578) 
* [https://gist.github.com/n1try/2a6722407117e4d668921fce53845432#file-dqn_cartpole-py](https://gist.github.com/n1try/2a6722407117e4d668921fce53845432#file-dqn_cartpole-py)

> note to self: last one is best