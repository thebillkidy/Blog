---
layout: post
current: post
cover: 'assets/images/covers/database.jpg'
navigation: True
title: Common Table Expression (CTE) - Part 3
date: 2015-06-05 18:41:00
tags: sql
class: post-template
subclass: 'post tag-sql'
author: xavier
---

## Analytical Functions

Analytical functions are brought into existence to solve the problems that we have with Aggregate functions. The biggest disadvantage of these Aggregate functions is that they always reduce the number of results, but what if we want to be able to perform functions on all our results based on the results? (think at ranking, row_number, top N problems, ...)

Here I will explain some of the Analytical function tricks that we can use to solve common problems.

Some of the database engine specific analytical functions:

* **rank()** : Returns a sequential number for the result set, this differs from row_number because this function gives duplicates the same number.
* **dense_rank()** : Does the same as rank(), only will it put gaps between the next result.
* **row_number()** : Returns a sequential number for the result set.
* **ntile(n)** : Distributes the result into groups, this returns the number to which the group belongs.

### The over() function

One of the things I have to explain first before we are able to show special queries is the usage of the over() function. The over() function will execute a reporting function over the complete table without the need of a GROUP BY statement. We can also specify a PARTITION BY to this over function, which is going to allow us to perform a GROUP BY on the OVER function.

More details to this can be found here: [http://docs.oracle.com/cd/B19306_01/server.102/b14200/functions001.htm](http://docs.oracle.com/cd/B19306_01/server.102/b14200/functions001.htm)

### MIN MAX problems (also called minimax)

Let's say that we have a table that holds the values of the language usages of a country. What if we want to get the maximum spoken languages from those countries, and then get the language that is spoken the least in that country?

This is a great problem to use a over function in. You just select the maximum usages, and then you can add for example a column that will put an X for the language that is spoken the least. To do this we use a case structure that checks if the max usage of a language is equal to the min usage over the whole result set of the max usages.

**Result:**

```sql
SELECT iso, max(usage),
  CASE
    WHEN MAX(usage) = MIN(MAX(usage)) OVER() THEN 'x' ELSE ' '
  END
FROM languageusage
WHERE hasc IN('BE', 'DE')
GROUP BY iso
```

**Our result after running the query:**

iso | usage | min(max(usages))
:-: | ----: | :--------------
kur| 0.0049998134397970222 |
ned| 0.60320897726154155 |
tur| 0.026367175354153453 |
fra| 0.33231617285165865 |
ita| 0.02480559110148637 |
sla| 0.0148750668507394 |
ara| 0.015848016537060736|
dui| 0.93813663669266079 |
poo| 0.0034948944691118493| X
spa| 0.0049217442661679302|
grn| 0.0045023195651903531|

### Creating order based on criteria

We want to be able to assign numbers based on some criteria.

**Example:** Select races, and assign a number based on:

* rownumber for each resort, sorted by racedate within resort
* rownumber for resort and racedate, sorted by resort, racedate (for all)
* rownumber for racedate, sorted by racedate (for all)

```sql
SELECT resort, racedate
, rank() over(partition by resort order by racedate) "rownr / resort"
, rank() over(order by resort, racedate) "rownr by resort and racedate"
, rank() over(order by racedate) "rownr by racedate"
FROM races
WHERE extract(year from racedate) = 2008
GROUP BY resort, racedate
ORDER BY resort, racedate
```

### Clipping

A rarely known technique for databases is called **Clipping**, clipping allows us to remove an extreme band of results from a result set. (For example, when we measured different points and we want to remove the extreme points from this resultset, then we can use clipping).

This is where ntile(n) comes in handy, we use it to divide our result set in groups, and then we select the groups that lie within boundaries.

**Example:** Let us select measure points of longitude and latitude, and we will remove the most extreme points.

Then the query becomes:

```sql
SELECT lev2, latitude, longitude,
  CASE 
    WHEN ntile(10) OVER (PARTITION BY lev2 ORDER BY latitude) BETWEEN 2 AND 9 
    THEN latitude 
  END x,
  CASE 
    WHEN ntile(10) OVER (PARTITION BY lev2 ORDER BY longitude) BETWEEN 2 AND 9 
    THEN longitude 
  END y
FROM cities
WHERE iso = 'BE'
AND lev2 IS NOT NULL
AND latitude IS NOT NULL
AND longitude IS NOT NULL;
```

### Simulating WIDTH_BUCKET

WIDTH_BUCKET is an oracle specific command that lets you construct equiwidth histograms, in which the histogram range is divided into intervals that have identical size. (More here: [https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions214.htm](https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions214.htm))

Since this is only in oracle we want to simulate this so we can use it in other database engines. To simulate this we can use the function CEIL together with the OVER functions.

So then this becomes:

```sql
SELECT ceil(row_number() OVER(ORDER BY ... ) / 5.0)
```

### Cumulative Total and Gliding Totals

If we want to be able to select the **cumulative total** of a resultset, then we can use this query:

```sql
SUM(points) OVER(ORDER BY points, name) AS cumul
```

However if we want to calculate the **gliding total**, then we need to use this:

```sql
SUM(points) OVER(ORDER BY date RANGE BETWEEN 90 PRECEDING AND CURRENT ROW) AS mov_average
```

## Combined Select Queries

With combined select queries we mean the joining of 2 different select queries with the use of special operators such as **union, union all, intersect, except, minus, ...**

&gt;One thing to note is that even though this is explained in this article, it is not recommended to be used. Combined Select Queries are a feature of the database engines but are mostly slower then **CTE's (Common Table Expressions)** that is why I recommend using those rather then the combined select queries. This is also the reason why this portion of the article is relatively slow compared to the rest.

### Union and Union ALL

The **union** operator will merge tables row by row but it will remove the duplicate rows. When we use **union all** then we will do the same as union, but this time we will include the duplicate rows.

**Example:**

```sql
SELECT hasc2, length
FROM boundaries
WHERE hasc1 = 'DE'
UNION ALL
SELECT hasc1, length
FROM boundaries
WHERE hasc2 = 'DE'
ORDER BY length
```

&gt; **Special Note:** If you are using a database engine that does not support the rollup and cube functions, then you can simulate those using the union operator.

### Intersect

The intersect operator will only keep the rows that the different queries have in common.

**Example:**

```sql
SELECT name,
  CASE
    WHEN MAX(SUM(points)) OVER(PARTITION BY gender, season) = SUM(points) THEN 'x'
    ELSE ' '
  END "result"
FROM Ranking
WHERE discipline IS NOT NULL
GROUP BY gender, season, name
  INTERSECT
SELECT name, 'X'
FROM competitors
WHERE nation = 'SWE'
```

### Except of minus (difference)

The except of minus operators will take the first query and they will remove every row that is the result from the other queries.

**Example:**

```sql
SELECT hasc, population, area
FROM regios
WHERE SUBSTR(hasc, 1, 2) = 'BE' AND level = 3
  EXCEPT
SELECT parent, SUM(population), SUM(area)
FROM regios
WHERE SUBSTR(hasc, 1, 2) = 'BE' AND level = 4
GROUP BY parent
```