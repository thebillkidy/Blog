

Summary

Agent interact with environment based on its policy $\pi(a \mid s)$ 
This is a function from states s to action a
--> Distribution over the possible actions

After every action, the agent receives a reward r from the environment

Interaction between agent and environment: $(s_t, a_t, r_t, s_{t+1}, a_{t+1}, r_{t+1}, s_{t+2}, \ldots)$ indexed by time t

Goal: Find policy $\pi$ that maximizes the amount of reward over time.

In DP approach, its helpful to define a Value Function $V^\pi(s)$ 
* this gives expected reward when starting from the state s and then interacting with the environment according to $\pi$

$$ V^\pi(s) = E \{ r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \ldots \mid s_t = s \} $$



$$ V^\pi(s) = \sum_{a} \pi(s,a) \sum_{s'} \mathcal{P}_{ss'}^{a} \left[ \mathcal{R}_{ss'}^{a} + \gamma V^\pi(s') \right] $$

$$(\mathcal{P}_{ss'}^{a} , \mathcal{R}_{ss'}^{a})$$ are fixed

