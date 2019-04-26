---
layout: post
current: post
cover: 'assets/images/covers/quantum.jpeg'
navigation: True
title: Quantum Computing - A Linear Algebra Refresher
date: 2019-01-16 09:00:00
tags: quantum
class: post-template
subclass: 'post'
author: xavier
---

Quantum requires a lot of Linear Algebra, so much even that it's very interesting to have a quick reminder about it. In here I will explain the basics of Linear Algebra that are needed to work with Quantum Computing.

## Basic Concepts

Most often used in Quantum Computing are the so called "Ket" vectors, which are a representation of the "Dirac Notation".

These vectors can look like: $<\phi|\psi>$ where we have several elements:
* `< x` = Our "bra", mostly representing a row vector
* `|`   = Action of a linear functional on a vector or the scalar product of vectors
* `y >` = our "ket", mostly representing a column vector

## Matrices 

A matrix is a rectangular scheme of numbers with `m rows` and `x columns`. It is an easy way to calculate formulas that are represented in some sort of structure. Most commonly used in Quantum Computing is the need for being able to Multiply these matrices. However to be able to multiple these matrices, we first need to look if the *base requirement of the columns of matrix a being equal to the rows of matrix b* is met. Once that is done, we can start multiplying them.

To multiple those, we then take every row and multiply it with every column, taking the sum of the results.

**Example:**

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}

\begin{bmatrix}
x \\
y
\end{bmatrix}

=

\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

> Notice that our first matrix is a 2 x 2 matrix, and our second one is a 2 x 1 --> 2 x **2** & **2** x 1, the insides 2's have to be equal.

Putting this into practice:

$$
\begin{bmatrix}
1 & 2 & 3 \\
3 & 4 & 5 \\
6 & 7 & 8
\end{bmatrix}

\begin{bmatrix}
0 & 0 & 1 \\
0 & 1 & 0 \\
1 & 0 & 0
\end{bmatrix}

=

\begin{bmatrix}
1*0+2*0+3*1 & 1*0+2*1+3*0 & 1*1+2*0+3*0 \\
4*0+5*0+6*1 & 4*0+5*1+6*0 & 4*1+5*0+6*0 \\
7*0+8*0+9*1 & 7*0+8*1+9*0 & 7*1+8*0+9*0
\end{bmatrix}

=

\begin{bmatrix}
3 & 2 & 1 \\
6 & 5 & 4 \\
9 & 8 & 7
\end{bmatrix}
$$

## Complex Numbers

Complex numbers are written by $i$, they solve the fundamental problem of $\sqrt{-1}$ which is impossible to solve, stating it as a new symbol $i$. 

We can visualize complex numbers by using a circle of unit length 1, generating an Imaginary axis and a Real axis.

![/assets/images/posts/quantum/linear-algebra/complex-numbers2.png](/assets/images/posts/quantum/linear-algebra/complex-numbers2.png)

Where we can find the following statements:

* $z = x + y*i$ 
* $z= e^{j\theta}$ 
* $z = \mid z \mid * (cos(\theta) + i*sin(\theta))$
* $\mid z \mid = \sqrt{x^2 + y^2}$
* $\theta = tg^{-1}(\frac{y}{x})$
