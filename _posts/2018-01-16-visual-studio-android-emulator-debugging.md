---
layout: post
current: post
cover:  assets/images/waves.jpg
navigation: True
title: Visual Studio Android Emulator Debugging
date: 2018-01-13 09:00:00
tags: howto, tutorials
class: post-template
subclass: 'post tag-howto tag-tutorials'
author: xavier
---

So you decided to get into Mobile development? Well your best bet on windows currently is the **Visual Studio Emulator for Android Apps** by Microsoft (https://www.visualstudio.com/vs/msft-android-emulator/). But you may run into some trouble when using it. This blog post consists out of the most commonly encountered problems with the Visual Studio Emulator for Android Apps, and how you could solve them.

**When running it just closes and gives: Could not connect to the debugger**

* in Hyper-V settings make sure Migrate to a physical computer with a different processor version. is enabled
* In your Android project, uncheck Fast Deploy

**Emulator is stuck on OS Is Starting**

* It's prone to crashing, just go to `C:\Program Files (x86)\Microsoft XDE\<version_number>\` and run `XDECleanup.exe`, wait till it is done and try again

**Emulator shows: Couldn't auto-detect the guest system IP address**

* It's prone to crashing, just go to `C:\Program Files (x86)\Microsoft XDE\<version_number>\` and run `XDECleanup.exe`, wait till it is done and try again

**I have no internet on the Emulator**

* This is a Virtual Switch error, to solve this make sure you delete your old Virtual Switches by deleting them in the Device Manager and in the Hyper-V Virtual Switch Manager
* Then Try to recreate your VM and look in your Hyper-V settings if it has 2 interfaces (one for the W Phone and one for the External Internet)
* If it doesn't have the second one, create it manually and add it

**My internet speed drops after creating the Hyper-V emulator**

* Known problem, check my other blog post: https://xaviergeerinck.com/fix-slow-internet-speed-realtek-adapter-hyper-v-machines/

