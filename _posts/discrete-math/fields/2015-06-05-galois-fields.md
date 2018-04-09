---
layout: post
current: post
cover: 'assets/images/covers/algorithms.jpg'
navigation: True
title: Fields - Galois Fields
date: 2015-06-05 18:41:00
tags: discrete-math
class: post-template
subclass: 'post tag-discrete-math'
author: xavier
---

# 1 Galois Fields

## 1.1 Construction of Galois Fields

A Galois field has a finite amount of numbers and is written as GF(q) or F<sub>q</sub>. Where q = p<sup>n</sup>.

When knowing all this we can now construct a Galois Field with n dimensions and p elements.

**Example:**

When we want to construct the galois field of F<sub>49</sub> then we know that p = 7 and n = 2. Which means that we have 2 dimensions and 7 elements (elements ranging from 0 to 6). So to construct this we will need a grid the exists out of p<sup>n</sup> elements. Like this:

$$
\begin{matrix}
(0,0) &amp; (1,0) &amp; (2,0) &amp; (3,0) &amp; (4,0) &amp; (5,0) &amp; (6,0) \newline
(0,1) &amp; (1,1) &amp; (2,1) &amp; (3,1) &amp; (4,1) &amp; (5,1) &amp; (6,1) \newline
(0,2) &amp; (1,2) &amp; (2,2) &amp; (3,2) &amp; (4,2) &amp; (5,2) &amp; (6,2) \newline
(0,3) &amp; (1,3) &amp; (2,3) &amp; (3,3) &amp; (4,3) &amp; (5,3) &amp; (6,3) \newline
(0,4) &amp; (1,4) &amp; (2,4) &amp; (3,4) &amp; (4,4) &amp; (5,4) &amp; (6,4) \newline
(0,5) &amp; (1,5) &amp; (2,5) &amp; (3,5) &amp; (4,5) &amp; (5,5) &amp; (6,5) \newline
(0,6) &amp; (1,6) &amp; (2,6) &amp; (3,6) &amp; (4,6) &amp; (5,6) &amp; (6,6) \newline
\end{matrix}
$$

Of course, when n &gt; 2 then we are not able to write this as a grid, but we do now the elements that are in our field.

Now because our field construction is defined as (F<sub>q</sub>, ⊕, ⊗) we need to have an additive interaction and a multiplicative interaction.

Our additive interaction is being done by executing the additive operations **mod p** for every dimension.

The multiplicative interaction needs to have a polynomial at every grid point with grade &lt; n

If we apply this on our field that we calculated then we get:

$$
\begin{matrix}
0 &amp; x &amp; 2x &amp; 3x &amp; 4x &amp; 5x &amp; 6x \newline
1 &amp; x+1 &amp; 2x+1 &amp; 3x+1 &amp; 4x+1 &amp; 5x+1 &amp; 6x+1 \newline
2 &amp; x+2 &amp; 2x+2 &amp; 3x+2 &amp; 4x+2 &amp; 5x+2 &amp; 6x+2 \newline
3 &amp; x+3 &amp; 2x+3 &amp; 3x+3 &amp; 4x+3 &amp; 5x+3 &amp; 6x+3 \newline
4 &amp; x+4 &amp; 2x+4 &amp; 3x+4 &amp; 4x+4 &amp; 5x+4 &amp; 6x+4 \newline
5 &amp; x+5 &amp; 2x+5 &amp; 3x+5 &amp; 4x+5 &amp; 5x+5 &amp; 6x+5 \newline
6 &amp; x+6 &amp; 2x+6 &amp; 3x+6 &amp; 4x+6 &amp; 5x+6 &amp; 6x+6
\end{matrix}
$$

## 1.2 Calculating with polynomials

### 1.2.1 Multiplying Polynomials

The multiplication is written as: polynomial 1 ⊗ polynomial 2. To perform this multiplication, we do the same as we would do with for example: (2x + 2) * (4x + 3). But this time, we do modulo our prime on the end!

__Example:__ 123x<sup>4</sup>+76x<sup>2</sup>+7x+4 ⊗ 196x<sup>4</sup>+12x<sup>3</sup>+225x<sup>2</sup>+4x+76 %251 for prime = 251

![multiplying_polynomials](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPbkdTWHF2M0luT0U)

Here we can see that the result:
$$12x^2+221x^7+152x^6+15x^5+208x^4+170x^3+178x^2+46x+53$$

### 1.2.2 Dividing Polynomials

Dividing polynomials is also easy, but we have to pay attention. If the coefficient of the divisor it's head grade = 1 then we can do a normal division like we saw when we were 12 years old (we just use some bigger numbers now).

#### 1.2.2.1 Head grade divisor is 1

__Example:__ 12x<sup>8</sup>+221x<sup>7</sup>+152x<sup>6</sup>+25x<sup>5</sup>+208x<sup>4</sup>+117x<sup>3</sup>+150x<sup>2</sup>+30x+53 / x<sup>5</sup>+x<sup>4</sup>+12x<sup>3</sup>+9x<sup>2</sup>+7

![dividing_polynomials](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPT0Q5Z1VCT3dLOTQ)

This results into:
$$12x^3+209x^2+50x+120 \otimes x^5+x^4+12x^3+9x^2+7 \oplus 117x^4+151x^3+117x^2+182x+217 \text{ mod 251}$$

which is just the result multiplied by the divisor and the remainder added to it.

#### 1.2.2.2 Head grade divisor &gt; 1

If the head grade &gt; 1, then we have to multiply both the divisor and the polynomal by (head grade) ^ -1 mod p

So this means if we got this division:
$$12x^8+221x^7+152x^6+25x^5+208x^4+117x^3+150x^2+30x+53 / 3x^5+x^4+12x^3+9x^2+7$$

becomes

$$4x^8+241x^7+218x^6+92x^5+153x^4+39x^3+50x^2+10x+185 / x^5+84x^4+4x^3+3x^2+86$$

On the end we just have to remultiply the remainder by the head coeficient of the divisor, and then we got our result

Steps executed:
![dividing_polynomials_2](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPa2k3UThHR19VcUE)

### 1.2.3 The Euclidean Algorithm For Polynomials

The euclidean algorithm was already explained in the first post for discrete math [http://desple.com/post/104343618742/discrete-math-fields-prime-fields-part-1](http://desple.com/post/104343618742/discrete-math-fields-prime-fields-part-1) and we are now able to do this with polynomials too.

## 1.3 Group Tables

We got 2 different group tables, the additive group table and the multiplicative. We will first start by constructing the additive group table since this is the easiest one. To construct this we follow these steps:

1. Find the elements belonging to the GF being given (Write only the coefficients, easier to calculate with)
2. When we found the elements, create a table with the X and Y values being the elements from the GF
3. Now we calculate the sum of the X and Y values and fill in our table

&gt; **Note:** When filling in the table, don't forget that we are working **mod p**

**Example:** We will create the additive table for GF(27)

**Basics of the GF:**
GF(27), p = 3, n = 3, q = 27

**1) Elements**

Complete List:

$$
\begin{matrix}
0 &amp; 1 &amp; 2 &amp; x &amp; x+1 &amp; x+2 &amp; 2x &amp; 2x+1 &amp; 2x+2 \newline
x^2 &amp; x^2+1 &amp; x^2+2 &amp; x^2+x &amp; x^2+x+1 &amp; x^2+x+2 &amp; x^2+2x &amp; x^2+2x+1 &amp; x^2+2x+2 \newline
2x^2 &amp; 2x^2+1 &amp; 2x^2+2 &amp; 2x^2+x &amp; 2x^2+x+1 &amp; 2x^2+x+2 &amp; 2x^2+2x &amp; 2x^2+2x+1 &amp; 2x^2+2x+2
\end{matrix}
$$

Just the coefficients:

$$
\begin{matrix}
0 &amp; 1 &amp; 2 &amp; 10 &amp; 11 &amp; 12 &amp; 20 &amp; 21 &amp; 22 \newline
100 &amp; 101 &amp; 102 &amp; 110 &amp; 111 &amp; 112 &amp; 120 &amp; 121 &amp; 122 \newline
200 &amp; 201 &amp; 202 &amp; 210 &amp; 211 &amp; 212 &amp; 220 &amp; 221 &amp; 222
\end{matrix}
$$

**2) &amp; 3) Create table with X and Y as the elements, and calculate MOD P**

![galois_field_27](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPOEEwZDN4YVN4aW8)

If we now want to calculate the multiplicative field, then we just need to add a 0 column and a 0 row in the beginning and then we have our multiplicative result:

![galois_field27_multiplicative](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPZmdzNVB3dU1lV0E)

## 1.4 irreducible Polynomials

### 1.4.1 Number of irreducible Polynomials

We know that there are p<sup>n</sup> amount of monic polynomials. By using the Mobius Inversion, we can calculate how many there are irreducible.

$$
\frac{1}{n} \sum_{d|n} \mu() * p^{\frac{n}{d}}
$$

**Example:** How many polynomials are irreducible for (F<sub>6<sup>6</sup></sub>, ⊕, ⊗)

$$
\frac{6^6 - 6^3 - 6^2 + 6}{6} = 7735
$$

Which means that there are 7735 of the 46656 polynomials that are irreducible for the prime 6 with grade 6

### 1.4.2 Checking if a Polynomial is irreducible

To check if a Polynomial is irreducible, we have to check if it has not common factors mod p with the polynomials of x<sup>p<sup>i</sup></sup> - x, for every i &lt;=n / 2

Some examples for checking:

* **F<sub>p<sup>2</sup></sub>**: check x<sup>p</sup> - x
* **F<sub>p<sup>3</sup></sub>**: check x<sup>p</sup> - x
* **F<sub>p<sup>4</sup></sub>**: check x<sup>p</sup> - x and x<sup>p<sup>2</sup></sup>
* **F<sub>p<sup>5</sup></sub>**: check x<sup>p</sup> - x and x<sup>p<sup>2</sup></sup>
* **F<sub>p<sup>6</sup></sub>**: check x<sup>p</sup> - x , x<sup>p<sup>2</sup></sup> and x<sup>p<sup>3</sup></sup>
* **F<sub>p<sup>7</sup></sub>**: check x<sup>p</sup> - x , x<sup>p<sup>2</sup></sup> and x<sup>p<sup>3</sup></sup>

&gt; **Note:** We wrote - everywhere, this is correct since we still have to do **mod p** afterwards. So this could become + if we would do this for for p = 2 (since -1 mod 2 = +1)!

**Example:** Find an irreducible polynomial with n = 7 for F<sub>128</sub>

128 ==&gt; p = 2, n = 7

Since n = 7, we know that we have to check for x<sup>2</sup> + 1, x<sup>4</sup> + 1 and x<sup>8</sup> + 1

Now we pick a polynomial that could be irreducibel and is monic. For example: x<sup>7</sup> + x<sup>2</sup> + 1

To check if this is irreducibel, we need to be sure this polynomial can not be divided by the 3 checks that we have placed. We check this by using the Euclidean algorithm and the dividing of Polynomials.

![check_irreducible](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPV1lkTlJXRDR5bGM)

&gt; A lot of irreducible polynomials have been found, we can find those in the FIPS 186 standard ([FIPS186-1](http://csrc.nist.gov/publications/fips/fips1861.pdf), [FIPS186-2](http://csrc.nist.gov/publications/fips/archive/fips186-2/fips186-2.pdf), [FIPS186-3](http://csrc.nist.gov/publications/fips/fips186-3/fips_186-3.pdf), [FIPS186-4](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf))

## 1.5 Primitive Elements

If we found an Irreducible Polynomial, then we have to find a primitive element ω of the multiplicative group. We can do this by using the method that I explained in my first blog post about Discrete math [http://desple.com/post/104343618742/discrete-math-fields-prime-fields-part-1](http://desple.com/post/104343618742/discrete-math-fields-prime-fields-part-1)

I also refer to this post for finding the discrete logarithm for an index of a primitive root using the baby-step giant-step method.

## 1.6 Inverse Elements

We can calculate the inverse of an element using the Euclidean Algorithm.

**Example:** (x<sup>4</sup>+x<sup>3</sup>+x<sup>2</sup>)<sup>-1</sup>

![inverse_elements](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPSXhwa25wbGdWX3M)

Following the solution above, we can see that the inverse is equal to: x<sup>6</sup> + x<sup>3</sup> + x<sup>2</sup>

## 1.7 Calculating with indices

### 1.7.1 Method

To perform caslculations in Finite fields we have to choose between 2 methods

* We identify the coordinates in a n-dimensional grid for the polynomial with grade &lt; n
* **Advantage:** Additive Calculation are just additions mod p
* **Disadvantage:** Multiplicative Calculations require inverse elements and are therefor harder
* We identify the elements by comparing it's index to a primitive element ω (ω is randomly chosen)
* **Advantage:** We simplify multiplicative calculations to 1 additive calculations modulo(q - 1)
* **Disadvantage:** Additive Calculations are harder, but we can still perform them if we have a list of all it's elements en their indices and we have an additive group table where the elements are identified by it's indices)

### 1.7.2 Constructing the needed additive group table

1. Calculate 1 row by using the list of all the elements and their indices. (Easiest on row index = 0)
2. Calculate the following rows by doing the previous cel +1 mod (q-1) and shift 1 position

**Example:** Calculate the group table for F<sub>4</sub>, μ=x2+x+1 and ω=x

**1)** Calculate the elements in this group (see 1.1)
F<sub>4 = 2<sup>2</sup></sub>, so 4 elements. These elements are:

$$
\begin{matrix}
0 &amp; 1 \newline
1 &amp; x + 1
\end{matrix}
$$

**2)** Assign indices to every element and put them as the x and y value for the table (or more dimensions if n &gt; 2) (**Note:** if element is 0, then indice is ∞! (This is because an element with itsself will return 0 after modulo))

I wrote the x and y indices in bold.

||⊕|**0**|**1**|**2**|**∞**|
| :-: | :-: | :---: | :---: | :---: | :---: |
|1|**0**|
|x|**1**|
|x+1|**2**|
|0|**∞**|

**3)** Once we found the indices, we can just do the addition for the elements

For the first row this becomes:

* indice 0 and 0 = ∞, same indices is ∞)
* indice 1 and indice 0 = 1 + x = x + 1 = indice 2
* indice 2 and indice 0 = x + 1 + 1 = x + 2 = x (since modulo 2) = indice 1
* indice ∞ and indice 0 = 0 + 1 = 1 = indice 0

||⊕|**0**|**1**|**2**|**∞**|
| :-: | :-: | :---: | :---: | :---: | :---: |
|1|**0**|∞|2|1|0
|x|**1**|2|∞|0|1
|x+1|**2**|1|0|∞|2
|0|**∞**|0|1|2|∞

### 1.7.3 Constructing the needed multiplicative table

We do the same steps as the method for constructing the additive group, only this time we will do a multiplicative operation instead of an additive

**Example:** Multiplicative table for F&gt;sub&gt;4, μ=x2+x+1 and ω=x

**1)** Calculate the elements in this group (see 1.1)
F<sub>4 = 2<sup>2</sup></sub>, so 4 elements. These elements are:

$$
\begin{matrix}
0 &amp; 1 \newline
1 &amp; x + 1
\end{matrix}
$$

**2)** Once we found the indices (See step 2 for the additive group table in 1.7.2), we can just do the multiplication for the elements

For the first row this becomes:

||⊕|**0**|**1**|**2**|**∞**|
| :-: | :-: | :---: | :---: | :---: | :---: |
|1|**0**|0|1|2|∞
|x|**1**|1|0|0|∞
|x+1|**2**|2|0|0|∞
|0|**∞**|∞|∞|∞|∞

&gt; We can clearly see that we got more 0's in this table. This is because when we multiply the indices together, and we get a value that is not in our table. Then we write ∞

## Concluding

There is only a field with order q if q is the power of a prime number!

But how can we find finite cyclical groups where we can write the number of elements as p<sup>n</sup> - 1?

This solution will be provided in part 3