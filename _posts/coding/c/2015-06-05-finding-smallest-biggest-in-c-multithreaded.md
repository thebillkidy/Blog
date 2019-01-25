---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Finding smallest and biggest number multithreaded in C++
date: 2015-06-05 18:41:00
tags: coding coding-c
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

The goal of this exercise is to create a program that generates a table with random elements in it. Once we created this table we have to start 2 threads. 1 thread will find the biggest number and the other will find the smallest number. We will then send this to a result and print these 2 numbers.

We start building this by looking up the manual for creating and joining threads (`man 3 pthread_create` and `man 3 pthread_join`). For those not familiar with thread joining, we do this to ensure that the thread has exited. When we have done this we found that creating and joining pthreads is done by these lines:

```c
int pthread_create(pthread_t *thread, const pthread_attr_t *attr,
void *(*start_routine) (void *), void *arg);
int pthread_join(pthread_t thread, void **retval);
```

> On the end of the pthread_create we see that we need to enter void *arg to pass arguments. This means we can only pass 1 argument so we will need to use structs if we want to pass more arguments.

We now create and join the threads with this piece of code:

```c
void *thread1_result;
void *thread2_result;

pthread_t threads[2];

pthread_create(&threads[0], NULL, &find_smallest, &args);
pthread_create(&threads[1], NULL, &find_biggest, &args);

pthread_join(threads[0], &thread1_result);
pthread_join(threads[1], &thread2_result);

double smallest = *(double *)thread1_result;
double biggest = *(double *)thread2_result;
```

Note that I created a pthread_t array variable first, I did this to pass a thread id with the pthread_create function. The `&find_smallest` and `&find_biggest` functions are going to call the `void *find_smallest(void *args)` and `void *find_biggest(void *args)` functions that we can implement.

For the args I created a structure that contains the numbers and the number count. I then pass this structure by reference to the pthread_create function so that I am able to fetch this structure in my implementation methods. (see *args).

Now I just have to print everything and I get the following result:

```c
#include // pthread_join, pthread_create (compile and link with -pthread)
#include // rand, srand
#include // time
#include // cout, endl
#include // printf

#define ELEMENT_COUNT 1000000

typedef struct arguments {
  double* numbers;
  int number_count;
} arguments;

void* find_smallest(void *args) {
  arguments *a = (arguments*) args;

  double *smallest = (double *)malloc(sizeof(double));
  *smallest = a->numbers[0];

  for (int i = 1; i < a->number_count; i++) {
    if (*smallest > a->numbers[i]) {
      *smallest = a->numbers[i];
    }
  }

  return smallest;
}

void* find_biggest(void *args) {
  arguments *a = (arguments*) args;

  double *biggest = (double *)malloc(sizeof(double));
  *biggest = a->numbers[0];

  for (int i = 1; i < a->number_count; i++) {
    if (*biggest < a->numbers[i]) {
      *biggest = a->numbers[i];
    }
  }

  return biggest;
}

int main(int argc, char** argv) {
  srand(time(0));

  arguments args;

  args.numbers = (double *)malloc(sizeof(double) * ELEMENT_COUNT);
  args.number_count = ELEMENT_COUNT;

  for (int i = 0; i < ELEMENT_COUNT; i++) {
    *(args.numbers + i) = rand();
  }

  // create threads for finding the biggest and the smallest number
  void *thread1_result;
  void *thread2_result;

  pthread_t threads[2];

  pthread_create(&threads[0], NULL, &find_smallest, &args);
  pthread_create(&threads[1], NULL, &find_biggest, &args);

  pthread_join(threads[0], &thread1_result);
  pthread_join(threads[1], &thread2_result);

  double smallest = *(double *)thread1_result;
  double biggest = *(double *)thread2_result;

  printf("Biggest: %fn", biggest);
  printf("Smallest: %fn", smallest);
  std::cout << "Done" << std::endl;

  free(thread1_result);
  free(thread2_result);
  free(args.numbers);

  return 0;
}
```
