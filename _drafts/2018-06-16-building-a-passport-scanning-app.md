---
layout: post
current: post
cover: 'assets/images/covers/dotnet.jpg'
navigation: True
title: Building a Passport Scanning app in Xamarin Forms v3.0
date: 2018-06-16 09:00:00
tags: dotnet
class: post-template
subclass: 'post tag-coding'
author: xavier
---

After a customer visit, I learned that an international passport includes an NFC chip that can be read by anyone, together with the decoding key on the paper. As we tackled how to set up a Xamarin.Forms application, we will continue building on this from scratch. So make sure to have the base project as explained in: [/getting-started-with-xamarin-forms](/getting-started-with-xamarin-forms) set-up and ready to go.

## Steps
Install NFC Forms solution wide

Follow docs of NFC FOrms and add it

Add android permission

Add custom code

## FAQ
Couldn't connect to logcat, GetProcessId returned: 0 
--> Remove app on phone, clean and rebuild
--> https://github.com/xamarin/xamarin-android/issues/1677
--> If again, go to android settings -> Uncheck Use Shared Runtime and Use Fast Deployment