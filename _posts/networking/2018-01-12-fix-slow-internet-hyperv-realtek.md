---
layout: post
current: post
cover:  assets/images/covers/network.jpg
navigation: True
title: How-To Fix slow internet speed on a Realtek adapter with Hyper-V machines
date: 2018-01-12 20:13:00
tags: howto tutorials
class: post-template
subclass: 'post tag-howto tag-tutorials'
author: xavier
---

When working with the awesome Visual Studio Android Emulator, I encountered the following error:

**Issue:** Internet speed gets divided by a factor of 10x when creating a Hyper-V machine that uses a vSwitch bound on the main Network Interface (nic).

**Solution:**

Open adapter settings -> Right click towards properties -> Configure your network adapter

Now disable the following settings:

* IPv4 checksum offload
* Large Send Offload (IPv4)
* TDP Checksum Offload IPv4
* UDP Checksum Offload IPv4

After disabling these settings my internet speed went back to its original speed :) hope this helped!

> Note: For people with a Broadcom adapter, I recommend looking after disabling VMQ (Virtual Machines Queue) which seems to be an issue as well
