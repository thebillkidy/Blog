---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Depth First Search (DFS)
date: 2015-06-05 13:00:07
tags: algorithms coding-cpp
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

Depth-First search and Breadth-First search are search algorithms that help us traversing trees and graphs. We can use these algorithms to solve complex problems such as [maze solving](http://desple.com/post/118014845597/solving-a-maze-with-perl), maze generation, ...

Here I will explain how both these algorithms work and how their pseudocode works for the tree version and the graph version.

Note that all the implementations are based on C++ but have pieces that are pseudocode. These pieces are the ones that have to be filled in when programming these algorithms.

## Depth First Search (DFS)

### Trees

#### Method

1. Start from the root node
2. Visit the children of the root node
3. Now visit the children of these children
4. Repeat 2 for the child node.

#### Implementation

```cpp
void DFS(node root_node) {
  if (root_node.right) {
    DFS(root_node.right);
  }

  if (root_node.left) {
    DFS(root_node.left);
  }

  // Do something with the key of the node
}
```

### Graphs

#### Method

1. Mark every node as unvisited
2. Pick a random node and get it's neighbours
3. For every unvisited neighbour repeat step 2
4. Do this till we visited them all

#### Implementation

```cpp
void DFS(int amount_of_nodes) {
  // Set all nodes as undiscovered
  vector discovered(amount_of_nodes, false);

  // Go through every node
  for (int i = 0; i < amount_of_nodes; i++) {
    if (!discovered[i]) {
      DFS_process_node(discovered, i);
    }
  }
}

void DFS_process_node(vector &discovered, int node) {
  // Set node as discovered
  discovered[node] = true;

  // Now go through it's neighbours
  for (neighbour i in neighbours of node) {
    if (!discovered[i]) {
      DFS_process_node(discovered, i);
    }
  }
}
```