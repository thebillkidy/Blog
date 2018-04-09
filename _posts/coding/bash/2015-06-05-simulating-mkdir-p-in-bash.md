---
layout: post
current: post
cover: 'assets/images/covers/coding.jpg'
navigation: True
title: Simulating mkdir -p in bash
date: 2015-06-05 18:41:00
tags: bash
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

When we are working with systems that do not support special cases then we need to simulate. That is why it is handy to create different simulations of already existing solutions.

In this case we will create a solution that is going to replicate the mkdir -p command in bash.

The code for this is pretty straightforward:

```bash
# Simulate mkdir -p
ABSOLUTE_PATH=0

if [[ ${1:0:1} == "/" ]];
then
  ABSOLUTE_PATH=1
fi

echo "Path: ${ABSOLUTE_PATH}"

# If absolute, cd to /
if [[ $ABSOLUTE_PATH == 1 ]];
then
  cd /
fi

# Start processing the path creation
IFS='/' read -ra dir <<< $1
for i in "${dir[@]}"; do
  # If empty, skip
  if [[ $i == "" ]];
  then
    continue
  fi

  # Determine if dir exists, if not create it
  if [[ ! -d $i ]];
  then
    mkdir "$i"
  fi

  # Descend into the new dir
  cd "$i"
done
```

We can now call this program by executing:

```bash
./program relativepath/1/2/3/4
./program /absolutepath/1/2/3/4
```
