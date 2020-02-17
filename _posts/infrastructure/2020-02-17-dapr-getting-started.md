---
layout: post
current: post
cover:  assets/images/covers/dapr.png
navigation: True
title: Getting started with Dapr, Python and gRPC
date: 2019-02-17 09:00:00
tags: infrastructure dapr
class: post-template
subclass: 'post'
author: xavier
---
 
The cloud war is heating up and one of the main challenges is the fear of lock-in created by these providers. Helping the raise of Kubernetes as a provider, since this allows customers to quickly move between one and the other (a deployment is a deployment, no matter the cloud you run it on.).

Looking at the above, a new Runtime was created that allows customers to create applications that still allow the goodness of these cloud platforms (PaaS components), while developing their Microservices. Which is why **[Dapr](https://dapr.io)** was born.

Dapr stands for Distributed Application Runtime and provides building blocks to create a resilient, stateless or stateful microservice that can run on the cloud and edge, while still being language independent. Backed by HTTP or gRPC depending on the performance needs that you have.

## Getting Started - Installing Dapr

Dapr was amazing to get started with! In just 5 minutes I had my first microservice running by following the [documentation](https://github.com/dapr/docs/blob/master/getting-started/environment-setup.md). To setup Dapr, we can simply run:

**Windows - PowerShell**

```bash
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
dapr init
```

**Linux**

```bash
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
dapr init
```

> **Important:** When running `dapr init`, dapr will take care of automatically creating your **state store** under the `components/` folder. We will now have 2 files called `messagebus.yaml` and `statestore.yaml` that we can use to communicate with.

## Getting Started - Running Python gRPC Example

For low-latency requiring application, gRPC is a smart choice. It's often used when we require inter process communication between applications, when normal HTTP overhead is not required (e.g. simulators that we want to hook up together).

Luckily Dapr allows both HTTP and gRPC connectors, making our lives easier! When looking at the [gRPC Documentation](https://github.com/dapr/docs/tree/master/howto/create-grpc-app) we just need to specify that we are utilizing gRPC through the command line (or Kubernetes YAML file).

Therefor we can get started by creating a Python example called **server.py**:

```python
from dapr import dapr_pb2 as messages
from dapr import dapr_pb2_grpc as services
import grpc
from google.protobuf.any_pb2 import Any

channel = grpc.insecure_channel('localhost:50001')
client = services.DaprStub(channel)

# Set the state
stateStoreName="my-state-store" # Note: see components/statestore.yaml at the metadata.name key and configure correctly
stateReq = messages.StateRequest(key="my-first-state", value=Any(value="Hello World".encode('utf-8')))
stateEnvelope = messages.SaveStateEnvelope(storeName=stateStoreName, requests=[stateReq])
client.SaveState(stateEnvelope)

# Close the channel
channel.close()
```

Which we can then start in the Dapr runtime through:

```bash
# Start our server.py in Dapr on HTTP Port 50002 and gRPC Port 50001
dapr run --app-id python-grpc --port 50002 --protocol grpc --grpc-port=50001 python server.py
```

Instantly showing the output stating that it started and saved our state configuration.

```bash
PS F:\dapr> dapr run --app-id python-grpc --port 50002 --protocol grpc --grpc-port=50001 python server.py
Starting Dapr with id python-grpc. HTTP Port: 50002. gRPC Port: 50001
You're up and running! Both Dapr and your app logs will appear here.

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="starting Dapr Runtime -- version 0.4.0 -- commit v0.3.0-rc.0-73-ga1e270f-dirty"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="log level set to: info"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="standalone mode configured"       

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="dapr id: python-grpc"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="mTLS is disabled. Skipping certificate request and tls validation"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="loaded component my-state-store (state.redis)"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="loaded component messagebus (pubsub.redis)"

== DAPR == 2020-02-17 21:41:29.863654 I | redis: connecting to localhost:6379

== DAPR == 2020-02-17 21:41:29.870653 I | redis: connected to localhost:6379 (localAddr: [::1]:56504, remAddr: [::1]:6379)

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="Initialized service discovery to standalone"

== DAPR == time="2020-02-17T21:41:29+01:00" level=warning msg="failed to init input bindings: 
app channel not initialized"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actor runtime started. actor idle 
timeout: 1h0m0s. actor scan interval: 30s"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actors: starting connection attempt to placement service at localhost:6050"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="http server is running on port 50002"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="gRPC server is running on port 50001"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="local service entry announced"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="dapr initialized. Status: Running. Init Elapsed 17.0031ms"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actors: established connection to 
placement service at localhost:6050"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actors: placement order received: 
lock"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actors: placement order received: 
update"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actors: placement tables updated"

== DAPR == time="2020-02-17T21:41:29+01:00" level=info msg="actors: placement order received: 
unlock"

== APP == Saved State
```

When now checking this with the following `curl` command, we are able to validate our state over the HTTP interface!

```bash
curl http://localhost:50002/v1.0/state/my-state-store/my-first-state
```

**Result:**

```bash
PS F:\dapr> curl http://localhost:50002/v1.0/state/my-state-store/my-first-state       
Hello World
```

And there we go, as simple as that we are now able to utilize Dapr with a state store to communicate through gRPC (which is normally something quite complex to do).