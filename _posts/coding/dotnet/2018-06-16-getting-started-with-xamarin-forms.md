---
layout: post
current: post
cover: 'assets/images/covers/dotnet.jpg'
navigation: True
title: Getting started with Xamarin Forms v3.0
date: 2018-06-16 09:00:00
tags: coding coding-dotnet
class: post-template
subclass: 'post tag-coding'
author: xavier
---

Xamarin Forms has been updated to Version 3 on the 7th of May. If you are not aware of Xamarin.Forms, it is a cross-platform mobile development technology allowing you to write code once and run it on both Android and iOS.

More information about this release can be found here: [https://blog.xamarin.com/xamarin-forms-3-0-released/](https://blog.xamarin.com/xamarin-forms-3-0-released/)

But how do we create a Xamarin Forms project? Well we need just one pre-requisite: `Visual Studio 2017` and the steps below.

## Getting Xamarin Forms Ready

To get started with our Xamarin Forms project, open Visual Studio 2017 and create a new Cross-Project App project (under Visual C# -> Cross-Platform -> Cross-Platform App (Xamarin.Forms)).

![/assets/images/posts/xamarin-forms/passport-nfc/1.png](/assets/images/posts/xamarin-forms/passport-nfc/1.png)

Now first update this to the latest Xamarin Forms (v3.0.0.561731 while writing this post) by right clicking on your solution and going to "Manage NuGet Packages for Solution", selecting this version, checking the checkbox next to "Project" and then clicking "Install".

Afterwards, "Clean & Rebuild" your solution.

![/assets/images/posts/xamarin-forms/passport-nfc/4.png](/assets/images/posts/xamarin-forms/passport-nfc/4.png)

Once the base project is set-up, go to the Android SDK Manager to install the correct manager for your Phone. Since I have 8.1 - Oreo, I installed Android SDK Platform 27.

![/assets/images/posts/xamarin-forms/passport-nfc/2.png](/assets/images/posts/xamarin-forms/passport-nfc/2.png)

Because of using 8.1 and `Xamarin.Forms.Platform.dll (vv8.0)`, I had to change the `TargetFrameworkVersion` to Android8.1 (Oreo) through the settings page of the Android Application.

![/assets/images/posts/xamarin-forms/passport-nfc/3.png](/assets/images/posts/xamarin-forms/passport-nfc/3.png)

> Note: make sure to update all project dependencies / visual studio to avoid problems. Find this in the menu under: `Tools > Options > Xamarin > Other` and click `Check now`

As a last step, make sure that the `TargetFrameworkVersion` to `v8.1` by manually changing it. For this open your `YourProjectName.Android.csproj` file and modify the line as shown below.

![/assets/images/posts/xamarin-forms/passport-nfc/5.png](/assets/images/posts/xamarin-forms/passport-nfc/5.png)

Now you should be able to build and run your project on your phone.

> Note: If you can not see your device in Visual Studio, make sure that developer options is enabled. More info here: [https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/set-up-device-for-development](https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/set-up-device-for-development)
