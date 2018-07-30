---
layout: post
current: post
cover: 'assets/images/covers/active-directory.jpg'
navigation: True
title: How to get and update your profile picture in Active Directory (AD)
date: 2018-07-30 09:00:00
tags: systems windows
class: post-template
subclass: 'post tag-systems tag-windows'
author: xavier
---

Updating your Profile Picture in Active Directory is often an annoying process with not enough tools available (or working) to do so. Luckily there are some handy powershell commands that we can use to update this quickly.

## Requirements

First we need to enable the command that we want to use:

1. Download Remote Server Administration Tools for your OS version (in my case Windows 10 - https://www.microsoft.com/en-us/download/details.aspx?id=45520)
2. Open an elevated PowerShell (ignore the warning) and run: `import-module ActiveDirectory`

## Interesting commands

**Get Full User Details**

```bash
Get-ADUser -Credential "<your_username>" -Server "<your_server>" -f {GivenName -eq 'Xavier' -and Surname -eq 'Geerinck'} -Properties * | Select *
```

> Note: Instead of specifying the GivenName and Surname through the filter (-f) you can also just add your <your_username> to achieve the same effect

**Save User Photo**

```bash
Get-ADUser -Credential "<your_username>" -Server "<your_server>" -f {GivenName -eq 'Xavier' -and Surname -eq 'Geerinck'} -Properties *

$userProperties.thumbnailPhoto | Set-Content "C:\ProfilePicture.jpg" -Encoding byte
```

**Update User Photo**

```bash
Get-ADUser -Credential "<your_username>" -Server "<your_server>" <your_username> -Replace @{thumbnailPhoto=([byte[]](Get-Content "C:\ProfilePicture.jpg" -Encoding byte))}
```