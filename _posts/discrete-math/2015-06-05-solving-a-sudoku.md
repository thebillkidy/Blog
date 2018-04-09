---
layout: post
current: post
cover: 'assets/images/covers/algorithms.jpg'
navigation: True
title: Solving a Sudoku with Discrete Math
date: 2015-06-05 12:00:03
tags: discrete-math
class: post-template
subclass: 'post tag-discrete-math'
author: xavier
---

Solving a Sudoku is not an easy task, not for humans and even a computer can struggle with it if it has to go through each combination and try brute forcing the puzzle without any clue.

Lucky for us we are able to tackle this problem by using Discrete Math and treating the problem as a Exact Cover problem. This problem can be solved by creating a dual interpretation of our problem and solving it manually by using the algorithm X or by creating dancing links and programming this algorithm.

&gt; For the full details about this algorithm, please check out the paper by **Donald E. Knuth** from Stanford University. [http://lanl.arxiv.org/pdf/cs/0011047.pdf](http://lanl.arxiv.org/pdf/cs/0011047.pdf)

In this article I will explain on what a Dual Interpretation is, What the algorithm X is and how we can apply these to solve a 2 x 2 sudoku.

## Dual Interpretation

Our Dual Interpretation will take constraints and fulfilment of these constraints and put those into one table or matrix so that we can use these constraints and fulfilment's to construct a solution.

The best way to explain this is by showing an example.

Let's say we have a graph that looks like this:

![graph](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPTjA3NHk5U3BFYlU)

Here we can see that we got connections between the points on the top and the points on the bottom. For our dual interpretation we will say that the top values are our constraints, and the bottom ones are our fulfilment's for these constraints. We then create a table with our constraints as the columns and the fulfilment's as the X values. The result looks like this:

![dual_interpretation_graph](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPb1BPdmd4VUdJTjQ)

This is our Dual Interpretation for this specific graph. We will need this to construct a unique solution that will connect each node from the top with one of the bottom without multiple connections, for this we are going to use the Algorithm X.

## Algorithm X

The Algorithm X is a name given by Donald E. Knuth to an algorithm that is able to determine the solution to specific problems based on our Dual Interpretation. Popular problems being solved with this algorithm are: Pentomino's, Sudoku's and The n*n Queen Problem.

The algorithm works like this:

1. Pick a fulfilment from our dual interpretation, then mark all the cells in this row. (Add this row to a new table called solution)
2. Select every cel in the columns that contain a marked cell from step 1.
3. Remove all the rows that have a marked cell.
4. After removal, we need to check if the removal worked and we can still find a unique solution!
1. If there are no MARKED columns anymore, but there is still an empty column, then there is a fulfilment that has disappeared and we need to reverse everything till step 1 and pick another fulfilment to start with.
2. If we have no MARKED columns and no EMPTY columns, then we are clear to proceed to step 5.
5. Iterate again starting from step 1 until we have fulfilled every fulfilment.

We will now apply this algorithm on the Dual Interpretation created in the previous chapter.

![algorithm_x](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPNW5YbDdnVUppYms)

We now know the basics to start solving a 2 x 2 sudoku.

## Applying the learned techniques on a 2 x 2 Sudoku

### Creating the dual interpretation

I will start by explaining this technique on a 2 x 2 sudoku, the reason for this will be clear after our first part ;)

The concept of a sudoku is pretty straightforward, you fill in a number from 1 to n and make sure this number does not appear horizontally, vertically and in the same block, or partitions. Many of us will also think the sudoku as a Latin Square, this is a square with the order n where every number appears exactly once in each row and column.

If we solve a 2 x 2 "Latin Square" or "Sudoku" then we get this as one of the solutions:

| 1 | 2 |
| :-: | :-: |
| **2** | **1** |

To achieve this with our algorithm X we will first have to create the Dual Interpretation, we can do this by finding the constraints and filling the fulfilment's for these constraints.

Our constraints for a sudoku this size are:

- 2 x 2 cell constraint (every cell has a number)
- 2 x 2 row constraint (every row has each number once)
- 2 x 2 column constraint (every column has each number once)

This means that we will have 2<sup>3</sup> = 8 fulfilment's (or facts) (where 3 is the number of different constraints and 2 is our n) and 2\*2 + 2\*2 + 2\*2 = 12 constraints.

We can now get started creating our table that will hold our fulfilment's and constraints, we chose the X values (or the rows) as our positions where a number can be placed (and this for each number). And our Y values (the columns) for each constraint group.

Constraint groups:

1. A number is in row X and column Y
2. Number A is in row X
3. Number A is in column Y

So our heading (columns) will look like this:

![2x2sudoku](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPUUxEVE15ek5Rcmc)

Now we create the legend for our rows, this makes us able to identify the solution on the end. Here we choose the value we put into the cell at row x and column y:

![2x2sudoku](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPaGRIbXpVeFVUVUU)

Now we just have to fill in our own constraints and we will get this:

![2x2sudoku](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPeHJ3VVdPVEVfUlU)

Once we have that we are finally able to solve our sudoku by applying the Algorithm X algorithm.

### Finding the solution by applying algorithm X

There is nothing hard about this step, we just perform algorithm X again as explained before and we will get this solution:

![2x2sudoku_solution](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPTjhBMWtjcWQ0c0U)

We now have our solution for this sudoku puzzle.

## Conclusion

When understanding the problem correctly, we are able to solve problems such as the sudoku problem in a very short time frame. The hardest part about this is most likely getting our constraints correct and creating the dual interpretation, but once this is done we have the solution in no time.

In this example we saw the Algorithm X applied on a 2 x 2 sudoku puzzle, but this is in fact possible on every other sudoku puzzle out there, the only thing we will need to add is a region constraint (Number A is in region Z).

As always, feel free to ask questions if you are stuck, or think I could improve something.