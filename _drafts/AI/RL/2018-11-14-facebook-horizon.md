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

Horizon is a Step by Step platform that allows us to work with our data, preprocess it and run our Reinforcement Learning algorithm on top of it to generate correct results at the end.

The steps for an end to end example as shown in the Usage document (https://github.com/facebookresearch/Horizon/blob/master/docs/usage.md) are:

1. Creating training data
2. Converting the data to the timeline format
3. Create the normalization parameters
4. Train the model
5. Evaluate the model

So before we actually go more in depth on these steps, let's first see what the main files are in our `ml/rl/test/gym` folder:

* `run_gym.py`
* `gym_evaluator.py`
* `gym_predictor.py`

### run_gym.py

When we open up the Usage documentation at https://github.com/facebookresearch/Horizon/blob/master/docs/usage.md we can see a detailed explanation on how you can run your On-Policy RL Training (`python ml/rl/test/gym/run_gym.py -p ml/rl/test/gym/discrete_dqn_cartpole_v0.json`). But what does it actually do? Well if we open up the `ml/rl/test/gym/run_gym.py` file we can see the following code part:

```python
def main(args):
    parser = argparse.ArgumentParser(
        description="Train a RL net to play in an OpenAI Gym environment."
    )
    parser.add_argument("-p", "--parameters", help="Path to JSON parameters file.")
```

So by runing `python ml/rl/test/gym/run_gym.py` we can see the usage of our script which results in:

```bash
Traceback (most recent call last):
  File "ml/rl/test/gym/run_gym.py", line 611, in <module>
    + " [-s <score_bar>] [-g <gpu_id>] [-l <log_level>] [-f <filename>]"
Exception: Usage: python run_gym.py -p <parameters_file> [-s <score_bar>] [-g <gpu_id>] [-l <log_level>] [-f <filename>]
```

This explains us that if we give the parameter file defined by our `-p` parameter that it will train a RL net to play in an OpenAI Gym environment.

Opening up our Parameter file through `cat ml/rl/test/gym/discrete_dqn_cartpole_v0_100_eps.json` shows us:

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

Which are parameters being defined that configure the OpenAI gym environment and how we are going to train. We are thus using a Deep Q-Network with specific parameters (see gamma (=discount factor), epsilon (=exploration factor), ...) and how our Neural Network layers are configured.

### gym_evaluator.py
TODO

### gym_predictor.py
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

