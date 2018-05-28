---
layout: post
current: post
cover: 'assets/images/covers/azure-functions.png'
navigation: True
title: Getting started with Azure Functions
date: 2018-05-28 09:00:00
tags: tutorials howto javascript
class: post-template
subclass: 'post'
author: xavier
---

So I wanted to write a function for a customer that would trigger a bot. What I thought would be an easy process, turned out to be a lot of debugging and tuning to get everything working. Which is why I decided to write this post to help others get started with Azure Functions.

Let's get started, start by creating your Function application and open the dashboard on your newly created function.

![/assets/images/posts/getting-started-functions-1.png](/assets/images/posts/getting-started-functions-1.png)

At your left you will see your function app account (in my case interoperabilitybot) and then a dropdown with "Functions". This contains all your functions, so click on the one you created by default (or create one by clicking the + button when you hover over Functions). This will bring you to the following screen.

![/assets/images/posts/getting-started-functions-2.png](/assets/images/posts/getting-started-functions-2.png)

You can now click the "View files" tab on the right to view your files belonging to your Function app. Here I had to go to the `function.json` file to correct the default settings that were created for me.

![/assets/images/posts/getting-started-functions-3.png](/assets/images/posts/getting-started-functions-3.png)

After removing the `_originalEntryPoint`, `_originalScriptFile`, `scriptFile`, `entryPoint` entries, I then got the following configuration:

![/assets/images/posts/getting-started-functions-4.png](/assets/images/posts/getting-started-functions-4.png)

> **Note:** Not everyone will have these entries, if you do not have them, then you can just continue :)

Now you can upload all your files through the "View files" tab and clicking the "Add" button.

> **Note:** You can create folders by adding the suffix "/". Example: `<myFolder>/`

Once you did that and added your `package.json` file, we now have to install our dependencies. To do this, we need to open our **Kudu Dashboard** by going to [https://\<your_function_app_name\>.scm.azurewebsites.net](https://\<your_function_app_name\>.scm.azurewebsites.net).

![/assets/images/posts/getting-started-functions-5.png](/assets/images/posts/getting-started-functions-5.png)

Here you can click the "Debug console" dropdown and select "PowerShell" (or CMD if you prefer that).

Now navigate to your function app by using `ls` and `cd` (in my case I had a function called messages, so I had to navigate to: `D:\home\site\wwwroot\messages`) where you then can run the command `npm install`

![/assets/images/posts/getting-started-functions-6.png](/assets/images/posts/getting-started-functions-6.png)

Now restart your function app by going back to the main page and clicking "Restart", and go back to your function and click "Run".

![/assets/images/posts/getting-started-functions-7.png](/assets/images/posts/getting-started-functions-7.png)

![/assets/images/posts/getting-started-functions-8.png](/assets/images/posts/getting-started-functions-8.png)

## Upgrading Node.js Version

After that I deployed my function correctly, it appeared that some functionallity such as await/async was not supported. When going to my Kudu dashboard and entering `node --version` it appeared that my node version was showing `v6.9.1`.

![/assets/images/posts/getting-started-functions-9.png](/assets/images/posts/getting-started-functions-9.png)

To change this, head back to your functions dashboard but this time click on "Platform features"

![/assets/images/posts/getting-started-functions-10.png](/assets/images/posts/getting-started-functions-10.png)

And go to "Application settings"

![/assets/images/posts/getting-started-functions-11.png](/assets/images/posts/getting-started-functions-11.png)

Scroll down a bit here until you find the `WEBSITE_NODE_DEFAULT_VERSION` string with the version next to it. Change this to the version you would like (safest is to pick the LTS version).

![/assets/images/posts/getting-started-functions-12.png](/assets/images/posts/getting-started-functions-12.png)

After that click "Save" on the top of that page to save your settings.

![/assets/images/posts/getting-started-functions-13.png](/assets/images/posts/getting-started-functions-13.png)

Now restart your function app as you did before.

## Getting async/await support to work

Async/await is currently only supported in Node >= 8.5.5, which means we have to set the correct node version for this to work. Once we did this we also have to execute the following actions:

* In Kudu: `npm i -g azure-functions-core-tools@core`
* Recreate our function in runtime 2