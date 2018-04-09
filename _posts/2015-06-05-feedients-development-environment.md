---
layout: post
current: post
cover: 'assets/images/covers/experience.jpg'
navigation: True
title: Feedients Development Environment
date: 2015-06-05 18:41:00
tags: experience, startups, feedient
class: post-template
subclass: 'post tag-experience tag-startups'
author: xavier
---

## Why did we use this development environment?

![Feedient setup](https://lh3.googleusercontent.com/rqhNZ3cSvwBui8n7mCnhuK8vWcFo-D2vrWqRJ-7JFgw=s600 "docker-17-36-51-1.jpg")
One of the tasks when hiring a new developer is to get this developer completely set-up on his new development environment. Most of the time this task takes a lot of time resulting in a lost workday for the newly hired employee.

That is why we at Feedient are using a development environment that consists out of the following:

- [CoreOS](https://coreos.com) (A stripped Linux distribution that has the unneeded software removed that other Linux distributions have)
- [Docker](https://www.docker.com) (Container management tool that uses Linux LVM)
- [Vagrant](https://www.vagrantup.com/) (Virtual Machine manager, mostly used for development environments).

>*Other alternatives too this setup are possible by switching out the Linux distribution for a more popular one such as Ubuntu, CentOS, ... And changing the container management tool for a provisioner such as Chef, Puppet, Ansible, ...*

The advantages of using this development environment are

- Small initial setup time allowing the newly hired development too start developing within 10 minutes.
- Almost an exact clone of the production environment, this allows the developer too test changes that are not dependent on the OS.
- Docker has the advantage over Chef / Puppet / Ansible / ... that it is way faster and smaller.
- Separation of concerns, we keep the complete development environment on a VM so that the developer does not need to install unneeded software on their own machine.
- CoreOS ships Docker by default, which is one package less to install.

## Setting up the environment

### Installing the prerequisites for the developer

Every environment has prerequisites that have to be installed, we can not avoid this but we can keep it to a minimum. This is why a new developer only has to install the following when they come in:

- [VirtualBox](https://www.virtualbox.org/) (Virtualization Software)
- [Vagrant](https://www.vagrantup.com/)
- [Git](http://git-scm.com/) (Version Control System)

A way to remove these initial prerequisites is by pre-installing the software on the computer of the developer before they receive it.

### Preparing Vagrant to boot for the first time

As soon as we have downloaded the prerequisites we have to start vagrant. Vagrant uses a `Vagrantfile` which contains the specification of the Virtual Machine that is going to be created when we enter `vagrant up`.

We have created our own repository that a new developer has to clone with the use of git and then they can instantly start their vagrant machine which does the rest of the configuration.

For a basic Vagrantfile that will install CoreOS you can clone this repository: [https://github.com/coreos/coreos-vagrant](https://github.com/coreos/coreos-vagrant). We however used our own Folder structure described below.

### Our Vagrant Folder structure

We have created our own directory structure that will allow us to reuse most of the files that were used during installation.

```bash
Vagrant_CoreOS_Docker
│ README.md
│ Vagrantfile
│ install.sh
│
└───docker
├───ghost_demo
│ │ Dockerfile
│ │ start.bash
```

This folder structure shows that we hold the Vagrantfile and install.sh in our root directory. This Vagrantfile will be used when we enter `vagrant up` and will then setup the Virtual Machine with CoreOS. After this is done it will then run install.sh which in turn is going to install the ghost_demo Dockerfile.

The reason we chose for this setup is because this allows a couple of things:

- We can add more projects under the docker folder
- install.sh accepts 2 parameters __DockerfilePath__ and __ImageName__ allowing us to change the Dockerfile that is being installed.

#### Vagrantfile

```ruby
# -*- mode: ruby -*-
# # vi: set ft=ruby :

require 'fileutils'

Vagrant.require_version ">= 1.6.0"

CLOUD_CONFIG_PATH = File.join(File.dirname(__FILE__), "user-data")
CONFIG = File.join(File.dirname(__FILE__), "config.rb")

$update_channel = "alpha"
nodes = [
  {
    :name => 'ghostdemo',
    :config => 'ghostdemo',
    :ip => '172.17.8.2',
    :box => "coreos-%s" % $update_channel,
    :url => "http://%s.release.core-os.net/amd64-usr/current/coreos_production_vagrant.json" % $update_channel,
    :version => ">= 308.0.1",
    :ram => 1024,
    :cpus => 1,
    :gui => false
  }
]
```

# Defaults for config options defined in CONFIG

```ruby
$update_channel = "alpha"
$enable_serial_logging = false

Vagrant.configure("2") do |config|
  nodes.each do |node|
    config.vm.define node[:name] do |node_config|
      nfs_setting = RUBY_PLATFORM =~ /darwin/ || RUBY_PLATFORM =~ /linux/

      # IF NO NFS: node_config.vm.synced_folder "www", "/var/www"
      #node_config.vm.synced_folder "www", "/var/www", :nfs => true, :mount_options => ['nolock,vers=3,udp']
      node_config.vm.synced_folder ".", "/home/core/share", id: "core", :nfs => true, :mount_options => ['nolock,vers=3,udp']

      # Configure Machine details
      node_config.vm.box = node[:box]
      node_config.vm.box_url = node[:url]
      node_config.vm.box_version = node[:version]
      node_config.vm.hostname = node[:name]

      # Private network
      config.ssh.forward_agent = true
      node_config.vm.network :private_network, ip: node[:ip]

      # Forwards ports 60000 - 60010
      (60000..6010).each do |port|
        config.vm.network :forwarded_port, :host => port, :guest => port
      end

      # User data
      if File.exist?(CLOUD_CONFIG_PATH)
        config.vm.provision :file, :source => "#{CLOUD_CONFIG_PATH}", :destination => "/tmp/vagrantfile-user-data"
        config.vm.provision :shell, :inline => "mv /tmp/vagrantfile-user-data /var/lib/coreos-vagrant/", :privileged => true
      end

      config.vm.provider :virtualbox do |v|
        # On VirtualBox, we don't have guest additions or a functional vboxsf
        # in CoreOS, so tell Vagrant that so it can be smarter.
        v.check_guest_additions = false
        v.functional_vboxsf = false
      end

      # plugin conflict
      if Vagrant.has_plugin?("vagrant-vbguest") then
        config.vbguest.auto_update = false
      end

      # Serial logging
      if $enable_serial_logging
        logdir = File.join(File.dirname(__FILE__), "log")
        FileUtils.mkdir_p(logdir)

        serialFile = File.join(logdir, "%s-serial.txt" % vm_name)
        FileUtils.touch(serialFile)

        config.vm.provider :vmware_fusion do |v, override|
        v.vmx["serial0.present"] = "TRUE"
        v.vmx["serial0.fileType"] = "file"
        v.vmx["serial0.fileName"] = serialFile
        v.vmx["serial0.tryNoRxLoss"] = "FALSE"
      end

      config.vm.provider :virtualbox do |vb, override|
        vb.customize ["modifyvm", :id, "--uart1", "0x3F8", "4"]
        vb.customize ["modifyvm", :id, "--uartmode1", serialFile]
      end
    end

    # Forward docker tcp
    if $expose_docker_tcp
      config.vm.network "forwarded_port", guest: 2375, host: ($expose_docker_tcp + i - 1), auto_correct: true
    end

    # Run our ghost container and mount it on port 4000 + sync folders.
    node_config.vm.provision :shell, :inline => "sh /vagrant/install.sh docker/ghost_demo/ ghost_demo 60000:2368"
    end
  end
end
```

#### install.sh

```bash
#!/bin/bash
#============================================================
# FILE: install.sh
# USAGE: ./install.sh sitename
# DESCRIPTION: This script will install the site with the given configuration
#
# OPTIONS: $1 The path to the Dockerfile (Using this project as root)
# OPTIONS: $2 The Imagename for the installed DockerContainer
# OPTIONS: $3 The Ports to be forwarded afterwards
# REQUIREMENTS: /
# AUTHOR: Xavier Geerinck (thebillkidy@gmail.com)
# COMPANY: Feedient
# VERSION: 1.1.0
# CREATED: 18/08/13 20:12:38 CET
# REVISION: ---
#============================================================
# Config parameters
docker_binary=/usr/bin/docker

# Check parameters (We need the dockerpath too install + name for the image)
if [ -z "$1" -o -z "$2" -o -z "$3" ]; then
  echo "Usage: `basename $0` "
  echo "Example: `basename $0` docker/ghost_demo/ ghost_demo"
  echo "Info: The DockerfilePath is the path from this as root to the directory where the Dockerfile is located"

  exit 0
fi

# If chef is not installed then install it
echo "Checking if Docker is installed..."
if ! test -f "$docker_binary"; then
  echo "Downloading and installing docker"

  # Update binaries
  sudo apt-get update

  # Install wget & ca-certificates
  sudo apt-get install -y wget ca-certificates docker.io

  # Link and fix paths
  ln -sf /usr/bin/docker.io /usr/local/bin/docker
  sed -i '$acomplete -F _docker docker' /etc/bash_completion.d/docker.io

  # Start Docker on server boot
  update-rc.d docker.io defaults
else
  echo "Docker is already installed"
fi

echo "Running docker"
cd /home/core/share/$1 && \
echo "Building the docker image from the dockerfile located at: /home/core/share/"$1 && \
docker build -t "$2" . && \
echo "Starting up the docker container: $2" && \
docker run -d -p $3 "ghost_demo"

echo "Done"
exit 0
```

#### Dockerfile

```bash
#
# Ghost Dockerfile
#
# https://github.com/dockerfile/ghost
#

# Pull base image.
FROM dockerfile/nodejs

# Install Ghost
RUN \
cd /tmp && \
wget https://ghost.org/zip/ghost-latest.zip && \
unzip ghost-latest.zip -d /ghost && \
rm -f ghost-latest.zip && \
cd /ghost && \
npm install --production && \
sed 's/127.0.0.1/0.0.0.0/' /ghost/config.example.js > /ghost/config.js && \
useradd ghost --home /ghost

# Add files.
ADD start.bash /ghost-start

# Set environment variables.
ENV NODE_ENV production

# Define mountable directories.
VOLUME ["/data", "/ghost-override"]

# Define working directory.
WORKDIR /ghost

# Define default command.
CMD ["bash", "/ghost-start"]

# Expose ports.
EXPOSE 2368
```

#### start.bash

```bash
#!/bin/bash

GHOST="/ghost"
OVERRIDE="/ghost-override"

CONFIG="config.js"
DATA="content/data"
IMAGES="content/images"
THEMES="content/themes"

cd "$GHOST"

# Symlink data directory.
mkdir -p "$OVERRIDE/$DATA"
rm -fr "$DATA"
ln -s "$OVERRIDE/$DATA" "content"

# Symlink images directory
mkdir -p "$OVERRIDE/$IMAGES"
rm -fr "$IMAGES"
ln -s "$OVERRIDE/$IMAGES" "$IMAGES"

# Symlink config file.
if [[ -f "$OVERRIDE/$CONFIG" ]]; then
  rm -f "$CONFIG"
  ln -s "$OVERRIDE/$CONFIG" "$CONFIG"
fi

# Symlink themes.
if [[ -d "$OVERRIDE/$THEMES" ]]; then
  for theme in $(find "$OVERRIDE/$THEMES" -mindepth 1 -maxdepth 1 -type d -exec basename {} \;)
  do
    rm -fr "$THEMES/$theme"
    ln -s "$OVERRIDE/$THEMES/$theme" "$THEMES/$theme"
  done
fi

# Start Ghost
chown -R ghost:ghost /data /ghost /ghost-override
su ghost << EOF cd "$GHOST" NODE_ENV=${NODE_ENV:-production} npm start EOF 
``` 

### Booting Vagrant 
After you have created your Vagrantfile and the other files. (or used the one of the repository above) you can then start your vagrant machine which will create the VirtualMachine and start it. This can be done by navigating to the directory that holds the Vagrantfile and then entering the command: `vagrant up`. This will now show something as shown below: 

> *__Note:__ This will not work on Windows since NFS is not supported on Windows. We however heard of a workaround called `cygwin rsync` but have not specific details about this.*
>
> *__Note2:__ When you used the repository above you will have a different output then shown below. You also will not have the ghost blog installed automatically.*

```bash
$ vagrant up
Bringing machine 'core-01' up with 'virtualbox' provider...
==> core-01: Box 'coreos-alpha' could not be found. Attempting to find and install...
core-01: Box Provider: virtualbox
core-01: Box Version: >= 308.0.1
==> core-01: Loading metadata for box 'http://alpha.release.core-os.net/amd64-usr/current/coreos_production_vagrant.json'
core-01: URL: http://alpha.release.core-os.net/amd64-usr/current/coreos_production_vagrant.json
==> core-01: Adding box 'coreos-alpha' (v431.0.0) for provider: virtualbox
core-01: Downloading: http://alpha.release.core-os.net/amd64-usr/431.0.0/coreos_production_vagrant.box
core-01: Calculating and comparing box checksum...
==> core-01: Successfully added box 'coreos-alpha' (v431.0.0) for 'virtualbox'!
==> ghostdemo: Importing base box 'coreos-alpha'...
==> ghostdemo: Matching MAC address for NAT networking...
==> ghostdemo: Checking if box 'coreos-alpha' is up to date...
==> ghostdemo: Setting the name of the VM: Vagrant_CoreOS_Docker_ghostdemo_1410250017479_38606
==> ghostdemo: Clearing any previously set network interfaces...
==> ghostdemo: Preparing network interfaces based on configuration...
ghostdemo: Adapter 1: nat
ghostdemo: Adapter 2: hostonly
==> ghostdemo: Forwarding ports...
ghostdemo: 22 => 2222 (adapter 1)
==> ghostdemo: Running 'pre-boot' VM customizations...
==> ghostdemo: Booting VM...
==> ghostdemo: Waiting for machine to boot. This may take a few minutes...
ghostdemo: SSH address: 127.0.0.1:2222
ghostdemo: SSH username: core
ghostdemo: SSH auth method: private key
ghostdemo: Warning: Connection timeout. Retrying...
==> ghostdemo: Machine booted and ready!
==> ghostdemo: Setting hostname...
==> ghostdemo: Configuring and enabling network interfaces...
==> ghostdemo: Exporting NFS shared folders...
==> ghostdemo: Preparing to edit /etc/exports. Administrator privileges will be required...
==> ghostdemo: Mounting NFS shared folders...
==> ghostdemo: Running provisioner: shell...
ghostdemo: Running: inline script
==> ghostdemo: Checking if Docker is installed...
==> ghostdemo: Docker is already installed
==> ghostdemo: Running docker
==> ghostdemo: Building the docker image from the dockerfile located at: /home/core/share/docker/ghost_demo/
==> ghostdemo: Sending build context to Docker daemon 4.608 kB
==> ghostdemo: Sending build context to Docker daemon
==> ghostdemo: Step 0 : FROM dockerfile/nodejs
==> ghostdemo: Pulling repository dockerfile/nodejs
==> ghostdemo: ---> 42558db32e73
==> ghostdemo: Step 1 : RUN cd /tmp && wget https://ghost.org/zip/ghost-latest.zip && unzip ghost-latest.zip -d /ghost && rm -f ghost-latest.zip && cd /ghost && npm install --production && sed 's/127.0.0.1/0.0.0.0/' /ghost/config.example.js > /ghost/config.js && useradd ghost --home /ghost
==> ghostdemo: ---> Running in 8dc4b656ac97
******************************** OUTPUT STRIPPED ********************************
==> ghostdemo: Removing intermediate container 8dc4b656ac97
==> ghostdemo: Step 2 : ADD start.bash /ghost-start
==> ghostdemo: ---> dd80e21aeb25
==> ghostdemo: Removing intermediate container ffc3f4127ca7
==> ghostdemo: Step 3 : ENV NODE_ENV production
==> ghostdemo: ---> Running in 785e2484b64f
==> ghostdemo: ---> 85043cda1ff3
==> ghostdemo: Removing intermediate container 785e2484b64f
==> ghostdemo: Step 4 : VOLUME ["/data", "/ghost-override"]
==> ghostdemo: ---> Running in 64cfe35fda23
==> ghostdemo: ---> fda26d5e7d2c
==> ghostdemo: Removing intermediate container 64cfe35fda23
==> ghostdemo: Step 5 : WORKDIR /ghost
==> ghostdemo: ---> Running in 588c6a347797
==> ghostdemo: ---> 105882ff6ed5
==> ghostdemo: Removing intermediate container 588c6a347797
==> ghostdemo: Step 6 : CMD ["bash", "/ghost-start"]
==> ghostdemo: ---> Running in 31b4e4d77f43
==> ghostdemo: ---> 48cdcfec4b71
==> ghostdemo: Removing intermediate container 31b4e4d77f43
==> ghostdemo: Step 7 : EXPOSE 2368
==> ghostdemo: ---> Running in b0bd604e832f
==> ghostdemo: ---> fd0825542e80
==> ghostdemo: Removing intermediate container b0bd604e832f
==> ghostdemo: Successfully built fd0825542e80
==> ghostdemo: Starting up the docker container: ghost_demo
==> ghostdemo: 6cfa46c230d4ffe2c9edf0aa6b21e1cb151e505fea6e5eab279cbbf9d3d0a6b9
==> ghostdemo: Done
```

After it echoed 'done' you will be able to ssh to the machine by entering the command: `vagrant ssh`. Which will greet you with the home directory and the nice welcoming message.

> *__Note:__ If you have multiple vagrant machines running you need to enter the command `vagrant ssh `. You can view the machines running by entering `vagrant status`.*

```bash
CoreOS (alpha)
core@core-01 ~ $
```

You will also be able to go to your newly created Ghost blog by navigating too: `172.17.8.2:60000`

## Conclusion

Setting up Vagrant, CoreOS and Docker is a lot of initial work that has to be done by the System Admin. However once it has been done you can store it on a central Git repository, allowing every other developer to set up it's development environment in less then 20 minutes.
