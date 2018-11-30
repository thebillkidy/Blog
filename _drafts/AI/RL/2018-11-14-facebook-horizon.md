---
layout: post
current: post
cover: 'assets/images/covers/horizon.jpg'
navigation: True
title: Testing out Facebook Horizon for Machine Learning at Scale
date: 2018-11-14 09:00:00
tags: reinforcement-learning machine-learning artificial-intelligence dotnet
class: post-template
subclass: 'post'
author: xavier
---

Facebook decided to open-source the platform that they created to solve end-to-end Reinforcement Learning problems at the scale they are working on. So of course I just had to try this ;) Let's go through this together on how they installed it and what you should do to get this working yourself.

> I started by creating a brand new installation of Ubuntu 18.10
> Also tested and verified working on Windows Subsystem for Linux

## Installing Anaconda

Let's start by installing Anaconda, this is easily done by navigating to the documentation located at https://conda.io/docs/user-guide/install/index.html whereafter we can find the link to the Linux Installer https://www.anaconda.com/download/#linux which will give us the installer script: https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh.

We can download and run this by running:

```bash
curl https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh -o conda.sh
bash conda.sh
```

Then follow the steps of the installer to install Anaconda

Once you did this, add the conda installation to your `PATH` variable through:

```bash
echo 'export PATH="$PATH":/home/<YOUR_USER>/anaconda3/bin' >> ~/.bashrc
. ~/.bashrc
```

> Note: the default installation of anaconda is /home/ubuntu/anaconda3 for the Python 3 version

## Configuring Anaconda for our Horizon Installation

Facebook Horizon requires several channels for certain software which we can easily add to anaconda:

```bash
conda config --add channels conda-forge # ONNX/tensorboardX
conda config --add channels pytorch 
```

## Installing Horizon

> For a deeper dive on how you can install Horizon, check out the Git repo: [https://github.com/facebookresearch/Horizon/blob/master/docs/installation.md](https://github.com/facebookresearch/Horizon/blob/master/docs/installation.md)

```bash
git clone https://github.com/facebookresearch/Horizon.git
cd Horizon/
conda install `cat docker/requirements.txt` # wait till it solved the environment, then select y
source activate base # Activate the base conda environment

pip install onnx # Install ONNX
export JAVA_HOME="$(dirname $(dirname -- `which conda`))" # Set JAVA_HOME to anaconda installation
cd # Go back to root

# Install Spark 2.3.1
wget http://www-eu.apache.org/dist/spark/spark-2.3.1/spark-2.3.1-bin-hadoop2.7.tgz
tar -xzf spark-2.3.1-bin-hadoop2.7.tgz
sudo mv spark-2.3.1-bin-hadoop2.7 /usr/local/spark

export PATH=$PATH:/usr/local/spark/bin # add to PATH so we can find spark-submit

# Install OpenAI Gym
pip install "gym[classic_control,box2d,atari]"

# Build Thrift Classes
cd Horizon/
thrift --gen py --out . ml/rl/thrift/core.thrift

# Build Horizon
pip install -e . # we use "-e" for "ephemral package" which will instantly reflect changes in the package
```

## Horizon (Global Overview)

### Introduction

Horizon is an End-To-End platform which *"includes workflows for simulated environments as well as a distributed platform for preprocessing, training, and exporting models in production."* - [(Source)](https://code.fb.com/ml-applications/horizon/)

From reading the [paper](https://research.fb.com/wp-content/uploads/2018/10/Horizon-Facebooks-Open-Source-Applied-Reinforcement-Learning-Platform.pdf) we can read that this platform was created with the following in mind:

* Ability to Handle Large Datasets Efficiently
* Ability to Preprocess Data Automatically & Efficiently
* Competitive Algorithimic Performance
* Algorithm Performance Estimates before Launch
* Flexible Model Serving in Production
* Platform Reliability

Which sounds awesome to me, so let's get started by how we are able to utilize this platform, whereafter we can do a more deep-dive in how it works. 

> For some of the terminilogy used in Reinforcement Learning, feel free to check my [previous blog post](/rl-overview-terminology) about it.


### Getting Started

Getting started with Horizon is as easy as checking the [usage](https://github.com/facebookresearch/Horizon/blob/master/docs/usage.md) documentation written by them. This includes the steps

1. Creating training data
2. Converting the data to the timeline format
3. Create the normalization parameters
4. Train the model
5. Evaluate the model

So before we actually go more in depth on these steps, let's first see what the main files are in our `ml/rl/test/gym` folder:

* `run_gym.py`
* `gym_evaluator.py`
* `gym_predictor.py`

#### run_gym.py

##### main()

**Location:** my/rl/test/gym/run_gym.py

Let's look straight at our `main` method:

```python
def main(args):
    parser = argparse.ArgumentParser(
        description="Train a RL net to play in an OpenAI Gym environment."
    )
    parser.add_argument("-p", "--parameters", help="Path to JSON parameters file.")
```

Which shows us that when running the command `python ml/rl/test/gym/run_gym.py` that we are able to see the usage of our script in the console:

```bash
Traceback (most recent call last):
  File "ml/rl/test/gym/run_gym.py", line 611, in <module>
    + " [-s <score_bar>] [-g <gpu_id>] [-l <log_level>] [-f <filename>]"
Exception: Usage: python run_gym.py -p <parameters_file> [-s <score_bar>] [-g <gpu_id>] [-l <log_level>] [-f <filename>]
```

Explaining us that if we give the parameter file defined by our `-p` parameter it wil load this JSON file and load it into a variable called `params`:

```python
with open(args.parameters, "r") as f:
    params = json.load(f)
```

The main method will now continue doing a couple of things:
* Initialize a dataset variable of type `RLDataset` if the `file_path` parameter is set
  * `file_path`: If set, save all collected samples as an RLDataset to this file.
* Call the method `run_gym` with the parameters and arguments provided
* Save the results to a csv if the `results_file_path` parameter is set
* Return the reward history

```python
dataset = RLDataset(args.file_path) if args.file_path else None
reward_history, timestep_history, trainer, predictor = run_gym(
    params, args.score_bar, args.gpu_id, dataset, args.start_saving_from_episode
)

if dataset:
    dataset.save()
if args.results_file_path:
    write_lists_to_csv(args.results_file_path, reward_history, timestep_history)

return reward_history
```

##### run_gym()

The `run_gym` method appears to be using the parameters that we loaded from our JSON file to initialize the OpenAI Gym Environment. So let's see how one of these JSON files look like by opening one, running a quick `cat ml/rl/test/gym/discrete_dqn_cartpole_v0_100_eps.json` shows us:

```json
{
  "env": "CartPole-v0",
  "model_type": "pytorch_discrete_dqn",
  "max_replay_memory_size": 10000,
  "use_gpu": false,
  "rl": {
    "gamma": 0.99,
    "target_update_rate": 0.2,
    "reward_burnin": 1,
    "maxq_learning": 1,
    "epsilon": 1,
    "temperature": 0.35,
    "softmax_policy": 0
  },
  "rainbow": {
    "double_q_learning": false,
    "dueling_architecture": false
  },
  "training": {
    "layers": [
      -1,
      128,
      64,
      -1
    ],
    "activations": [
      "relu",
      "relu",
      "linear"
    ],
    "minibatch_size": 64,
    "learning_rate": 0.001,
    "optimizer": "ADAM",
    "lr_decay": 0.999,
    "use_noisy_linear_layers": false
  },
  "run_details": {
    "num_episodes": 100,
    "max_steps": 200,
    "train_every_ts": 1,
    "train_after_ts": 1,
    "test_every_ts": 2000,
    "test_after_ts": 1,
    "num_train_batches": 1,
    "avg_over_num_episodes": 100
  }
}
```

Which shows that the Environment, Epsilon, Softmax Policy and Gamma parameters are all used to boot op the OpenAIGymEnvironment. Next to that the `run_gym` method will also initialize a replay_buffer, create the trainer and create predictor. Whereafter it will run the `train_sgd` method.

> Additional comments were added to the code for more clearity

```python
env_type = params["env"]

# Initialize the OpenAI Gym Environment
env = OpenAIGymEnvironment(
    env_type,
    rl_parameters.epsilon,
    rl_parameters.softmax_policy,
    rl_parameters.gamma,
)
replay_buffer = OpenAIGymMemoryPool(params["max_replay_memory_size"])
model_type = params["model_type"]

use_gpu = gpu_id != USE_CPU

# Use the "training" {} parameters and "model_type": "<MODEL>" model_type
# to create a trainer as the ones listed in /ml/rl/training/*_trainer.py
# The model_type is defined in /ml/rl/test/gym/open_ai_gym_environment.py
trainer = create_trainer(params["model_type"], params, rl_parameters, use_gpu, env)

# Create a GymDQNPredictor based on the ModelType and Trainer above
# This is located in /ml/rl/test/gym/gym_predictor.py
predictor = create_predictor(trainer, model_type, use_gpu)

c2_device = core.DeviceOption(
    caffe2_pb2.CUDA if use_gpu else caffe2_pb2.CPU, int(gpu_id)
)
```

##### train_sgd()
TODO https://github.com/facebookresearch/Horizon/blob/master/ml/rl/test/gym/run_gym.py#L81

#### gym_evaluator.py
TODO

#### gym_predictor.py
TODO

## Horizon (Running the End-To-End example)

When going through the End-to-End example in the Usage documentation, we can instantly understand why they created Horizon the way they did. It really allows you to go step by step in your environment, allowing you to have full control of what you are doing. Let's summarize the steps that are being done in this Usage.md documentation:

1. **Creating training data:** Generate data by going through the environment that we defined in the parameters file. This way we can train offline and develop our parameters.json file before going on a large amount of episodes. Here we also generalize our data to a "unified" format that can be easily understood and used in a production environment where code is being re-used in scopes beyond just OpenAI Gym.
2. **Converting the data to the timeline format:** The first step we did was to extract data from our OpenAI Gym environment so that we are able to work with this data and understand it easily. Our models however are trained on state/action tuples. To create this table, we utilize the `RLTimelineOperator` spark operator.
    * Be sure to check out the `ml/rl/workflow/sample_configs/discrete_action/timeline.json` file which contains the definitions of which table is being converted to the timeline format.
    * Interesting here as well is how you are able to clear your last run's spark data: `rm -Rf spark-warehouse derby.log metastore_db preprocessing/spark-warehouse preprocessing/metastore_db preprocessing/derby.log` and submit a job: 
    
    ```bash
    /usr/local/spark/bin/spark-submit \
        --class com.facebook.spark.rl.Preprocessor preprocessing/target/rl-preprocessing-1.1.jar \
        "`cat ml/rl/workflow/sample_configs/discrete_action/timeline.json`"
    ```
3. **Create the normalization parameters:** to improve the performance of our Neural Networks, Horizon includes a workflow that normalizes the data to fix the sparse, noisy and arbitrarily distributed problems
4. **Train the model:** Train our model, this is however a generalized model that can be reused for other RL agents and not just the Gym Agent. We just take the previously generated data (which in this came from our OpenAI Gym). Which was then processed and reformed in a general structure.
5. **Evaluate the model:** See how well it is performing.
    * TODO: How can I visualize this?
6. **Visualize Results via Tensorboard:** quite straightforward: `tensorboard --logdir outputs/`

> Note: I did not had gzcat on my machine but rather had to use `gunzip -c ml/rl/workflow/sample_datasets/discrete_action/cartpole_pre_timeline.json.gz | head -n1 | python -m json.tool` where `gunzip -c` is the same as `gzcat`. This command takes one row of data.

