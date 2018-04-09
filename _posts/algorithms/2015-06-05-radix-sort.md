---
layout: post
current: post
cover: 'assets/images/covers/algorithms.jpg'
navigation: True
title: Radix Sort
date: 2015-06-05 13:00:12
tags: algorithms, cpp, c++
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

Radix sort is a sorting algorithm that is different than the traditional algoritms that we encountered already. It sorts data based on the integers their individual digits instead of looking at the complete value.

In this article I will explain the Least Significant Digit Radix Sort by use of an example and implement it in C++, so let's get started.

As an example let's look at the following table:

```
398
249
2
368
34
576
10
```

If we use radix sort we will start from the Least Significant Digit (LSD) and we will sort the table based on that digit:

```
39(8) 1(0)
24(9) (2)
(2) 3(4)
36(8) --> 57(6)
3(4) 39(8)
57(6) 36(8)
1(0) 24(9)
```

> If you watch closely you can see that we have 398, 368 this is because 398 appeared first in the list

Now we will move up the the second digit.

```
(1)0 2
2 (1)0
(3)4 (3)4
5(7)6 --> 2(4)9
3(9)8 3(6)8
3(6)8 5(7)6
2(4)9 3(9)8
```

and as a last step we move up to the third digit:

```
2 2
10 10
34 34
(2)49 --> (2)49
(3)68 (3)68
(5)76 (3)98
(3)98 (5)76
```

Which results into the sorted array.

Let's now start converting this into code. We can see that we are ordering by digits, which means we can use 10 buckets (for every digit 1) and put the integers with the same value in the correct bucket.

We also know that we need to keep the correct order, so a queue would be perfectly fit for this. So let's use queue's as digits.

Getting the digit might be a bit trickier, however a simple math trick will do. We know that we start with the LSD so we can get that with % 10. Now for the next digit we divide by 10 (remove the decimal) and do % 10 again. For the 3th digit we divide by 100 (remove the decimal) and do % 10 again. And so on...

Let's write some pseudocode now:

```
var max_digits = 4; // Number of the maximum digits appearing in a number
var digit = 0; // Start at LSD (so / 0)

while (digit < max_digits) {
  // Put the numbers into their correct queue
  for (number in numbers) {
    buckets[(number / (10 * digit)) % 10].enqueue(number);
  }

  // Put the numbers into the array again
  var tempArray;
  
  for (bucket in buckets) {
    for (number in bucket) {
      tempArray.push_back(number);
    }
  }

  numbers = tempArray;

  // Go to the next digit and repeat
  digit++;
}
```

When we convert this into some simple C++ code then we get:

```cpp
#include
#include
#include

using namespace std;

void print_list(vector numbers) {
  for (auto i = 0; i < numbers.size(); i++) {
    cout << numbers[i] << " ";
  }

  cout << endl;
}

// Digit = 0 means the LSD this goes towards the MSD
// Size = number of integers starting at input
void radix_sort(vector &numbers) {
  int max_digits = 5; // Number of maximum digits appearing in a number
  int digit = 0; // Start at LSD (so / 0)
  int division = 1;

  while (digit < max_digits) {
    queue buckets[10]; // Represent buckets

    // Put the numbers into their correct queue
    for (auto i = 0; i < numbers.size(); i++) {
      int bucketIdx = int(numbers[i] / division) % 10;
      buckets[bucketIdx].push(numbers[i]);
    }

    // Put the numbers into the array again
    vector tempNumbers;
    for (auto bucketIdx = 0; bucketIdx < 10; bucketIdx++) {
      while (!buckets[bucketIdx].empty()) {
        tempNumbers.push_back(buckets[bucketIdx].front());
        buckets[bucketIdx].pop();
      }
    }

    numbers = tempNumbers;

    // Go to the next digit and repeat
    digit++;
    division *= 10;
  }
}

int main(int argc, const char * argv[]) {
  vector numbers;

  numbers.push_back(85791);
  numbers.push_back(63694);
  numbers.push_back(41347);
  numbers.push_back(33967);
  numbers.push_back(51489);
  numbers.push_back(70446);
  numbers.push_back(95570);
  numbers.push_back(12567);
  numbers.push_back(30489);
  numbers.push_back(00476);
  numbers.push_back(11357);
  numbers.push_back(21025);
  numbers.push_back(41475);
  numbers.push_back(62578);
  numbers.push_back(55555);

  print_list(numbers);
  cout << endl;
  radix_sort(numbers);
  print_list(numbers);

  return 0;
}
```

There are of course improvements to be made:
* Ability to detect the max number of digits
* Add MSD sort instead of LSD sort
* Smaller code
* ...

Applying this on our initial list of :

```
85791 63694 41347 33967 51489 70446 95570 12567 30489 318 11357 21025 41475 62578 55555
```

returns the correct result:

```
318 11357 12567 21025 30489 33967 41347 41475 51489 55555 62578 63694 70446 85791 95570
```