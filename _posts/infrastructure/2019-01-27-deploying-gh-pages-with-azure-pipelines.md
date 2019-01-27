---
layout: post
current: post
cover:  assets/images/covers/experience.jpg
navigation: True
title: Continuous Integration for Github Pages with Jekyll in the same repository
date: 2019-01-27 07:00:00
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

## Setting up our Pipeline

Just as in Travis, we are able to generate a `YAML` file in our code repository, that will be picked up by `Azure Devops`. So get started by creating a `azure-pipelines.yml` file in your root folder.

For our `Github Pages` we want to achieve that whenever we push to `development` that everything is build and the built source is pushed to `master`. This is a quite anti-pattern kind of process, seeing that most of the time we would build to an `artifact` and release this artifact to the world. For easiness we however want to do this, to keep our set of tools as minimal as possible.

> **Note:** This build is an anti-pattern because of described above!

To achieve this, we can use the following steps:

1. On push to `development` branch, trigger the process
2. Pull our code (`git clone`) from the development branch
3. Build our Jekyll site to a destination folder (`jekyll build -d <DESTINATION>`). We can see this as our artifact if we zip it!
4. Create a branch based of `master` (important!) which contained our previous build site
5. Clean the master branch from all files and copy over our artifact files
6. Add our changes and commit
7. Push to remote

In Azure Pipelines this can be achieved through `steps` which describes our steps above in a `YAML` kind of structure. So let's get started by creating our different steps.

### Step 1:Trigger on-push to Development Branch

Describing to trigger on push is just 2 lines of code:

```yaml
trigger:
- development
```

### Step 2: Pull our Code

Luckily our code pulling is done automatically, due to the integration with GitHub. We however do have to add our credentials again, since they are removed by default. This way we can push! To do this, add the following:

```yaml
# https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azdevops&tabs=schema#checkout
- checkout: self
  persistCredentials: true # set to 'true' to leave the OAuth token in the Git config after the initial fetch
```

### Step 3: Build our Jekyll Website

Let's start by writing our steps that we want to execute when we have our code. For this, we need to know that everything we do is described as a `task` under `steps`. Looking like this:

```yaml
steps:
- task: 
```

Doing this now for our Jekyll build, we will configure it to use ruby, install our dependencies and build our Jekyll website!

```yaml
steps:
- task: UseRubyVersion@0 # See: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/tool/use-ruby-version?view=azdevops
  displayName: 'Use Ruby >= 2.5'

- script: 'gem install bundler'
  displayName: 'Install Bundler'

- script: 'bundle install'
  displayName: 'Install Jekyll and Dependencies'

- script: 'bundle exec jekyll build -d $(Build.ArtifactStagingDirectory)'
  displayName: 'Build Jekyll Static Site'
```

### Step 4 - 7: Push our build website to the master branch

Building our website is the most complex part, for steps 4 - 7 we get:

```yaml
- script: 'cd $(Build.Repository.LocalPath); git checkout master; git checkout -b azure-pipelines-build'
  displayName: 'Create Build Branch based on Master'

- script: >
    cd $(Build.Repository.LocalPath);
    git rm -rf .; git clean -fxd;
    touch .nojekyll;
    touch README.md;
    echo "# My Blog" >> README.md;
  displayName: 'Clean Build Branch'

- script: >
    git config --global user.email "xavier.geerinck@gmail.com";
    git config --global user.name "Xavier Geerinck";
  displayName: 'Configure Git User'

- script: 'cp -a $(Build.ArtifactStagingDirectory)/. $(Build.Repository.LocalPath)'
  displayName: 'Copy Artifact Files to Cleaned Build Branch'

- script: >
    cd $(Build.Repository.LocalPath);
    git add --all;
    git commit -m"Pipelines-Bot: Updated site via $(Build.SourceVersion)";
  displayName: 'Create our Commit'

- script: >
    cd $(Build.Repository.LocalPath);
    git checkout master;
    git merge azure-pipelines-build;
    git branch -d azure-pipelines-build;
  displayName: 'Merge azure-pipelines-build into master'

- script: >
    cd $(Build.Repository.LocalPath);
    git push origin master;
  displayName: 'Push changes to remote'
```

### Final Review of our YAML file

If we correctly followed everything described above, we get the following:

```yaml
trigger:
- development

pool:
  vmImage: 'Ubuntu-16.04'

steps:
# https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azdevops&tabs=schema#checkout
- checkout: self
  persistCredentials: true # set to 'true' to leave the OAuth token in the Git config after the initial fetch

- task: UseRubyVersion@0 # See: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/tool/use-ruby-version?view=azdevops
  displayName: 'Use Ruby >= 2.5'

- script: 'gem install bundler'
  displayName: 'Install Bundler'

- script: 'bundle install'
  displayName: 'Install Jekyll and Dependencies'

- script: 'bundle exec jekyll build -d $(Build.ArtifactStagingDirectory)'
  displayName: 'Build Jekyll Static Site'

- script: 'cd $(Build.Repository.LocalPath); git checkout master; git checkout -b azure-pipelines-build'
  displayName: 'Create Build Branch based on Master'

- script: >
    cd $(Build.Repository.LocalPath);
    git rm -rf .; git clean -fxd;
    touch .nojekyll;
    touch README.md;
    echo "# My Blog" >> README.md;
  displayName: 'Clean Build Branch'

- script: >
    git config --global user.email "xavier.geerinck@gmail.com";
    git config --global user.name "Xavier Geerinck";
  displayName: 'Configure Git User'

- script: 'cp -a $(Build.ArtifactStagingDirectory)/. $(Build.Repository.LocalPath)'
  displayName: 'Copy Artifact Files to Cleaned Build Branch'

- script: >
    cd $(Build.Repository.LocalPath);
    git add --all;
    git commit -m"Pipelines-Bot: Updated site via $(Build.SourceVersion)";
  displayName: 'Create our Commit'

- script: >
    cd $(Build.Repository.LocalPath);
    git checkout master;
    git merge azure-pipelines-build;
    git branch -d azure-pipelines-build;
  displayName: 'Merge azure-pipelines-build into master'

- script: >
    cd $(Build.Repository.LocalPath);
    git push origin master;
  displayName: 'Push changes to remote'

# The below will generate a .zip for us that we can download
# - task: PublishBuildArtifacts@1
#   displayName: 'Publish Artifact: _site'
#   inputs:
#     ArtifactName: _site
```

## Conclusion

When comparing my new Azure Devops Pipelines to the old Travis Job, I am able to say that Azure Devops Pipelines allows me to more fine grained configure my tasks as well as deploy, really showing how strong this product is for the enterprise market.

Another noticable thing is the performance. When deploying with Travis, my builds often took between 2 - 3minutes, while with Azure Devops Pipelines this takes around 1m 40s