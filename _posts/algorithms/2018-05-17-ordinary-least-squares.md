---
layout: post
current: post
cover: 'assets/images/covers/algorithms3.jpg'
navigation: True
title: Ordinary Least Squares (OLS)
date: 2018-05-17 09:00:00
tags: algorithms
class: post-template
subclass: 'post tag-algorithms tag-ai'
author: xavier
---

Let's start by defining the goal of our algorithm, what do we want to achieve with our OLS algorithm? Well if we have data points in a region (or XY-axis), then we want to be able to find an equation that fits as closely to these points as possible. We thus want to **minimize the sum of the squared residuals**. Just take a look at the picture below to see an illustration of this.

![assets/images/posts/ordinary-least-squares.jpg](assets/images/posts/ordinary-least-squares.jpg)

## Calculating our OLS Algorithm - Model with 2 parameters

Now how can we calculate this? Well we know that our linear line can be represented in the form of $\hat{y} = a + bx$ which in its turn represents our *predicted value*. If our original value is then given by $y$, then we can say that our *error* is represented by the equation $y - \hat{y}$.

Simplifying this gives us that our error can be represented as: $d_i = y - (a + bx)$ or the sum for all the errors can be represented as $\sum^{n}_{i=1}d_i^2 = \sum^{n}_{i=1}(y_i - (a + bx))^2$

Remembering our original goal **minimize the sum of the squared residuals**, we know that we will need a derivative, which will show us where the minimums are. Seeing that we have 2 parameters *a* and *b*, we know that this will be a *partial derivative*. So to find our minimums, we will calculate the partial derivatives for a and b, and calculate these to 0. Or $\frac{d}{da} = 0$ and $\frac{d}{db} = 0$

Let's get started

> **Note:** The following chapters will be purely mathematical. Make sure to remember that $(a - b)^2 = a^2 - 2ab + b^2$

### Calculating our Derivative $\frac{d}{da} = 0$

$\frac{d}{da}\sum(y - (a + bx))^2$

$= \sum\frac{d}{da}(y^2 - 2y(a+bx)+(a + bx)^2)$

$= \sum\frac{d}{da}(y^2 - 2ya - 2ybx + a^2 + 2abx + b^2x^2)$

$= \sum(-2y + 2a + 2bx)$

$= 2\sum^n_{i=0}(a + bx - y)$

$\rightarrow na + \sum^n_{i=0}(bx - y) = 0 \leftrightarrow \sum^n_{i=0}{y} = na + b\sum^n_{i=0}{x}$

### Calculating our Derivative $\frac{d}{db} = 0$

$\frac{d}{db}\sum(y - (a + bx))^2$

$= \sum\frac{d}{db}(y^2 - 2y(a+bx)+(a + bx)^2)$

$= \sum\frac{d}{db}(y^2 - 2ya - 2ybx + a^2 + 2abx + b^2x^2)$

$\rightarrow  \sum(-2yx + 2ax + 2bx^2) = 0$

$\leftrightarrow -\sum{yx} + a\sum{x} + b\sum{x^2} = 0$

$\leftrightarrow a\sum^n_{i=0}{x} + b\sum^n_{i=0}{x^2} = \sum^n_{i=0}yx$

## Calculating our OLS Algorithm - Multiple Terms

Linear Regression is however the easiest. So what do we do if we need to find more terms? Well then we are better of using Matrixes.

In matrixes this comes down to finding our parameters $\begin{bmatrix}a \\b\end{bmatrix}$ so that $\begin{bmatrix}a + bx_1\\ a + bx_2\\ ...\\a+bx_n\end{bmatrix}$ is close to $\begin{bmatrix}y_1\\y_2\\...\\y_n\end{bmatrix}$

$\rightarrow \begin{bmatrix}x_1\\x_2\\...\\x_n\end{bmatrix} * \begin{bmatrix}a\\b\end{bmatrix} = \begin{bmatrix}y_1\\y_2\\...\\y_n\end{bmatrix} \leftrightarrow Ax = b$

Now to solve this, we can use the formula $A^TAx = A^Tb$

> For the proof to this formula, please refer to Hayashi, Fumio (2000). Econometrics. Princeton University Press https://press.princeton.edu/titles/6946.html

$$
A^T=\begin{bmatrix}1&1&...&1\\x_1&x_2&...&x_n\end{bmatrix} A^TA = \begin{bmatrix}N&\sum{X_i}\\\sum{X_i}&\sum{X_i^2}\end{bmatrix} A^Tb=\begin{bmatrix}\sum{y_i}\\\sum{x_iy_i}\end{bmatrix}
$$

Let's illustrate this with an example. What if we want to find the best line through (1,1), (2,3), (3,3), (4,5)?

$$
A^TA=\begin{bmatrix}4&10\\10&30\end{bmatrix} A^Tb=\begin{bmatrix}12\\36\end{bmatrix}
$$

$\rightarrow \begin{bmatrix}4&10\\10&30\end{bmatrix}\begin{bmatrix}a\\b\end{bmatrix}=\begin{bmatrix}12\\36\end{bmatrix}$

$\leftrightarrow \begin{bmatrix}a\\b\end{bmatrix} = A^{-1}B$

$\leftrightarrow \begin{bmatrix}a\\b\end{bmatrix} = \begin{bmatrix}3/2&-1/2\\-1/2&1/5\end{bmatrix} \begin{bmatrix}12\\36\end{bmatrix}$

$\leftrightarrow\begin{bmatrix}a\\b\end{bmatrix} = \begin{bmatrix}0\\6/5\end{bmatrix}$

> **Note:** 0 since $\frac{3}{2} * 12 + \frac{-1}{2} * 36$ and $\frac{6}{5}$ since $\frac{-1}{2} * 12 + \frac{1}{5} * 36$
