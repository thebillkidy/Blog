---
layout: post
current: post
cover: 'assets/images/covers/docker.png'
navigation: True
title: Connect to your Docker Daemon through the Windows Subsystem for Linux (WSL)
date: 2018-05-01 09:00:00
tags: infrastructure
class: post-template
subclass: 'post'
author: xavier
---

Do you have Windows installed and you love using the Linux Subsystem on it? (commonly known as WSL) Well let me tell you the steps to achieve this.

Let's start by Install the docker client on your WSL, which you can do this easily through this command: 

```bash
# Install Docker
curl -sSL https://get.docker.com/ | sh
```

Once you have the client readily available, you need to change a setting in your Docker Daemon (running on Windows!) by right clicking the Docker Whale in your taskbar and going to settings. There just check "Expose daemon on tcp://localhost:2375 without TLS" as shown in the screenshot below.

![/assets/images/posts/docker-windows-expose-daemon.png](/assets/images/posts/docker-windows-expose-daemon.png)

The last thing left to do now is to configure your WSL to let the Docker client connect to the correct daemon. For that, run the following command:

```bash
export DOCKER_HOST="tcp://127.0.0.1:2375"
```

Whereafter you will be able to run `docker ps` and see your containers running.