---
layout: post
current: post
cover: 'assets/images/covers/algorithms.jpg'
navigation: True
title: Fields - Elliptical Curves Over Finite Fields
date: 2015-06-05 18:41:00
tags: discrete-math
class: post-template
subclass: 'post tag-discrete-math'
author: xavier
---

## 1.1 Weierstrass Equations

### 1.1.1 Introduction

A weierstrass equation is an elliptical curve with a collection of points (x, y) (xεF and yεF) and is of the third grade with the form:

$$y^2 + a_1xy + a_3y = x^3 + a_2x^2 + a_4x + a_6, a_i\epsilon F$$

and ∞ always added as a point.

### 1.1.2 Notions

* We have an interaction ⊞ or + that converts (E/F, ⊞) to an abelian group (see groups). We can create formulas to interpret P<sub>1</sub>⊞P<sub>2</sub>.
* ∞ is the neutral element
* The inverse of P is -P or P' (Noted as P⊞P'=∞)
* P n times itself is written as nP (Example: 2P is the doubling of the point P)

We will create formulas for P<sub>1</sub>⊞P<sub>2</sub> for the elliptical curbes (E/F<sub>p<sup>n</sup></sub>) over the finite fields (F<sub>p<sup>n</sup></sub>). Which allows us to reduce the amount of Weirstrass equations to 5 cases:

**Supersingular Cases**

* (E/F<sub>2<sup>n</sup></sub>, ⊞), E: y<sup>2</sup> + cy = x<sup>3</sup> + ax + b
* (E/F<sub>3<sup>n</sup></sub>, ⊞), E: y<sup>2</sup> = x<sup>3</sup> + ax + b

**Not-Supersingular Cases**

* (E/F<sub>2<sup>n</sup></sub>, ⊞), E: y<sup>2</sup> + xy = x<sup>3</sup> + ax<sup>2</sup> + b
* (E/F<sub>3<sup>n</sup></sub>, ⊞), E: y<sup>2</sup> = x<sup>3</sup> + ax<sup>2</sup> + b

**Over fields with characteristic p ≥ 5**

* (E/F<sub>p<sup>n</sup></sub>, ⊞), E: y<sup>2</sup> = x<sup>3</sup> + ax + b

## 1.2 Number of points

The number of points (#E) on a elliptical curbe (E/F<sub>q=p<sup>n</sup></sub>, ⊞) depends on the coefficients (a, b, c) in the equations from our previous point.

To get #E we need to know the number of points for #(E/F<sub>p</sub>, ⊞), if we know this we can get the number of points for #(E/F<sub>p<sup>n</sup></sub>, ⊞), this if our coefficients a, b and c are still the same.

Once we know this we can create a recursion equation for #E:

* ε<sub>1</sub> = (p + 1) - #(E/F<sub>p</sub>, ⊞) and ε<sub>0</sub> = 2
* ε<sub>n</sub> = ε<sub>1</sub>ε<sub>n - 1</sub> - pε<sub>n - 2</sub>

**Example:** Coefficients are: a = 0, b = 1 and (E/F<sub>2</sub>, ⊞) = {(1,0), (0,1), (1,1), (∞, ∞)}. Calculate the number of points for F<sub>65536</sub>

What do we know:

* We know that by applying F<sub>q = p<sup>n</sup></sub> that F<sub>65536 = 2<sup>16</sup></sub>, so q = 65536, p = 2 and n = 16.
* The number of points for when n = 1 and p = 2 is 4 (this is given).
* ε<sub>0</sub> = 2

We can fill this into a table already. If we do this we get:

| q | | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536
|:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:|
| **ε** | 2
| **#E** | |

If we now apply the 2 formulas for ε<sub>1</sub> and ε<sub>n</sub> we get:

| q | | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536
|:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:||:-:|
| **ε** | 2 | -1 | -3 | 5 | 1 | -11 | 9 | 13 | -31 | 5 | 57 | -67 | -47 | 181 | -87 | -275 | 449
| **#E** | | 4 | 8 | 4 | 16 | 44 | 56 | 116 | 288 | 508 | 968 | 2116 | 4144 | 8012 | 16472 | 33044| 65088

&gt; Note: We can check find out the range the points lie in by checking the Hasse Interval, you do this by saying ε = (q + 1) - #E, then |ε| is always smaller or equal to 2√q. (Example: for (E/F<sub>37</sub>, ⊞) |ε| ≤ 12 ==&gt; 26 ≤ #E ≤ 50)

## 1.3 Curves over Characteristic (F) ≥ 5

Let's say we got a Weirstrass Equation that is of the form: **E: y<sup>2</sup> = x<sup>3</sup> + ax + b**, we know that this is a (E/F<sub>3<sup>n</sup></sub>, ⊞) Supersingular equation. Because we are working with fields, we can write the + and the * as the additive and multiplicative interactions between the elements. Now we get: **E: y<sup>2</sup> = x<sup>3</sup> ⊕ a⊗x ⊕ b** (Note: the power is also multiplicative!).

### 1.3.1 Formulas

2P = ∞

1. z = (3⊗x<sup>2</sup> ⊕ a) ⊘ (2⊗y)
2. 2P ≡ (x”,y”)
3. x” = z<sup>2</sup> ⊖ 2⊗x
4. y” = z ⊗(x ⊖ x”) ⊖ y

We can now calculate (x<sub>3</sub>, y<sub>3</sub>) = (x<sub>1</sub>, y<sub>1</sub>) ⊞ (x<sub>1</sub>, y<sub>1</sub>)

1. z = (y<sub>2</sub> ⊖ y<sub>1</sub>) ⊘ (x<sub>2</sub> ⊖ x<sub>1</sub>)
2. x3 = z<sup>2</sup> ⊖ x<sub>1</sub> ⊖ x<sub>2</sub>
3. y3 = z ⊗ (x<sub>1</sub> ⊖ x<sub>3</sub>) ⊖ y<sub>1</sub>

### 1.3.2 Example
**Question: We have (E/F<sub>5</sub>), a=4, b=1, n=1 (so we have modulo 5) and E: y<sup>2</sup> = x<sup>3</sup> + ax + b**

We know that E: y<sup>2</sup> = x<sup>3</sup> + ax + b = E: y<sup>2</sup> = x<sup>3</sup> + 4x + 1

We can calculate x<sup>3</sup> + 4x + 1 by executing the equation on the X'es given, and y by taking the root from the right side of our equation, do note that this can be non existant (if the root can't be taken). Another way to calculate y would be to check where y * y in our multiplication table is equal to our right side of the equation.

So if we put this into a table to calculate the points:

| Calculations |
| - |
| Calculating x<sup>3</sup> + 4x + 1 |
| **0**<sup>3</sup> + 4 * **0** + 1 mod 5 = 1
| **1**<sup>3</sup> + 4 * **1** + 1 mod 5 = 1
| **2**<sup>3</sup> + 4 * **2** + 1 mod 5 = 2
| **3**<sup>3</sup> + 4 * **3** + 1 mod 5 = 0
| **4**<sup>3</sup> + 4 * **4** + 1 mod 5 = 1
| **Calculating y**|
| sqrt(1) = 1 |
| sqrt(1) = 1 |
| sqrt(2) = / |
| sqrt(0) = 0 |
| sqrt(1) = 1 |
| **Calculating y'** |
| 1' = 4 |
| 1' = 4 |
| /' = / |
| 0' = / |
| 1' = 4 |

Putting it into a simple table:

| Formula | | | | | |
| :-: | :-: | :-: | :-: | :-: | :-: |
| **----------------** | **----** | **----** | **----** | **----** | **----** |
| **x** | 0 | 1 | 2 | 3 | 4
| **x<sup>3</sup> + 4x + 1** | 1 | 1 | 2 | 0 | 1
| **----------------** | **----** | **----** | **----** | **----** | **----** |
| **y** | 1 | 1 | | 0 | 1
| **y'** | 4 | 4 | | 4

Out of this table we can read that our points are:

* \#E = 8
* **A(4, 1)** and **A'(4, 4)**
* **B(1, 1)** and **B'(1, 4)**
* **C(0, 4)** and **C'(0, 1)**
* **O(3, 0) = O' --&gt; O ⊞ O' = ∞**

Now we can apply everything that we calculated on the formulas in point 1.3.1 and we can get the 2P, or the doubling of our point P

P | x | y | 2y | (2y)' | z | x'' | y'' | 2P
:-: |:-: |:-: |:-: |:-: |:-: |:-: |:-: |:-: |
A | 4 | 1 | 2 | 3 | 1 | 3 | 0 | O
A' | 4 | 4 | 3 | 2 | 4 | 3 | 0 | O
B | 1 | 1 | 2 | 3 | 1 | 4 | 1 | A
B' | 1 | 4 | 3 | 2 | 4 | 4 | 4 | A'
C | 0 | 4 | 3 | 2 | 3 | 4 | 4 | A'
C' | 0 | 1 | 2 | 3 | 2 | 4 | 1 | A'

and last but not least, we can fill in the group table.

| | | ∞ | A | O | A' | B | C | C' | B'
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | **∞** | ∞ | A | O | A' | B | C | C' | B'
| **(4,1)** | **A** | A | O | | ∞ | | | |
| **(3,0)** | **O** | O | | ∞ | | | | |
| **(4,4)** | **A'** | A' | ∞ | | O | | | |
| **(1,1)** | **B** | B | | | | A | | | ∞
| **(0,4)** | **C** | C | | | | | A' | ∞ |
| **(0,1)** | **C'** | C' | | | | | ∞ | A |
| **(1,4)** | **B'** | B' | | | | ∞ | | | A'

## 1.4 Not-supersingular curves E/F<sub>2<sup>n</sup></sub>

By applying the same method as in point 1.3 we will be able to do this for the not supersingular curves.

Only this time we have different formulas:

### 1.4.1 Formulas

2P = ∞

1. z = x ⊕ (y ⊘ x)
2. 2P ≡ (x”,y”)
3. x” = z<sup>2</sup> ⊕ z ⊕ a
4. y” = x<sup>2</sup> ⊕ (z ⊗ x'') ⊕ x''

We can now calculate (x<sub>3</sub>, y<sub>3</sub>) = (x<sub>1</sub>, y<sub>1</sub>) ⊞ (x<sub>1</sub>, y<sub>1</sub>)

1. z = (y<sub>1</sub> ⊕ y<sub>2</sub>) ⊘ (x<sub>1</sub> ⊕ x<sub>2</sub>)
2. x3 = z<sup>2</sup> ⊕ z ⊕ x<sub>1</sub> ⊕ x<sub>2</sub> ⊕ a
3. y3 = z ⊗ (x<sub>1</sub> ⊕ x<sub>3</sub>) ⊕ x<sub>3</sub> ⊕ y<sub>1</sub>

### 1.4.2 Example

**Question: We have (E/F<sub>2<sup>3</sup></sub>), a=1, b=element 2, n is NOT equal to 1**

We can now calculate the points by E: y ⊗ (x ⊕ y) = x<sup>3</sup> ⊕ element 0 ⊗ x2 ⊕ element 2

Note: We are using the additive table here for the field F<sub>2<sup>3</sup></sub>

After solving this like we did in 1.3, we get the following result:

| | | | | | | | | |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **x** | 0 | 1 | 2 | 3 | 4 | 5 | 6 | ∞
| **x<sup>3</sup>** | 0 | 3 | 6 | 2 | 5 | 1 | 4 | ∞
| **0 ⊗ x<sup>2</sup>** | 0 | 2 | 4 | 6 | 1 | 3 | 5 | ∞
| **x<sup>3</sup> ⊕ 0 ⊗ x2 ⊕ 2** | 2 | 3 | 5 | 6 | 0 | 6 | 6 | 2
| **y** | 4 | 0 | 1 | | | | 1 | 1
| **y'** | 5 | 3 | 4 | | | 5 |

\#E = 10

And the points are:

* **A(0,4)** and **A'(0,5)**
* **B(6,1)** and **B'(6,5)**
* **C(1,0)** and **C'(1,3)**
* **D(2,1)** and **D'(2,4)**
* **O(∞,1)=O' --&gt; O ⊞ O' = ∞**

The same goes for the doubling of the points (2P), see 1.3 for this.

## 1.5 Cyclical group or not?

We can check if a group is cyclical by using the following methods:

* μ(#E)≠0, then (E/F<sub>q=p<sup>n</sup></sub>, ⊞) is cyclical
* μ(#E)=0, then we need to check this, check the methods 1.3 and 1.4 for this.