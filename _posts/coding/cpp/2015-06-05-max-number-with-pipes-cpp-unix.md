---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Max number with pipes in C++ and Unix
date: 2015-06-05 18:41:00
tags: algorithms, cpp, c++, unix
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

Let's say we have x children, these x children all generate a number and give this to the parent. The parent now finds the highest number and sends the children the process id of the winning child. If the winning child recognises itself then it prints that it is the winner, else they print the winning process id.

**Let's break this down:**

1. x children ⇒ argv[1] = x ⇒ for loop that forks children
2. The children send a random number to the parent ⇒ Create a file descriptor that writes the number, let the parent read from this file descriptor.
3. Parent finds highest number ⇒ Just create a if > and save the new id if it is.
4. Sends the children the process id ⇒ This is trickier, we need to create another file descriptor and save the write descriptor for the children that we created. On the end we can now use this file descriptor to send the result to the child. We also will let the child read from this file descriptor so it can find the answer.
5. Print the winning process id. ⇒ Just an if getpid() matches what we read, then print I'm the winner, else print the process that won.

After this breakdown it is pretty straightforward to code it. We can find all the methods in the `man` pages so we know which includes that we have to do. At the end I came up with this code:

## Code:

```c
// 1 argument: Number of child process to generate.
// Every child process generates a number and sends it to the parent.
// The parent then finds the biggest of the numbers and sends that back to the children
// When the children are done writing this number to the screen the parent exits.
// ==> 2 pipes, one for reading and one for writing

#include // srand, rand
#include // pipe, close, write
#include // printf
#include <sys/types.h> // waitpid
#include <sys/wait.h> // waitpid

typedef struct process {
  int pid;
  int fd_write;
} process;

int winner_id = 0;
int winner_value = 0;

int main(int argc, char ** argv) {
  if (argc != 2) {
    printf("Expected 1 parameter.n");
    exit(1);
  }

  process processes[atoi(argv[1])]; // our process table
  int received_numbers = 0;
  int fd1[2];
  int fd2[2];

  // Create the processes
  for (int i = 0; i < atoi(argv[1]); i++) {
    // Create the pipe for this process
    if (pipe(fd1) < 0 || pipe(fd2) < 0) {
      perror(argv[0]);
      exit(1);
    }

    // Create the child process
    if ((processes[i].pid = fork()) < 0) {
      perror(argv[0]);
      exit(1);
    } else if (processes[i].pid == 0) {
      // CHILD
      close(fd1[0]); // Close unused read end
      close(fd2[1]); // Close unused write end

      // Generating the random number
      srand(getpid());
      int number = rand();

      // Send this number to the parent
      if ((write(fd1[1], &number, sizeof(int)) != sizeof(int)) < 0) {
        perror(argv[0]);
        exit(1);
      };

      // Wait for the response
      int winner_pid;
      while (read(fd2[0], &winner_pid, sizeof(int)) != sizeof(int));

      // Determine if the process is the winner or not
      if (winner_pid == getpid()) {
        printf("I'm the winner!n");
      } else {
        printf("Process %d is the winnern", winner_pid);
      }

      // Exit child
      exit(0);
    } else {
      // PARENT
      close(fd1[1]); // Close unused write end
      close(fd2[0]); // Close unused read end

      processes[i].fd_write = fd2[1];

      // Wait for the processes to close
      int number;
      if (read(fd1[0], &number, sizeof(int)) != sizeof(int)) {
        perror(argv[1]);
        exit(1);
      }

      printf("Number Received: %-10d from process: %dn", number, processes[i].pid);

      // Determine winner
      if (winner_value < number) {
        winner_id = i;
      }
    }
  }

  // Send the winner back
  for (int i = 0; i < atoi(argv[1]); i++) {
    if ((write(processes[i].fd_write, &processes[winner_id].pid, sizeof(int)) != sizeof(int)) < 0) {
      perror(argv[1]);
      exit(1);
    }
  }

  // Wait for the childs to exit
  waitpid(-1, NULL, 0);

  return 0;
}
```
