---
layout: post
current: post
cover: 'assets/images/covers/databricks.png'
navigation: True
title: Using secrets to hide passwords and other confidential information in Databricks
date: 2019-01-10 09:00:00
tags: databricks
class: post-template
subclass: 'post'
author: xavier
---

A common something that you want to do in Databricks is hide your passwords and other confidential information in it, because else it will all be visible within your notebooks and logs.

## Installing Databricks CLI

Luckily Databricks allows us just this. But before we can get started, we first have to configure our CLI tool of Databricks. For my example, I have decided to work with **token authentication** seeing that I login through AAD.

To configure a Token for your Databricks account, login to the portal and go to: User Settings -> Access Token -> Generate New Token and fill in a comment and a lifetime. (Note: you can leave lifetime empty, making a token for indefinite use).

![/assets/images/posts/databricks-secrets/creating-user-token.png](/assets/images/posts/databricks-secrets/creating-user-token.png)

![/assets/images/posts/databricks-secrets/creating-user-token-generated.png](/assets/images/posts/databricks-secrets/creating-user-token-generated.png)

We can now start installing our CLI and configure our account in it by using the token.

```bash
# Install the Databricks CLI
sudo pip install databricks-cli
databricks configure --token # Log in on our Databricks account with a token

# --- Details ---
# Host: <YOUR_HOST> # For Azure this could be: https://<REGION>.azuredatabricks.net e.g. https://westeurope.azuredatabricks.net
# Token: <TOKEN> # Our generated token in User Settings -> Access Token -> Generate New Token (Name = Databricks-CLI)
```

## Creating a secret

Once we did that, we can actually start creating a secret. Open up your favorite terminal and run the following commands:

```bash
# Create our secret in a new scope
databricks secrets create-scope --scope <SECRET_SCOPE>
databricks secrets put --scope XAVIER --key <KEY_NAME> # Save the secret
# -> Input Password in the editor that opens and close it

# Show our scopes
databricks secrets list --scope <SECRET_SCOPE> # Shows Scopes
dbutils.secrets.get("<SECRET_SCOPE>", "<KEY_NAME>")
```

Congratulations! Your first secret has been created and can now be utilized in your notebooks with the `dbutils` command:

```java
String password = dbutils.secrets.get("<SECRET_SCOPE>", "<KEY_NAME>") 
```

## References

* [https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html)

* [https://docs.azuredatabricks.net/user-guide/secrets/secret-scopes.html](https://docs.azuredatabricks.net/user-guide/secrets/secret-scopes.html)
* [https://docs.databricks.com/user-guide/secrets/secrets.html#create-a-secret](https://docs.databricks.com/user-guide/secrets/secrets.html#create-a-secret)