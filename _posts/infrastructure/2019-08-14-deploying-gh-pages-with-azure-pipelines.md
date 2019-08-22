---
layout: post
current: post
cover:  assets/images/covers/experience.jpg
navigation: True
title: Build your Jekyll site and Deploy it on GitHub Pages with an Azure DevOps pipeline
date: 2019-08-14 09:00:00
tags: infrastructure devops
class: post-template
subclass: 'post'
author: xavier
---

So far I have been using Travis-CI as my Continuous Integration (CI) system for my build and release process for my Blog. However recently, VSTS got rebranded to Azure Pipelines, and I felt everything got mature enough to finally migrate to Azure Pipelines. To my surprise this turned out to be super easy! Let's see how it can be done!

What do we want to achieve? Well we want to achieve a continuous flow of development, where when we develop a piece of code, the following steps are followed (as illustrated below):

1. **SCM:** Use our SCM protocol to push our code
2. **PULL CODE:** Our source control repository, triggers an event 
3. **BUILD:** This trigger gets detected by our Pipeline process which builds our code
4. **TEST:** The Build gets tested
5. **FAIL/SUCCESS:** This results in a failure or success
6. **RELEASE:** On success we release our code to the world

![/assets/images/posts/CI/ci-pipeline.png](/assets/images/posts/CI/ci-pipeline.png)

## Pipeline Definition

Translating this continuous flow of development to our own project, what we want to do is that as soon as a commit is pushed on to the `development` branch (which contains our `.md` blog files), we want to trigger a build that is going to transform these to `.html` files and push those onto the `master` branch. Writing this out in steps would look like:

1. Trigger: On push to `development` branch
2. Setup our git repository
3. Build our Jekyll site to `/tmp` through `jekyll build -d /tmp`
4. Copy over everything from `/tmp` to our working folder (replacing everything except the `.git/` folder)
5. Create a commit and push it to remote

## Pipeline Coding

To code this actual pipeline utilizing `Azure DevOps`, we can utilize a `azure-pipelines.yml` file that we place in the root of our repository. We can now describe what should happens using the `steps:` in this files, let's do this in phases:

### Step 1: Trigger on-push to Development Branch

Describing to trigger on push is just 2 lines of code:

```yaml
trigger:
- development
```

### Step 2: Set pool & global variables 

Since GitHub wants us to utilize a PAT token to be able to trigger a page build, we will need to add this to our environment variables (as a secret! - see [https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#secret-variables) for more information).

We can also define a pool (execution environment) that our code will run on.

```yaml
pool:
  vmImage: 'Ubuntu-16.04'

# Note: github_pat should be configured as an environment variable in devops
#   -> create github pat here: https://github.com/settings/tokens
#   -> Create environment variable in dev.azure.com under pipelines -> edit (right top) -> variables (right top triple dots) -> called github_pat -> click the lock
variables:
  gh_user: thebillkidy
  gh_repo: thebillkidy.github.io
  gh_pass: $(github_pat)
  gh_email: xavier.geerinck@gmail.com
  gh_auth_header: $(echo -n "${gh_user}:$(github_pat)" | base64);
```

### Step 3: Pull our Code

Since we set up the PAT token and other variables, we can now start cloning our directory. Let's define the steps for this

> **Note:** We clone our directory rather than using the `checkout` function due to the PAT token being required for a page build (see previous step).

```yaml
steps:
# https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azdevops&tabs=schema#checkout
- checkout: none # we are not going to sync sources, we will manually clone
  persistCredentials: false # We disallow setting the persisting, since we want to have a verified push which requires a PAT token

# 1. Setup our local repository and branch that we can work on
- script: git clone https://$(github_pat)@github.com/$(gh_user)/$(gh_repo).git .
  workingDirectory: $(Build.StagingDirectory)
  displayName: "[Git] Clone GitHub Pages Repository"

- script: |
    git config user.email $(gh_email)
    git config user.name $(gh_user)
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Git] Configure User'

- script: 'git checkout development'
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Git] Set development branch'
```

### Step 4: Build our Jekyll Website

We can now build our Jekyll website, to do this we will utilize a `/tmp/source` and `/tmp/build` directory to be able to generate clean `.html` diffs in our commit messages on master. 

```yaml
# 2. Configure Ruby
- task: UseRubyVersion@0 # See: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/tool/use-ruby-version?view=azdevops
  displayName: '[Ruby] Use Ruby >= 2.5'

# 3. Build Site - We only want a HTML diff on master, so we follow this process
#      1. Copy files from development branch to /tmp/source
#      2. Build Jekyll on /tmp/source to /tmp/build
#      3. Remove all files in $(Build.StagingDirectory) except .git/
#      4. Copy everything from /tmp/build to $(Build.StagingDirectory)/
#      5. Create the commit and push it
- script: 'git checkout development'
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Git] Switch to development branch for $(Build.StagingDirectory)'

- script: 'mkdir /tmp/source; cp -R * /tmp/source; rm -rf /tmp/source/.git'
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Script] Copy file from development branch to /tmp/source'

- script: 'git checkout master'
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Git] Switch to master branch for $(Build.StagingDirectory)'

- script: 'gem install bundler'
  workingDirectory: /tmp/source
  displayName: '[Jekyll] Install Bundler'

- script: |
    ls -la;
    bundle install
  workingDirectory: /tmp/source
  displayName: '[Jekyll] Install Jekyll and Dependencies'

- script: |
    mkdir /tmp/build;
    bundle exec jekyll build -d /tmp/build;
  workingDirectory: /tmp/source
  displayName: '[Jekyll] Build Jekyll Static Site from /tmp/source to /tmp/build'

- script: |
    cp -R $(Build.StagingDirectory)/.git /tmp/build;
    rm -rf $(Build.StagingDirectory)/*;
    cp -R /tmp/build/* $(Build.StagingDirectory);
  workingDirectory: /tmp/build
  displayName: '[Script] Remove all files in $(Build.StagingDirectory) except .git/ and add files from /tmp/build'
```

### Step 5: Push our changes

Last but not least is the easiest part, pushing it all to master:

```yaml
# 3. Create our commit, merge into master, delete draft branch and push it
- script: |
    git add --all;
    git commit -m"Pipelines-Bot: Updated site via $(Build.SourceVersion)";
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Git] Creating commit'

- script: |
    git push origin master;
  workingDirectory: $(Build.StagingDirectory)
  displayName: '[Git] Push changes to remote'
```

### Step 6: Checking Pages Build 

As an extra, we would like to utilize the PAT token to check our pages build and see if it was successful. For that we can utilize the following in our pipeline:

```yaml
- script: |
    curl https://api.github.com/repos/$(gh_user)/$(gh_repo)/pages/builds/latest -i -v \
    -X GET \
    -H "Accept: application/vnd.github.mister-fantastic-preview+json" \
    -H "Authorization: Basic $(gh_auth_header)"
  displayName: '[GitHub] Get Page Build Status'
```

## Conclusion

When comparing my new Azure DevOps Pipelines to the old Travis Job, I am able to say that Azure DevOps Pipelines allows me to more fine grained configure my tasks as well as deploy, really showing how strong this product is for the enterprise market.

Another noticeable thing is the performance. When deploying with Travis, my builds often took between 2 - 3 minutes, while with Azure DevOps Pipelines this takes around 1m 40s

If you're interested in the full source code, feel free to check this at: [https://github.com/thebillkidy/thebillkidy.github.io/blob/development/azure-pipelines.yml](https://github.com/thebillkidy/thebillkidy.github.io/blob/development/azure-pipelines.yml) which is this code being used for my own personal blog ;)