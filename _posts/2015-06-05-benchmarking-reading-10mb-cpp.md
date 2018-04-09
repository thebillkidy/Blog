---
layout: post
current: post
cover: 'assets/images/covers/coding2.jpg'
navigation: True
title: How to benchmark Reading 10MB in C++
date: 2015-06-05 18:41:00
tags: algorithms, cpp, c++
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

> This article is based on a vagrant Ubuntu system with an SSD so you might encounter different results.

When reading and writing files in C++ it is important to use the correct buffer size or the block size. This will drastically improve the time it takes to read in files or write to files.

Let's create a 10Mb file in C++ with the following code (we are not using a buffer here since we are benchmarking the reading so this doesn't matter):

```c
#include <sys/types.h>
#include <sys/stat.h>
#include
#include
#include // rand, srand
#include // time
#include // perror

int main(int argc, char** argv) {
  srand(time(0));

  // Open file in write only, create if not exist and always truncate mode.
  int fd;

  if ((fd = open("test.txt", O_WRONLY | O_CREAT | O_TRUNC, S_IRUSR | S_IRGRP | S_IROTH)) < 0) {
    perror(argv[0]);
    exit(1);
    return 1;
  };

  // Write 10Mb chars
  for (int i = 0; i < (10 * 1024 * 1024); i++) {
    int cr = rand() % 26 + 'a';

    // Write 1 byte char to fd
    if (write(fd, &cr, 1) != 1) {
      perror(argv[0]);
      exit(1);
    };
  }

  // Close the FD
  if (close(fd) < 0) {
    perror(argv[0]);
    exit(1);
  };

  return 0;
}
```

This simply create a text file with random characters from the alphabet in it for 10Mb.

Now when we want to read this file we can do this in different block sizes. This next piece of code will time how long it takes to read in the file with different block sizes.

```c
#include <sys/types.h>
#include <sys/stat.h>
#include
#include // read
#include // rand, srand
#include // time
#include // perror
#include // malloc

int main(int argc, char** argv) {

  // Read 10Mb in decrementing BUF_SIZES into the buffer
  for (int i = 1; i < 8192; i <<= 1) {
    // Create buffer to load it in
    char *buffer = (char *)malloc(sizeof(char) * i);

    // Start timing
    double start = clock();

    // Open file in write only, create if not exist and always truncate mode.
    int fd;

    // Open file
    if ((fd = open("test.txt", O_RDONLY)) < 0) {
      free(buffer);
      perror(argv[0]);
      exit(1);
    };

    // Keep reading the count while count == i, this means we have still remaining bytes
    int count;

    if ((count = read(fd, buffer, i)) < 0) {
      free(buffer);
      perror(argv[0]);
      exit(1);
    }

    while (count == i) {
      if ((count == read(fd, buffer, i)) < 0) {
        free(buffer);
        perror(argv[0]);
        exit(1);
      }
    }

    double end = (clock() - start) / CLOCKS_PER_SEC;
    printf("BUF_SIZE=%6d Time=%4fn", i, end);

    free(buffer);

    if (close(fd) < 0) {
      free(buffer);
      perror(argv[0]);
      exit(1);
    };

  }

  return 0;
}
```

After running this file we get the following result:

```
$ make main && ./main
g++ main.cpp -o main
BUF_SIZ= 1 Time=0.39
BUF_SIZ= 2 Time=0.27
BUF_SIZ= 4 Time=0.19
BUF_SIZ= 8 Time=0.08
BUF_SIZ= 16 Time=0.03
BUF_SIZ= 32 Time=0.02
BUF_SIZ= 64 Time=0.02
BUF_SIZ= 128 Time=0.01
BUF_SIZ= 256 Time=0.00
BUF_SIZ= 512 Time=0.00
BUF_SIZ=1024 Time=0.00
BUF_SIZ=2048 Time=0.00
BUF_SIZ=4096 Time=0.00
BUF_SIZ=8192 Time=0.00
```

We can clearly see that when using a buffer size of 1 that the performance is slower then when using a buffer size of 256 or 8. Now let's create a 100Mb file and execute it on that new file.

```
BUF_SIZ= 1 Time=3.66
BUF_SIZ= 2 Time=1.91
BUF_SIZ= 4 Time=0.95
BUF_SIZ= 8 Time=0.40
BUF_SIZ= 16 Time=0.20
BUF_SIZ= 32 Time=0.11
BUF_SIZ= 64 Time=0.07
BUF_SIZ= 128 Time=0.04
BUF_SIZ= 256 Time=0.01
BUF_SIZ= 512 Time=0.02
BUF_SIZ=1024 Time=0.01
BUF_SIZ=2048 Time=0.01
BUF_SIZ=4096 Time=0.01
BUF_SIZ=8192 Time=0.01
```

We can now clearly see that the bigger the buffer size the faster the reading, however when the buffer size gets big enough the performance gain is almost the same.
