---
layout: post
current: post
cover: 'assets/images/covers/facebook-reagent.png'
navigation: True
title: Facebook ReAgent - An End-to-End Use Case
date: 2019-10-28 09:00:05
tags: azure ai ai-rl ai-ml
class: post-template
subclass: 'post'
author: xavier
---

The usage of Reinforcement Learning is increasing day-by-day, solving more complex tasks and optimizing the world more. So much that we are even in the cycle of transforming from [Software 1.0 to Software 2.0](https://medium.com/@karpathy/software-2-0-a64152b37c35). But how can we grasp this? What are use cases being done today already? 

Let's take a look at different use cases and split them up in the parts required for RL:

* Description: What is the use case about?
* Objective: What is the objective we want to tune towards?
* State: What is the state that we observe composed off?
* Action: Which actions can the agent take?
* Rewards: What are the rewards that we get?
  
## [Rate Control] 360-Video Streaming

### Description

In video streaming, we would like to give the a user the best QoE (Qualify of Experience) possible. This depends on different factors such as Network Speed, Device being used, Connectivity Used (celullar, WiFi, Ethernet, ...) and others.

### Objective

Improve the QoE 

### State, Action and Rewards

* **Environment State:**
  * Last Video Bitrate
  * BL Buffer Size History
  * EL Buffer Size History
  * BL End of Video Indicator
  * EL End of Video Indicator
  * BL Remaining Chunks
  * EL Remaining Chunks
  * EL Rebuffering Indicator
  * FoV Prediction Accuracy for Next EL Chunk
  * Video Chunk Size History
  * Download Time History
  * Next Chunk Sizes
* **Agent Actions**
  * Which chunk to send
  * Bitrate to choose
  * ...
  * Limitation: not allowed to skip enhancement chunks or fetch a later chunk first
* **Rewards:**
  * Maximize QoE (Quality of Experience)
  * Rebuffering time should be as small as possible
  * Smooth video (aka: quality difference between adjacent chunks should be minimal)

## [Network] Dynamic Spectrum Access

### Description

We want to allow users to locally select channels to maximize their throughput. The user might however not

### Objective



### State, Action and Rewards

* **Environment State:**
* **Agent Actions**
* **Rewards:**
	
* Allow users to locally select channels to maximize their throughput
* The user however may not have full observations of the system (e.g. channel states)
Join User Association and Spectrum Access
* User association is implemented to determine which user to be assigned to which base station.
Adaptive Rate Control
* Bitrate/data rate control in dynamic and unpredictable environments
	* E.g. HTTP (DASH)
	* Objective: maximize QoE


## TITLE

### Description



### Objective



### State, Action and Rewards

* **Environment State:**
* **Agent Actions**
* **Rewards:**
	
	
## References

https://arxiv.org/pdf/1810.07862.pdf - Interesting
https://aodongli.github.io/files/360-degree-video.pdf
https://arxiv.org/pdf/1901.00959.pdf




## RL Use Cases

### Network Access - Dynamic Spectrum Access (select channels to maximize throughput)

#### Dynamic Channel Access for one sensor (DQN)

* **Description:** Each timeslot, the sensor has to select one out of M channels for transmitting its packet
  * **Objective:** Find an optimal policy which maximizes the sensor's expected accumulated discounted reward over time slots
  * **State:** In low interference (successful transmission) or high interference (transmission failure)
  * **Actions:** Select one of M channels
  * **Rewards:** +1 if channel in low interference; -1 otherwise
* **Reference:** *"Deep Reinforcement Learning for Dynamic Multichannel Access"*

#### Joint Channel Selection and Packet Forwarding (DQN)

* **Description:** In a multi-sensor scenario, how to address the joint channel selection and packet forwarding. Where we have a relay agent that forwards packets it received from neighboring sensors to a sink. The relay agent has a buffer that keeps the received messages until it's able to forward them.
  * **Objective:** Find an optimal policy which maximizes the sensor's expected accumulated discounted reward over time slots
  * **State:** Combination of the buffer state and channel state.
  * **Actions:** Select a set of channels, numbers of packets transmitted on the channels and a modulation mode.
  * **Rewards:** +1 if channel in low interference; -1 otherwise
* **Reference:** *A new DQN based transmission scheduling mechanism for the Cognitive Internet of Things*
* 
#### Vehicle-to-Vehicle (V2V) transmission capacity maximization (DQN)

* **Description:** In Vehicle-to-Vehicle communications, latency is important due to the mobility of V2V transmitters/receivers and is vital for traffic safety. Here the V2V transmitter have to select a channel and transmit power.
  * **Objective:** Which channel to select and which transmit power to maximize its capacity under a latency constraint.
  * **State:** Consists of:
    * The instantaneous CSI of the corresponding V2V link
    * The interference to the V2V link in the previous time slot
    * The channels selected by the V2V transmitter' neighbors in the previous timeslot
    * The remaining time to meet the latency constraints
  * **Actions:** Which channel to choose and which transmit power level
  * **Rewards:** Is a function of the V2V transmitter's capacity and level
* **Reference:** *Deep Reinforcement Learning for resource allocation in v2v communications*

#### Dynamic Spectrum Access for multiple users sharing K channels (DQN) in Cellular Networks

* **Description:** At a time slot, the user selects a channel with a certain attempt probability or chooses not to transmit at all.
  * **Objective:** The problem of the user is to find a vector of the strategies (the policy over timeslots) to maximize its expected accumulated discounted data rate of the user.
  * **State:** The history of the user's actions and its local observations, and the user's strategy is mapping from the history to an attempt probability
  * **Actions:** 
  * **Rewards:** 
* **Reference:** *Deep multi-user reinforcement learning for dynamic spectrum access in multichannel wireless networks*

#### Channel Allocation to new arrival users in a multibeam satellite system

* **Description:** How to allocate channels to new arrival users in a multibeam satellite system? A multibeam satellity system generates a geographical footprint subdivided into multiple beams, which provide services to ground User Terminals (UTs). This system has a set of channels, if there exist available channels, the system allocates a channel to the new arrived UT. Otherwise the service is blocked.
  * **Objective:** Find a channel allocation decision to minimize the total service blocking probability of the new UT over time slots without causing the interference to the current UTs
  * **State:** 
    * The set of current UTs
    * The current channel allocation matrix
    * The new arrived UT 
  * **Actions:** An index indicating which channel is allocated to the new arrived UT
  * **Rewards:** Positive when the new service is satisfied; negative when the service is blocked
* **Reference:** [*Deep reinforcement learning based dynamic channel allocation algorithm in multibeam satellite systems*](https://ieeexplore.ieee.org/document/8302493)

![https://ieeexplore.ieee.org/mediastore_new/IEEE/content/media/6287639/8274985/8302493/liu2-2809581-large.gif](https://ieeexplore.ieee.org/mediastore_new/IEEE/content/media/6287639/8274985/8302493/liu2-2809581-large.gif)

### Network Access - Joint User Association and Spectrum Access

#### Use Association and Resource Allocation in heteregeneous networks

* **Description:** Consider a HetNet which consists of multiple users and Base Stations (BS) including macro base stations and femto base stations. The BSs share a set of orthogonal channels, and the users are randomly located in the network. 
  * **Objective:** How to select one BS and a channel that maximizes its data rate, while guaranteeing that the Signal-to-Interference-plus-Noise Ration (SINR) of the user is higher than a minimum Quality of Service (QoS) requirement.
  * **State:** a vector including QoS states of all users (where each user is an agent)
    * The QoS state of the user refers to whether its SINR exceeds the minimum QoS requirement or not
  * **Actions:** BS and Channel to select
  * **Rewards:** If QoS is satisfied, receive utility as its immediate reward; Else receive negative reward
* **Reference:** [*Deep reinforcement learning for dynamic spectrum access in multichannel wireless networks*](https://www.researchgate.net/publication/315890579_Deep_Multi-User_Reinforcement_Learning_for_Dynamic_Spectrum_Access_in_Multichannel_Wireless_Networks)

#### Join User Association, spectrum access and content caching in an LTE network consisting of UAVs serving Ground users

* **Description:** UAVs are equipped with storage units and can act a sa cache-enabled LTE Base Station (LTE-BS). The UAVs are able to access both licensed and unlicensed bands in the network and are controlled by a cloud-based server. The transmissions from the cloud to the UAVs are implemented by usng the licensed cellular band.
  * **Objective:** Determine:
    * Optimal user association
    * Bandwidth allocation indicators on the licensed band
    * The timeslot indicators on the unlicensed band
    * A set of popular contents that the users can request to maximize the numer of users with stable queue (i.e. users satisfied with content transmission delay)
  * **State:** ...
  * **Actions:** ...
  * **Rewards:** ...
* **Reference:** [*Liquid State Machine Learning for Resource Allocation in a Network of Cache-Enabled LTE-U UAVs*](https://par.nsf.gov/servlets/purl/10066970)

### Adaptive Rate Control

#### Dynamic Adaptive Streaming over HTTP (DASH)

* **Description:** DASH becomes the dominant standard for video streaming, it is able to leverage existing content delivery network infrastructure and is compatible with a multitude of client-side applications. Videos are stored in servers as multiple segments (i.e. chunks) with each segment being encoded at different compression levels to generate representations with different bitrates (i.e. different video visual quality). At each time a client chooses a representation (i.e. a segment with a certain bitrate), to download.
  * **Objective:** The client has to find an optimal policy which maximizes its QoE such as maximizing average bitrate and minimizing rebuffering (i.e. the time which the video playout freezes).
  * **State:** Given the reward formulation, this should include:
    * The video quality of the last downloaded segment
    * The current buffer state
    * The rebuffering time
    * The channel capacities experienced during downloading of segments in the past time slots
  * **Actions:** Which representation to download
  * **Rewards:** Defined as a function of:
    * Visual Quality of the video
    * Video Quality stability
    * Rebuffering event
    * Buffer state
* **Conclusion:** 
  * DQL can improve QoE up to 25% compared with the bitrate control scheme
  * By having sufficient buffer to handle network throughput fluctuation, DQL can reduce rebuffering by 32.8%
  * Further improvements can be made by reducing state space through a video quality prediction network (Qarc: Video Quality aware rate control for real-time video streaming based on DRL).
* **Reference:** [*Dynamic Adaptive Streaming over http: standards and design principles*](https://pdfs.semanticscholar.org/4c2e/59034d8f6de995e9c9e8bdfcd4f7834f4e9a.pdf) & [*D-dash: A deep q-learning framework for dash video streaming*](https://ieeexplore.ieee.org/document/8048013)

#### Rate control in High Volume Flexible Time (HVFT) applications

* **Description:** HVFT applications utilize cellular networks to deliver IoT traffic. These HVFT applications have a large volume of traffic, and traffic scheduling is necessary. Mostly static priority classes per traffic type are assigned and scheduling is based on that; this does however not accommodate new traffic classes, therefor DQN is a good solution. The network model is a single cell including one base station as a central controller and multiple mobile users.
  * **Objective:** The Base Station has to find a proper policy (i.e. data rate for the users) to maximize the amount of transmitted HVFT traffic while minimizing performance degradation to existing data traffics.
  * **State:** Current network state and useful features extracted from network states in the past time slots. At a time slot this includes:
    * Congestion metric (ie. the cell's traffic load)
    * Total number of network connections
    * Cell efficiency (i.e. the cell quality)
  * **Actions:** Is a combination of the traffic rate for the users
  * **Rewards:** Is afunction of:
    * The sum of HVFT traffic
    * Traffic loss to existing applications due to the presence of HVFT traffic
    * The amount of bytes served below desired minimum throughput
* **Reference:** [*Cellular network traffic scheduling with deep reinforcement learning*](http://asl.stanford.edu/wp-content/papercite-data/pdf/Chinchali.ea.AAAI18.pdf)

#### Rate control in Unpredictable Environments (orbital dynamics, atmospheric and space wather, and dynamic channels)

* **Description:** In these kind of systems, the transmitter needs to be configured with several transmit parameters (e.g. symbol rate and encoding rate) to achieve multiple conflict objectives (e.g. low Bit Error Rate - BER, throughput improvement, power and spectrac efficiency). The adaptive coding and modulation schemes can be used. However, the methods allow to achieve only limited number objectives.
  * **Objective:**  Maximize the system performance
  * **State:** The system performance measured by the transmitter, and thus the state is the reward.
  * **Actions:** A combination of
    * Symbol Rate
    * Energy per symbol
    * Modulation Rate
  * **Rewards:** A fitness function of performance parameters, including:
    * BER estimated at the receiver
    * Throughput
    * Spectrac Efficiency
    * Power Consumption
    * Transmit Power efficiency
* **Reference:** [*Multi-objective reinforcement learning for cognitive satellite communications using deep neural network ensembles*](https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20170007958.pdf)


#### TITLE

* **Description:** 
  * **Objective:** 
  * **State:** 
  * **Actions:** 
  * **Rewards:** 
* **Reference:** [**]()