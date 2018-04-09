---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Solving permutations with Heap's Algorithm in Javascript
date: 2015-06-05 18:41:00
tags: algorithms, cpp, c++
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

A friend of mine had just gotten the question to find every combination for a given array in [1, 2, 3].
When analyzing this question I found out that this is actually a simple permutation that has to be generated with the use of Javascript. Lucky for me we had just had the course Discrete math in school so we saw some algorithms that could do this. The algorithm that I used for this is **Heap's algorithm**.

## Heap's Algorithm

Heaps algorithm is an algorithm that computes every single permutation of a given set of elements. The algorithm is basically going to swap elements based on the iteration k we are in for the current size n. If this iteration k is even then we will swap the kth element with the last element, and else we will swap the last element with the first element.

For more details about this algorithm please check Robert Sedgewick's book.

## Javascript

Programming this in Javascript can be done by following the pseudocode that we can find on sites such as wikipedia or just following the details given in Robert Sedgewick's book.

### Pseudocode

```
generate (n, arr)
if n = 1
  output arr
else
  for i = 0; i < n; i += 1
    generate (n - 1, arr)

if n is even
  swap(arr[i], arr[n - 1])
else
  swap(arr[0], arr[n - 1])
```

### Javascript

```javascript
// Purpose is to create every permutation from the elements in the array
// We can do this by using Heap's algorithm
var start = [1, 2, 3];

// Get the permutations
generate(start.length, start);

// Generate the permutation for a given n (amount of elements) and a given array
function generate(n, arr) {
  // If only 1 element, just output the array
  if (n == 1) {
    console.log(arr);
    return;
  }

  for (var i = 0; i < n; i+= 1) {
    generate(n - 1, arr);

    // If n is even
    if (n % 2 == 0) {
      swap(arr, i, n - 1);
    } else {
      swap(arr, 0, n - 1);
    }
  }
}

function swap(arr, idxA, idxB) {
  var tmp = arr[idxA];
  arr[idxA] = arr[idxB];
  arr[idxB] = tmp;
}
```

### Output
for the array [1, 2, 3] as used in the solution I get the following solution.

```
[2, 3, 1]
[3, 2, 1]
[1, 2, 3]
[2, 1, 3]
[3, 1, 2]
[1, 3, 2]
[2, 3, 1]
[3, 2, 1]
```
