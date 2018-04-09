---
layout: post
current: post
cover: 'assets/images/covers/algorithms.jpg'
navigation: True
title: Fields - Prime Fields
date: 2015-06-05 12:00:02
tags: discrete-math
class: post-template
subclass: 'post tag-discrete-math'
author: xavier
---

This post is about the discrete math that is being taught at the University Ghent for people attending the Bridge program to Master Of Science in Industrial Engineering (IT).

In this program we learned about 3 specific sub-groups of Discrete Mathematics:

* Fields
* Graphs
* Groups

In this post I will summarise the most important exercises that we learned and I will explain on how to solve them.

## 1.0 Fields
A field is a collection of elements that interact with each other through interaction by ⊕ or ⊖. These 2 symbols stand for additive and multiplicative interactions.

Field Axioms:

* (F, ⊕) : Additive group, with neutral element ⦶ (the zero element)
* (F\\⦶, ⊖) : Multiplicative group with neutral element 1 (base element)

We can create those finite fields with 1 of the 2 methods:

### 1.1 Prime Fields
__Prime Fields (ℤp,+,.):__ ) Creates a field with the zero element __0__ and the base element __1__, but __p__ has to be a prime number!

* __(ℤp\0,+,.)__ cyclic group __if__ p is prime
* __(ℤ12,+,.)__ not a field, because (ℤ12\0,.) is not a group

We can dissolve every integer as a product of powers of prime factors. Do note that we can do this by hand but that this gets harder for bigger numbers, that is why we mostly write programs to do this for us.

Prime numbers are used in many ways in Discrete Math, some of the problems we can solve using prime numbers are: calculating the Euler φ, Galois Field orders, … These examples will be shown later.

&gt; 1. __Prime Numbers:__ This are numbers that we can only divide by 1 and itself. (Example: 3, 1, 11, …)
&gt; 2. __Axioms:__ Is something that is not proven, but it is generally accepted.

### 1.1.2 Euclidean Algorithm
#### 1.1.2.1 Calculating the GCD (Greatest Common Divisor) and LCM (Least Common Multiple)
When we know the prime factors of the 2 given integers X and Y then it is easy to calculate the GCD and the LCM.

$$gcd(x, y) * lcm(x, y) = x * y$$

##### 1.1.2.1.1 GCD
The Greatest Common Divisor of 2 or more integers is found when we can divide the largest positive integer (both of the integers are &gt; 0) by the other numbers without a remainder. Example: GCD(8, 12) = 4

If the gcd(x, y) = 1 then the number is a __relative prime__.

When we apply this to our prime factors, then this means that we want to get the smallest exponents that appear in both X and Y.

__Example:__ Calculate the GCD of 792 and 2420.
1) Find the prime factors:
$$792 = 2 * 2 * 2 * 3 * 3 * 11 = 2^3 * 3^2 * 11$$
$$2420 = 2 * 2 * 5 * 11 * 11 = 2^2 * 5 * 11^2$$

2) Find the smallest exponents and numbers that appear in both the prime factors:
$$2^2*11$$

==&gt; This is your GCD

##### 1.1.2.1.2 LCM
The Least Common Multiple works the same was as the GCD, only do we now find the biggest exponents in the prime factors that appear in X and/or Y.

__Example:__ Calculate the LCM of 792 and 2420.
1) Find the prime factors:
$$792 = 2 * 2 * 2 * 3 * 3 * 11 = 2^3 * 3^2 * 11$$
$$2420 = 2 * 2 * 5 * 11 * 11 = 2^2 * 5 * 11^2$$

2) Find the biggest exponents in the numbers, and get all of them
$$2^3 * 3^2 * 5 * 11^2 = 43560$$

==&gt; This is your LCM

#### 1.1.2.2 Calculating the GCD and LCM with the Euclidian Algorithm
The Euclidian Algorithm can also be used to calculate the GCD and LCM. This algorithm works by performing a remainder division, after we did this we then get the gcd on the right bottom (if remainder = 0), or on the left bottom (if the remained &gt; 0).

__Example:__ 99 / 84 with the use of the euclidean algorithm.

X | | Y | Comment
- | - | -- | -------
99 | | |
84 | 1 | 84 |
- ---| | | (99 - 84) = 15
15 | 5 | 75 |
| |- ----| (84 - 75) = 9
9 | 1 | 9 |
- ---| | | (15 - 9) = 6
6 | 1 | 6 |
| |- ----| (9 - 6) = 3
6 | 2 | 3 |
- ---| | | (6 - 6) = 0
0 | | |

==&gt; Remainder is 0, so the right bottom is the GCD = 3

==&gt; Our LCM = (99 * 84) / 3 = 2772

__Example 2:__ calculate the LCM and the GCD of 792 and 2420 using the Euclidean Algorithm

==&gt; After performing the steps described above we get that GCD = 44

==&gt; LCM = (792 * 2420) / 44 = 43560

#### 1.1.2.3 The Extended Euclidean Algorithm
The extended Euclidean algorithm allows us to check our calculations and if our GCD(x, y) = 1, then the extended euclidean algorithm allows us to calculate (1 / x) % y efficiently.

__steps:__

1. Write out the basic algorithm
2. Add 3 columns to the right of the basic algorithm. In the center column write your result of the middle column of the basic algorithm. Now write 1 in the top left and 0 as the second number on the right. Now perform the basic algorithm with these numbers multiplying them with the numbers in the middle column. Keep doing this till you are on the same line as your last number in the middle column.
3. Do the same as step 2 but this time use 0 in the top left and 1 as the second number.

__Example:__ Find the gcd, lcm and the result for 53-1 % 97

__Step 1:__

![extended euclidean algorithm](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPTXZBZW4tUldvR0k)

__Step 2:__

![extended euclidean algorithm](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPYUh0OTFCTE1uZjg)

__Result:__

![extended euclidean algorithm](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPYi1rSEt4RU5Da2M)

Here we can see that the inverse of 53 modulo 97 is equal to 11.

#### 1.1.2.4 Chain Divisions
Chain divisions allow us to write square roots as big divisions so that they near this square root. This algorithm is also based on the Euclidean algorithm, but only a bit modified. So we will simplify it.

$$\sqrt[3]{10} \simeq \frac{105033}{48752} $$

To calculate this in a long division, we keep repeating these steps:

1. Get the number before the . (write this down)
2. Do our original number minus this number
3. Inverse the resulting number
4. Repeat from step 1

__Example:__ 10^(1/3)

Remainder | Result (of the inverse, first result is our square root!)
:-------: | :-----
| 2.154434690
2 | 6.475229108
6 | 2.10424821
2 | 9.592490815
9 | 1.687789876
1 | 1.453932421
1 | 2.202971088
2 | 4.926810069
4 | 1.078969719
1 | 12.66308162
… | …

and we can continue doing this till infinity. the more numbers we calculate, the closer we will get to the square root.

To get this into the form that we need to see our square root we now just have to write them as a division of (1 / next) + remained

For the root that we calculated above this will be (ending with a 1 / 1):

$$\frac{1}{\frac{1}{\frac{1}{\frac{1}{\frac{1}{\frac{1}{\frac{1}{\frac{1}{4\frac{1}{1} + 1} + } + 2} + 1} + 1} + 9} + 2} + 6} + 2$$

### 1.1.3 Multiplicative Functions
#### 1.1.3.1 The Euler φ
The Euler Phi will calculate how many numbers (for y &lt; x) the GCD = 1 Too calculate this we need to have the prime factoring, after we have the prime factor we can write the Euler Phi as the product of the fractions of the primes divided by the prime - 1 and afterwards multiplied by the number to calculate $$\varphi(n)=n\prod_{p|n}\left(1-\frac{1}{p}\right)$$ __Example: 1__ Euler Phi of 90 $$\varphi(90) = \varphi(2 * 3^2 * 5) = 90 * \frac{1}{2} * \frac{2}{3} * \frac{4}{5} = 24$$ __Example: 1__ Euler Phi of 21560 $$\varphi(21560) = \varphi(2^3 * 5 * 7^2 * 11) = 21560 * \frac{1}{2} * \frac{4}{5} * \frac{6}{7} * \frac{10}{11} = 6720$$ #### 1.1.3.2 Möbius μ ##### 1.1.3.2.1 Introduction The Möbius μ can have the numbers {-1, 0, 1} depending on the factorisation of the prime factors. μ(n) = 1 if n has an even amount of prime factors μ(n) = -1 if n has an odd amount of prime factors μ(n) = 0 if the number has a squared prime factor __Examples:__ μ(21) = μ(3 x 7) ==&gt; even number, so μ(21) = 1

μ(20) = μ(22 x 5) ==&gt; squared prime factor, so μ(20) = 0

μ(83) = μ(83) ==&gt; odd number, so μ(83) = -1

μ(30) = μ(2 x 3 x 5) ==&gt; odd, so μ(30) = -1

##### 1.1.3.2.2 Möbius Inversion
We can also use the μ function to calculate the Euler Phi, herefor we need to find all the dividors (d) first and then multiple them all together with the use of the Möbius function.

$$\varphi(90) = \mu(d) * \frac{x}{d}$$

__Example:__ Euler Phi of 90 With Möbius

$$\varphi(90) = 1, 2, 3, 5, 6, 10, 15, 30 = \mu(1) * \frac{90}{1} + \mu(2) * \frac{90}{2} + \mu(3) * \frac{90}{3} + \mu(5) * \frac{90}{5} + \mu(6) * \frac{90}{6} + \mu(10) * \frac{90}{10} +\mu(15) * \frac{90}{15} + \mu(30) * \frac{90}{30} = 24$$

#### 1.1.3.3 Legendre Symbol
The Legendre Symbol (x|p), also has {1, -1, 0} as a result.

$$
\left(\frac{x}{p}\right) =
\begin{cases}
1 &amp; \text{ if } x \text{ is a quadratic residue modulo } p \text{ and } x \not\equiv 0\pmod{p} \\ \newline
-1 &amp; \text{ if } x \text{ is a quadratic non-residue modulo } p \\ \newline
0 &amp; \text{ if } x \equiv 0 \pmod{p}.
\end{cases}
$$

### 1.1.4 Primitive Roots (modulo n)
Every integer a where the order modulo n is equal to φ(n) is a primitive root modulo n. If this is true, then a is a generator of the multiplicative group (ℤp\0,.).

This group of a prime field has exactly φ(p - 1) primitive roots

If we take p as a prime, then b is a primitive root for p if the powers of b (1, b, b2, n3, …) include all of the residue classes modulo p (except 0).

Imagine that we need to find the primitive root for 601, then we need to try 601 numbers to see if we get them all, this would be a lot of work but luckily we can test this faster.

A general method of testing if we got a primitive root is to check x to the power of every divisor of (p - 1) (modulo p). If only the last number results into 1, then this is a primitive root. Else it is not.

To find all those divisors, you just have to find the prime factorization of (p - 1) and then let those numbers interact with each other.

__Example 1:__ Primitive root of p = 7
If p = 7, 3 is a primitive root for p, because the powers of 3 are: 1, 3, 2, 6, 4, 5 (It generates every number for the prime except the prime itself and 0).

__Example 2:__ Primitive root of p = 7
If p = 7, then 2 is NOT a primitive root for p, because the powers of 2 are: 1, 2, 4, 1, 2, 4, 1, 2, 4, … which is missing the values 3, 5 and 6.

__Example 3:__ Primitive root of p = 601
Prime factors: 23, 3, 52
Factors:

$$
\begin{array}{lcr}
x &amp; x^3 &amp; x^5 &amp; x^{25} &amp; x^{3 * 25} &amp; x^{3 * 5} \newline
x^2 &amp; x^{2 * 3} &amp; x^{2 * 5} &amp; x^{2 * 25} &amp; x^{3 * 2 * 25} &amp; x^{3 * 5 * 2} \newline
x^4 &amp; x^{4 * 3} &amp; x^{4 * 5} &amp; x^{4 * 25} &amp; x^{3 * 4 * 25} &amp; x^{3 * 5 * 4} \newline
x^8 &amp; x^{8 * 3} &amp; x^{8 * 5} &amp; x^{8 * 25} &amp; x^{3 * 8 * 25} &amp; x^{3 * 5 * 8} \newline
\end{array}$$

Now we just need to let x vary from 1 -&gt; 600 and increment by 1. And as soon as we get a 1 as the last number (last number = p - 1), then we got a primitive root.

![primitive_root_7](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPeGVTa2ZDLWMzcms)

__Conclusion:__ Here we find that for **x = 7** we get 1, which means that this is a primitive root.

&gt; Excel will not be able to solve this completely due to the upper limit being placed on the modulo function. More info here: [http://support.microsoft.com/kb/119083](http://support.microsoft.com/kb/119083)

### 1.1.5 Discrete Logarithms
A discrete logarithm will allow you to solve the equation:
$$
\newcommand{\Mod}[1]{\ (\text{mod}\ #1)}
ω^k \Mod{p} = x
$$

where ω and x are elements of a finite group.

#### Naive method
When we are given a prime (p), a primitive root (ω) and the result of ωk % p (x) then we can calculate the integer k by iterating over the group by using this formula:
$$\newcommand{\Mod}[1]{\ (\text{mod}\ #1)}
\sum_{k=1}^{p - 1} ω^{k} \Mod{p}$$

We call this the naive method because who wants to loop through every element for a primitive root? (image having to do this for the prime number 9973, then we would need to go through 9973 indexes). That is why we have a great algorithm for this, called the baby-step giant-step method.

#### The baby-step giant-step method
You will be able to perform this method for p &lt; 1040 which is fine for us in these exercises. (else search after the Polhlig-Hellman method).

To perform this algorithm, we have to follow these steps:

1. Calculate the first row, the number of elements in the row = square root prime, the element = ωk % p
2. Find the inverse value for the last value in the row that we calculated.
3. Create a column that starts with the index k given, then calculate the following elements in that column by doing the previous value * inverse value % p.
4. Repeat step 3 till we encounter a value that also appears in the row that we calculated, this value is the one we need.

__Example:__ Calculate the index of 4 for : ω = 5 in ℤ97

From this question we can derive that k = 4, ω = 5 and p = 97

Now we calculate our first row till the square root of 97 (which is 10 rounded, so we need 10 values)

![grand_step_baby_step](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPUFlsTXh2dlpPNjA)