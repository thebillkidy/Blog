---
layout: post
current: post
cover: 'assets/images/covers/database.jpg'
navigation: True
title: Common Table Expression (CTE) - Part 5
date: 2015-06-05 18:41:00
tags: sql
class: post-template
subclass: 'post tag-sql'
author: xavier
---

CTE's (Common Table Expressions) are mostly used when creating recursive queries, creating temporary views (instead of subqueries).

## Calculating the dates of easter

**Use case And Example:** We want to calculate the dates of when it is easter for the next hundred years.

**Solution:**
Since we are explaining examples in SQL we are not working on the math of these problems, that is why the variables to calculate the date of easter are given:

```sql
j = year - 1900
a = MOD(year - 1900, 19)
b = FLOOR((7 * a + 1) / 19)
c = MOD(11 * a + 4 - b, 29)
d = 25 - c - MOD9j + FLOOR(j / 4) + 31 - c, 7)
```

if d > 0, then d returns the day number in april, if d<=0 then (31 + d) returns the day in march for easter.

Another thing that we know is that the following recursive query returns all the years starting from 1900 until 2014:

```sql
SELECT 1899 + level
FROM dual
CONNECT BY level &lt;= 2014 - 1899
```

Now we need to connect those 2 queries together.

> The recursion part will come in a later article, so don't bother to much about it right now :D

**Query:**

```sql
WITH 
-- Get the years from 1900 - 2014
p AS (SELECT 1899 + level year
      FROM dual
      CONNECT BY level &lt;= 2014 - 1899 ),
-- Start filling in the formulas that were given, and connect them to each other
q AS (SELECT year, year - 1900 j, MOD(year - 1900, 19) a, FLOOR((7 * MOD(year - 1900, 19) + 1) / 19) b
      FROM p),
r AS (SELECT year, j, a, b, MOD(11 * a + 4 - b, 29) c
      FROM q),
s AS (SELECT year, 25 - c - MOD(j + FLOOR(j / 4) + 31 - c, 7) easter
      FROM r)
-- Add them to the date and be sure to add the easter date
SELECT year, TO_CHAR(TO_TIMESTAMP('01-04' || CAST(year AS CHAR(4)), 'DD-MM-RRRR') + easter - 1, 'DD-MM-YYYY') easter
FROM s
ORDER BY year;
```

## TOP N problem (with the use of the rank() function and CTE's)

**Use Case:** When we want to be able to return the top n results of a result set then we have several methods, now we can also do this with the rank function.

**Example:** We want to get the number of appearances for the elevations in the world, and then we want to get the top 10 most appearing elevations.

**Solution:** To solve this problem we will use a CTE and the rank function, the first CTE will get our result and the second will appoint a rank function to the first it's result. On the end it will then limit on the rank.

**Query:**

```sql
WITH x AS (
  SELECT elevation, COUNT(1) amount
  FROM cities
  WHERE elevation IS NOT NULL
  GROUP BY elevation
  ORDER BY amount DESC
),
y AS(
  SELECT elevation, amount, rank() over(order by amount desc) "rank"
  FROM x
)
SELECT elevation, amount FROM y WHERE "rank" <= 10
```

## Pivoting results, Removing NULL in between and only showing value for the first row.

**Use Case:** You want to display results horizontally instead of vertically, and you also want to remove NULL results in between.

**Example:** We need to select the results from a season and afterwards we need to make sure they are pivoted so that the top 3 are shown horizontally. 

**Solution:** We write a CTE that selects the results and assigns a rank to every one based on gender and discipline. Once we have that we are able to pivot them in the next CTE by using the CASE function. Here comes the trick, when we just use the case it will show NULL results for the other rows and we don't see the top 3 next to each other. 

Something like this:

| result1 | result2 | result3 |
| - | - | - |
| a | (null) | (null) |
| (null) | b | (null) |
| (null) | (null) | c |

Now we can solve this by using the MAX function on the result set, which will merge them into one row for us.

The second thing we want to do is to only show the season (which is a year), in the first row, and the same for the gender. We do this by assigning a ROW_NUMBER for the season, and a ROW_NUMBER for the genders, and only showing it when this is 1.

**Query:**

```sql
WITH x AS (
  SELECT season, gender, discipline, name, rank() over(partition by gender, discipline order by points) seq
  FROM ranking
  WHERE season = 2007
),
y AS (
  SELECT season, gender, discipline
    , MAX(CASE WHEN seq = 1 THEN name END) "1"
    , MAX(CASE WHEN seq = 2 THEN name END) "2"
    , MAX(CASE WHEN seq = 3 THEN name END) "3"
    , row_number() OVER(PARTITION BY season ORDER BY gender, discipline) row_season
    , row_number() OVER(PARTITION BY gender ORDER BY season, discipline) row_gender
  FROM x
  WHERE seq <= 3
  GROUP BY season, gender, discipline
  ORDER BY season, gender, discipline
)
SELECT
  CASE WHEN row_season = 1 THEN TO_CHAR(season) ELSE ' ' END "SEASON"
  , CASE WHEN row_gender = 1 THEN TO_CHAR(gender) ELSE ' ' END "GEN"
  , discipline
  , "1"
  , "2"
  , "3"
FROM y
```

**Query2:**

```sql
WITH x AS (
  SELECT hasc1 hasc, hasc2 hasc2, length 
  FROM grenzen
  WHERE hasc1 IN('BE', 'NL', 'FR', 'DE', 'LU') 
    UNION
  SELECT hasc2 hasc, hasc1 hasc2, length
  FROM grenzen
  WHERE hasc2 IN('BE', 'NL', 'FR', 'DE', 'LU')
),
y AS (
  SELECT x.hasc hasc, x.length length, re.name name, row_number() OVER(PARTITION BY x.hasc ORDER BY length DESC) "rw"
  FROM x x
    JOIN regios re ON x.hasc2 = re.hasc
)
SELECT 
  MAX(CASE WHEN hasc = 'BE' THEN TO_CHAR(name) || '(' || length || ')' ELSE ' ' END) "BE"
  , MAX(CASE WHEN hasc = 'NL' THEN TO_CHAR(name) || '(' || length || ')' ELSE ' ' END) "NL"
  , MAX(CASE WHEN hasc = 'FR' THEN TO_CHAR(name) || '(' || length || ')' ELSE ' ' END) "FR"
  , MAX(CASE WHEN hasc = 'DE' THEN TO_CHAR(name) || '(' || length || ')' ELSE ' ' END) "DE"
  , MAX(CASE WHEN hasc = 'LU' THEN TO_CHAR(name) || '(' || length || ')' ELSE ' ' END) "LU"
FROM y
GROUP BY "rw"
ORDER BY "rw"
```