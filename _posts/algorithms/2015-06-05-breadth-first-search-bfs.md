---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Breadth First Search (BFS)
date: 2015-06-05 13:00:06
tags: algorithms
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

Depth-First search and Breadth-First search are search algorithms that help us traversing trees and graphs. We can use these algorithms to solve complex problems such as [maze solving](http://desple.com/post/118014845597/solving-a-maze-with-perl), maze generation, ...

Here I will explain how both these algorithms work and how their pseudocode works for the tree version and the graph version.

Note that all the implementations are based on C++ but have pieces that are pseudocode. These pieces are the ones that have to be filled in when programming these algorithms.

## Breadth-First Search (BFS)

If we want to implement Breadth-First search, then we should think of looping through a tree in level order. We will first process the children of the root, then the children of the children and so on. (So from the top, downwards from left to right).

### Trees

#### Method

1. Push the root node on a queue
2. While the queue is not empty:
1. Pop the top of the queue
2. Put the elements from the popped node in a queue

#### Implementation

```cpp
void BFS(node root_node) {
  queue q;

  q.push_back(root_node);

  while (!q.empty()) {
    node = q.front();
    q.pop_front();

    if (node.left) {
      q.push_back(node.left);
    }

    if (node.right) {
      q.push_back(node.right);
    }

    // Do something with the key
  }
}
```

### Graphs

#### Method

We do the same as with a tree, but here we also keep an array of the visited nodes. We also make sure that the node is not visited.

#### Implementation

```cpp
void BFS(int start_node, int amount_of_nodes) {
  // First create the node visited vector
  vector discovered(amount_of_nodes, false);

  // Create the queue and push the first node on it
  queue q;
  discovered[s] = true;
  q.push_back(s);

  // While the queue is not empty, keep adding the other nodes
  while (!q.empty()) {
    s = q.front(); // new start node
    q.pop_front();

    for (neighbour i in neighbours of node s) {
      if (!discovered[i]) {
        discovered[i] = true;
        q.push_back(i);
      }
    }
  }
}
```
