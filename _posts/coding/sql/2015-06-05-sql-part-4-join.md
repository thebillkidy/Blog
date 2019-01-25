---
layout: post
current: post
cover: 'assets/images/covers/database.jpg'
navigation: True
title: SQL - Part 4 - JOIN + Simulating Functions
date: 2015-06-05 10:00:03
tags: coding coding-sql
class: post-template
subclass: 'post tag-sql'
author: xavier
---

When creating JOIN queries in SQL we have to realize that we are going to combine every result from the result set with the result set itself. This means that we are going to create a new result set that is the size of the power of 2 of our original result set. (So if we have 1468 records, and we join it with itself, then we will get 2155024 records = 1468^2)

This is why it is a bad idea to use JOIN queries, however sometimes we have no other choice or our database engine does not support the better alternatives, and then we fall back to JOIN queries.

A better alternative when possible is to use CTE's (Common Table Expressions), this is supported in both MSSQL and Oracle SQL

## Get the number of alternatives for a specific result

**Use case:** We want to get alternatives for a specific result that we found, but we can not use a ranking function and we want to solve this with a join.

**Example:** Our result contains the name, nation and the altitude of SKI resorts, we want to find other ski resorts in the same nation but that have an altitude that is equal to or higher then the current one.

**Solution:** To solve this, we just need to join and add our restrictions in that join. Which means that we have a restriction that the other resorts should be higher or equal, they should have another name but the nation should be the same

**Query:**

```sql
SELECT r1.name, r1.nation, COUNT(1) amount
FROM resorts r1
JOIN resorts r2 ON
r1.name <> r2.name
AND r1.nation = r2.nation
AND r1.finishaltitude <= r2.finishaltitude
GROUP BY r1.name, r1.nation
ORDER BY r1.nation, amount
```

## Produce combinations of 2 results based on criteria

**Use case:** When you want to combine 2 result with each other based on several criteria, then we can use a JOIN query to.

**Example:** We have competitors and a ranking for the competitors. Our question is, how do we create a result that combines 2 competitors with each other with the following criteria:

* They have points in a different discipline (table ranking, column discipline)
* They are born in the same year (table competitors, column birthdate)
* Their age difference is not more than 1 month (table competitors, column birthdate)
* They are both born before 1974 (table competitors, column birthdate)
* They both have a ranking in season 2006 (table ranking, column season))
* We have a combination of a women and a man (table competitors, gender and table ranking, column gender

**Solution:** We first need 2 rankings, so we join the rankings with each other and make sure that the disciplines are different, the gender of the ranking table is different and the CID is smaller then.

Once we have that we can say, join competitor c1 on the first ranking result, just by the cid column. And join competitors c2 on the second ranking result with the criteria that it has the same birthdate as competitor 1.

In our where we then check if the season is correct, that the months between are also smaller then 1 and that they are born before 1974.

**Query:**

```sql
SELECT distinct c1.name, to_char(c1.birthdate, 'DD-MON-YYYY') bday1, c2.name, to_char(c2.birthdate, 'DD-MON-YYYY') bday2
FROM ranking r1
  JOIN ranking r2 ON r1.cid < r2.cid AND r1.gender <> r2.gender AND r1.discipline <> r2.discipline
  JOIN competitors c1 ON r1.cid = c1.cid
  JOIN competitors c2 ON c2.cid = r2.cid
    AND EXTRACT(year FROM c1.birthdate) = EXTRACT(year FROM c2.birthdate) -- Same year born
WHERE r1.season = 2006
  AND r2.season = 2006
  AND ABS(MONTHS_BETWEEN(c1.birthdate, c2.birthdate)) <= 1
  AND EXTRACT(year FROM c1.birthdate) < 1974
ORDER BY c1.name, c2.name;
```

## TOP N problem

**Use case:** Let's say you want to get the TOP N of a specific result set, this can be done by using the ranking function, but again this function is not available in the database engine that you are using. This is where we again will use a JOIN query to solve this problem.

**Example:** We need to get the top 5 heaviest men and women from a list of competitors, and this in separate columns.

**Solution:** To create our solution, we have to combine the competitors on their own, but only select the competitors that weigh less then our current competitor. You can see this as a ranking simulation where we give a number 1 to the heaviest person and then decrease the number. Then on the end we just add a HAVING clause that checks for 5 results.

**Query:**

```sql
SELECT c1.name
, (CASE WHEN c1.gender = 'M' THEN TO_CHAR(c1.weight) ELSE ' ' END) MEN
, (CASE WHEN c1.gender = 'L' THEN TO_CHAR(c1.weight) ELSE ' ' END) WOMEN
FROM competitors c1
JOIN competitors c2 ON c1.gender = c2.gender AND c1.weight <= c2.weight
WHERE c1.weight IS NOT NULL
GROUP BY c1.name, c1.gender, c1.weight
HAVING COUNT(CASE WHEN c1.weight < c2.weight THEN 1 END) < 5
ORDER BY c1.weight DESC;
```

## Simulating the MAX() function

**Use Case:** Our database engine does not support the MAX function, how can we simulate this when we have access to the JOIN functions?

**Example:** Let's select the most used languages for each country.

**Solution:** Since we do not have access to the MAX function we need to use our ranking simulation again that we used in the previous examples. So we assign a rank to each result, and then select where the rank is 1 and we return those results.

**Query:**

```sql
SELECT x.hasc, x.iso, x.gebruik
FROM taalgebruik x
JOIN taalgebruik y ON x.hasc = y.hasc AND x.gebruik <= y.gebruik GROUP BY x.hasc, x.iso, x.gebruik HAVING COUNT(1) = 1 ORDER BY x.hasc;
```

## Calculating the Median

**Use Case:** You want to know the median of a result set.

**Example:** Let's say we have competitors from a nation with their weight, how do we get the median of the weight for each nation?

**Solution:** We know that we get the median by subtracting the values bigger then with the values lower then our value and then comparing these to the values equal to. This way we get the median. So we allso apply this on our join queries to find it.

**Query:**

```sql
SELECT x.nation, x.weight
FROM competitors x
  JOIN competitors y ON x.nation = y.nation 
WHERE x.weight IS NOT NULL AND y.weight IS NOT NULL GROUP BY x.nation, x.weight
HAVING
  ABS(
    COUNT(CASE WHEN y.weight > x.weight THEN 1 END) -
    COUNT(CASE WHEN y.weight < x.weight THEN 1 END)
  ) <= COUNT(CASE WHEN y.weight = x.weight THEN 1 END)
ORDER BY 1;
```

## Getting results that are not in another table (without using set operators)

**Use Case:** You want to get the results that are not in another table, but you can't use the set operator. Think about getting countries that do not belong to an international organization.

**Example:** We want to find the countries that are not connected to an international organization.

**Solution:** We select every country, and then we check if the left join of the international organisation returns a NULL value on one of the columns. We do this in the having clausule and if it returns NULL, then we return 1.

**Query:**
```sql
SELECT r.name
FROM regios r
LEFT JOIN members m on m.hasc = r.hasc
WHERE level = 0
GROUP BY r.name
HAVING COUNT(CASE WHEN shortname IS NULL THEN 1 END) = 1;
```

## Get intervals of missing numbers
**Use Case:** You want to be able to view all the missing numbers as an interval, for example: In a cinema, which seats are empty?

**Example:** Find the missing elevations for the country Iceland (IS).

**Solution:** For this problem it is better if we draw it. Imagine having a table like this:

| result |
| :-: |
| 1 |
| 2 |
| 3 |
| 6 |
| 7 |
| 10 |
| 11 |
| 12 |
| 14 |

We can see that we got gaps here, numbers 5, 8, 9, 13 are missing. Now how can we get these numbers into a list?

For this we need to join the original query twice, once by selecting the values bigger then, and once to select the values between. Once we have this we can then create a result set that will return this:

| result | _ |
| :-: | :-: |
| 4 | 5 |
| 8 | 9 |
| 13 | |

Which is the result we want.

**Query:**

```sql
SELECT x.elevation + 1 elevation, CASE WHEN (y.elevation - x.elevation) <> 2 THEN y.elevation - 1 END " "
FROM cities x
JOIN cities y ON y.iso = x.iso AND y.elevation > x.elevation + 1
LEFT JOIN cities z ON z.iso = x.iso AND z.elevation BETWEEN x.elevation + 1 AND y.elevation - 1
WHERE x.iso = 'IS'
AND x.elevation IS NOT NULL
AND z.elevation IS NULL
GROUP BY x.elevation, y.elevation
ORDER BY x.elevation;
```

## Get intervals of connecting numbers

**Use Case:** You want to be able to view all the numbers that are connected to each other, for example: In a cinema, which seats are taken?

**Example:** Find the connecting numbers as an interval for the country Iceland.

**Solution:**
We use the same thinking method as we did for the problem with the missing numbers, instead we now have all the numbers there and need to find the connecting numbers, which means the left and right boundary.

For this we will also use 2 extra joins, 1 join will select all the results that are bigger then the current result, and the second will then find the result set between the non join and the join.

Once we did that we need to have a HAVING clausule that will give us the correct result.

**Query:**

```sql
SELECT x.elevation elevation, CASE WHEN y.elevation <> x.elevation THEN y.elevation END " "
FROM cities x
JOIN cities y ON y.iso = x.iso AND y.elevation >= x.elevation
JOIN cities z ON z.iso = x.iso AND z.elevation BETWEEN x.elevation - 1 AND y.elevation + 1
WHERE x.iso = 'IS'
AND x.elevation IS NOT NULL
GROUP BY x.elevation, y.elevation
HAVING COUNT(DISTINCT CASE WHEN z.elevation BETWEEN x.elevation AND y.elevation THEN z.elevation END) = y.elevation - x.elevation + 1
AND COUNT(CASE WHEN z.elevation = x.elevation - 1 THEN 1 END) = 0
AND COUNT(CASE WHEN z.elevation = y.elevation + 1 THEN 1 END) = 0
ORDER BY x.elevation;
```
