---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Floyd Warshall Algorithm
date: 2015-06-05 13:00:08
tags: algorithms
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

## Introduction

The Floyd-Warshall algorithm is an algorithm used for finding the shortest paths in a weighted graph (just as Prim's Algorithm is one).

The algorithm works by starting from a graph matrix (n x m size) and then iterating for every row and column pair in this graph. For every iteration we will copy over the values from the current row and column pair. As a last step we now have to check every unfilled cell for some conditions:

* Is it in a infinite row or column (from the copied row and column pair)? --> Yes? then copy the old value
* Else compute the sum of the row and column headings.
* If the computed sum is smaller than the previous value, replace it.

## Pseudocode

In pseudocode this becomes:

1. For every row and cell pair:
1. Copy over the row and column of the current iteration
2. For every cell check the following:
* If current row or column iteration is infinity, copy the value (expect if it the cell is a negative value!)
* Else compute sum of row and column iteration value, if < old value replace old value.

Let's formulate this as a pseudocode that lies close to the coding languages:

```c
for k=0; k<n; k++ // For every iteration (an iteration is a row/col pair)
  for i=0; i<n; i++ // For every cell
    for j=0; j<n; j++ // for every cell part 2 // If current value > new value, replace
      if graph[i][j] > graph[i][k] + graph[k][j]
        graph[i][j] = graph[i][k] + graph[k][j]
      end if
```

## Example

Let's explain this with an example. Let's say we have the following graph:

![Floyd-Warshall](https://lh3.googleusercontent.com/tcxXn0qBwFLyuD5xeHFtkVwlDvIOU-sWPfFNbypJpAcVs9M_RvaOgTvMe_GKkVGvUOdoCKUxwJzqm44=w1896-h865)

When we now compute the graph it's matrix we get this table:

|-|**1**|**2**|**3**|**4**|
|:-:|:-:|:-:|:-:|:-:|
|**1**|0|8|∞|1|
|**2**|∞|0|1|∞|
|**3**|4|∞|0|∞|
|**4**|∞|2|9|0|

Now we start iterating as explained above. (The italic numbers are the values that were copied over).

**Iteration:** 1
Here we just have to compute the values in the cells: (2, 3) and (4, 3)

|-|**1**|**2**|**3**|**4**|
|:-:|:-:|:-:|:-:|:-:|
|**1**|*0*|*8*|*∞*|*1*|
|**2**|*∞*|0|1|∞|
|**3**|*4*|12|0|5|
|**4**|*∞*|2|9|0|

**Iteration:** 2

Here we computer the cells in the column 3 (expect the copied over cell of course). These became 9, 0 (same as before, smallest number that we have) and 3 (3 < 9)

|-|**1**|**2**|**3**|**4**|
|:-:|:-:|:-:|:-:|:-:|
|**1**|0|*8*|9|1|
|**2**|*∞*|*0*|*1*|*∞*|
|**3**|4|*12*|0|5|
|**4**|∞|*2*|3|0|

**Iteration:** 3

|-|**1**|**2**|**3**|**4**|
|:-:|:-:|:-:|:-:|:-:|
|**1**|0|8|*9*|1|
|**2**|5|0|*1*|6|
|**3**|*4*|*12*|*0*|*5*|
|**4**|7|2|*3*|0|

**Iteration:** 4

|-|**1**|**2**|**3**|**4**|
|:-:|:-:|:-:|:-:|:-:|
|**1**|0|3|4|*1*|
|**2**|5|0|1|*6*|
|**3**|4|7|0|*5*|
|**4**|*7*|*2*|*3*|*0*|

## Coding this in C++

Coding this is pretty straightforward, we can follow our pseudocode exactly as it is written. When we code this we get something like this:

```cpp
#include
#include
#include

#define INF 100000

void floyd_ws_algorithm(std::vector< std::vector > &graph);

int main(int argc, const char * argv[]) {
  std::vector< std::vector > graph;

  graph = {
    { 0, 8, INF, 1 },
    { INF, 0, 1, INF },
    { 4, INF, 0, INF },
    { INF, 2, 9, 0 },
  };

  floyd_ws_algorithm(graph);

  for (int i = 0; i < graph.size(); i++) {
    for (int j = 0; j < graph.size(); j++) {
      std::cout << graph[i][j] << " ";
    }

    std::cout << std::endl;
  }

  std::cout << std::endl;

  return 0;
}

// Execute prim's algorithm for the given start node, note this is the index of the graph
void floyd_ws_algorithm(std::vector< std::vector > &graph) {
  for (int k = 0; k < graph.size(); k++) { // For every iteration (an iteration is a row/col pair)
    for (int i = 0; i < graph.size(); i++) { // For every cell
      for (int j = 0; j < graph.size(); j++) { // for every cell part 2 // If current value > new value, replace
        if (graph[i][j] > graph[i][k] + graph[k][j]) {
          graph[i][j] = graph[i][k] + graph[k][j];
        }
      }
    }
  }
}
```

When we check this we also get the solution:

|-|**1**|**2**|**3**|**4**|
|:-:|:-:|:-:|:-:|:-:|
|**1**|0|3|4|1|
|**2**|5|0|1|6|
|**3**|4|7|0|5|
|**4**|7|2|3|0|

which is the same solution as when we did this manually.
