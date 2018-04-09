---
layout: post
current: post
cover: 'assets/images/covers/database.jpg'
navigation: True
title: SQL - Recursion
date: 2015-06-05 10:00:05
tags: sql
class: post-template
subclass: 'post tag-sql'
author: xavier
---

# Introduction

Recursion in SQL is a lesser known technique, this technique is just like we expect as it would work in any developing language such as C, Javascript, ..., it allows us to create a query that will be able to recursively get and process data to find a result. Think of these examples as possible use cases:

* creating a calendar
* finding the dates of easter
* finding the shortest travel route through a country
* Counting days

and many many more. Also please note that in this article I will make use of the **Oracle DB** the keywords used here are different then in MSSQL but the techniques are the same.

# Keywords

Before we can start with learning how to write recursive queries, we first need to know the keywords that we can use.

### (START WITH) CONNECT BY

The definition is: (START WITH condition_1) CONNECT BY condition_2 where the START WITH clause is optional.

**START WITH** specifies rows that are the root(s) of the hierarchical query.

**CONNECT BY** defines the relationship between the parent rows and the child rows of the hierarchy. it must include the keyword PRIOR when referring to the parent row.

We then have some special cases of the CONNECT BY keyword:

* **CONNECT\_BY\_PATH**: This will merge the results together of a CONNECT BY with the given delimiter. Example: connect\_by\_path(country, ';')
* **CONNECT\_BY\_ROOT**: Unary operator only valid in hierarchical queries, this returns the column value using data from the root row when a column is qualified with this operator.
* **CONNECT\_BY\_ISLEAF**: pseudocolumn that returns 1 when the current row is a leaf of the tree defined by the CONNECT_BY condition, else it returns 0
* **CONNECT\_BY\_ISCYCLE**: pseudocolumn that returns 1 if the current row has a child which is also its ancestor, else it returns 0 (Note: You have to use the NOCYCLE parameter of the CONNECT_BY clause to use this)

### level

level is a pseudocolumn in Oracle that can be used in 2 different ways:

1. Use it as the keyword for identifying the hierarchy level in a numeric format. 1 = root row, 2 = child of a root, ...
2. The second way is to use it as a 'n' row generator, this will increment level for each time the query is looped.

### DUAL

Not a table needed in recursion, but used in this article. We use this so we can create data without the need of an actual table.

# Basic queries

## Creating a simple counter

the purpose of this simple exercise is to get to know the structure and the base keywords of writing recursive queries. That's why it is always useful to start with one of the most basic queries out there.

We want to be able to create a counter recursively that will count from 0 to 10 by just using SQL. The result would then be 11 rows stating 0 to 10.

To write this query we need to think of how recursion works properly. This works by writing a SELECT clause that will select data, if we want to select data from our recursive part then we need to use the keyword **level** this keyword can as explained before be used as a 'n' row generator.

Then after we created the SELECT we will say: "Run this query as long as it is smaller than 12" (12 because 11 - 1 = 10, which is the last value we need). We do this by writing CONNECT BY level <= 11. This will now loop the query as long as level is not 11, it will then increment level every time the query is looped.

**Query**

```sql
SELECT level - 1
FROM dual
CONNECT BY level <= 11;
```

## Finding all remaining days of this month

Almost the same as the previous query, we select the current date, we add the level column to it and we substract with 1 so that we can get level as 0 (since we want today to).

Then we say, as long as this is smaller or equal to the last day of the month, loop.

**Query**

```sql
SELECT sysdate + level - 1
FROM dual
CONNECT BY EXTRACT(DAY FROM sysdate) + level - 1 <= EXTRACT(DAY FROM LAST_DAY(sysdate))
```

## Counting every sunday of the month for the year 2014

To show how we construct this query, I will create every step in detail.

**First** we will write a query that can show us the first day of the year 2014

```sql
SELECT TO_DATE('01/01/2014', 'DD/MM/YYYY')
FROM dual;
```

**Secondly**, we will need to say: Loop this query while it is not the last day of the year (which is always the 31st of December). So we use a recursive query here that will add (level - 1) to set level to 0 to the 1st of January:

```sql
SELECT TO_DATE('01/01/2014', 'DD/MM/YYYY') + (level - 1)
FROM dual
CONNECT BY TO_DATE('01/01/2014', 'DD/MM/YYYY') + (level - 1) <= LAST_DAY(TO_DATE('31/12/2014', 'DD/MM/YYYY'));
```

**Finally**, we group by the year and the month and we perform a count on the day where the day is a Sunday (so to_char(date, 'd') = 7:

```sql
SELECT
2014 year
, EXTRACT(MONTH FROM TO_DATE('01/01/2014', 'DD/MM/YYYY') + (level - 1)) month
, COUNT(CASE WHEN TO_CHAR(TO_DATE('01/01/2014', 'DD/MM/YYYY') + (level - 1), 'd') = 7 THEN 1 END) sundays
FROM dual
CONNECT BY TO_DATE('01/01/2014', 'DD/MM/YYYY') + (level - 1) <= LAST_DAY(TO_DATE('31/12/2014', 'DD/MM/YYYY')) GROUP BY 2014, EXTRACT(MONTH FROM TO_DATE('01/01/2014', 'DD/MM/YYYY') + (level - 1)) ORDER BY month ASC;
```

# START WITH, PRIOR and SYS\_CONNECT\_BY\_PATH queries

## Merging all synonyms from a country into one column delimited by ; 

Let's say we are given this as a begin:

```sql 
WITH x AS ( 
  SELECT regios.name country,
    synoniemen.name,
    row_number() OVER(PARTITION BY eid ORDER BY dup) amount,
    count(1) OVER(PARTITION BY eid) total
  FROM synonyms
    JOIN regios ON eid = cid AND parent = 'EUR'
)
SELECT country, ltrim(sys_connect_by_path(name, ';'), ';') names
FROM x
```

Because we are using SYS\_CONNECT\_BY\_PATH we will need to use CONNECT BY. The thing we want to do is merge every column of the same country with each other. So in our CONNECT BY we will say that the previous country is equal to the current country and the amount of synonyms is 1 less of the current amount. 

This results into: CONNECT BY PRIOR country = country AND PRIOR amount = amount - 1 

We also say that the amount needs to start with 1, since this is our parent. 

So we type: START WITH amount = 1 And last but not least, we want just the row that has everything merged together, so we say: WHERE level = total. 

**Query** 

```sql
WITH x AS (
  SELECT regios.name country
  , synoniemen.name
  , row_number() OVER(PARTITION BY eid ORDER BY dup) amount
  , count(1) OVER(PARTITION BY eid) total
  FROM synonyms
    JOIN regios ON eid = cid AND parent = 'EUR'
)
SELECT country, ltrim(sys_connect_by_path(name, ';'), ';') names
FROM x
WHERE level = total
START WITH amount = 1 CONNECT BY PRIOR country = country and PRIOR amount = amount - 1;
``` 

# Hierarchical Queries

## Selecting the leaf elements from belgium

We start with the parent is Belgium, and then we loop for every parent is the previous hasc. Then when CONNECT\_BY\_ISLEAF=1 we display it.

**Query**

```sql
SELECT name, niveau, level - 1
FROM regios WHERE CONNECT_BY_ISLEAF = 1
START WITH parent = 'BE' CONNECT BY parent = PRIOR hasc
ORDER BY parent, name;
```

## Select every city that falls under the City Ghent

For this we will again use a recursive query, we use START WITH name = 'Ghent' and we will connect by parent = PRIOR hasc again. 

**Query**

```sql
SELECT hasc, name, niveau, level
FROM regios
START WITH name = 'Ghent' CONNECT BY parent = PRIOR hasc;
```

## Upward recursion, select every entity above where hasc = 'BE'

We do exactly the same as going down, we only set the PRIOR different.

**Query**

```sql
SELECT SELECT hasc, niveau, level, connect_by_isleaf
FROM regios 
START WITH hasc = 'BE' CONNECT BY PRIOR parent = hasc;
```

## Select the cities under hasc 'BE.OV' and add identation

For this we will use the function LPAD, LPAD is going to add a padding from the left with the given length and the string1 where it will add to. We use a '.' and a length of 10 so that this shows a proper identation where needed. Then the rest is again the same. We however only apply identation to where the level > 0

**Query**

```sql
SELECT LPAD('.', 10 * (level - 1), '.') || name || ' (' || hasc || ')'
FROM regios
START WITH parent = 'BE.OV'
CONNECT BY PRIOR hasc = parent;
```

# CONNECT\_BY\_ROOT and SYS\_CONNECT\_BY\_PATH functions

## Creating a recursive query to create a path of the hierarchy.

Let's create a query that will select every city of Belgium and connect the hierarchy in Belgium with a /. This all on 1 line. We then will check if the ROOT entity of this hierarchy is Belgium by using the CONNECT\_BY\_ROOT function.

To do this we will select the name, the level and the connect_by_root as columns and we will also create the parents column. This last column is special because we will use the sys_connect_by_path function to connect every name together with a delimiter that we give it.

Then we filter only the leaves and we start with the name = Belgie as our first element. We then use CONNECT BY to recursively loop every result as long as the parent is the previous hasc.

**Query**

```sql
SELECT name
, ltrim(sys_connect_by_path(name, '/'), '/') parents
, level
, connect_by_root name " = Belgium ?"
FROM regios
WHERE CONNECT_BY_ISLEAF = 1
START WITH name = 'België'
CONNECT BY parent = PRIOR hasc
ORDER BY parents;
```

## Using CONNECT_BY_ROOT to start from the root element and find all entities for these root elements till a given element.

The task is that we want to find all root elements that have the entity with the name 'Central' somewhere in it's pad.

For this we use the connect_by_root function which accepts a column (here hasc since we want the top hasc) and then we rename it to another column name called parent.

We also connect the names together with a delimiter ;.

In our WHERE clause we say WHERE name = 'Central' to show that it has to stop there. And we let it start on the NULL parent and continue as long as we can until we find the 'Central' name.

**Query**

```sql
SELECT connect_by_root hasc AS parent, ltrim(sys_connect_by_path(name, ';'), ';') pad
FROM regios
WHERE name = 'Central'
START WITH parent IS NULL
CONNECT BY PRIOR hasc = parent;
```

## Using CONNECT_BY_ROOT to start from an element all the way up to the ROOT element.

We do kind of the same here, only this time we will START WITH the name equal to the name we want it ('Central' here). And we loop the parent upwards.

**Query**

```sql
SELECT CONNECT_BY_ROOT name AS child, ltrim(sys_connect_by_path(name, ';'), ';') pad
FROM regios
WHERE CONNECT_BY_ISLEAF = 1
START WITH name = 'Central'
CONNECT BY PRIOR parent = hasc;
```

# Ordering siblings BY

## Using the SIBLINGS BY to find every city in Flanders and order them according to the province and city

The first problem that we have to solve is finding the province, this is not an easy task if we do not use recursive functions. To find this we use the CONNECT_BY_ROOT keyword again and CONNECT_BY_ROOT the name and rename it to province.

Then we discard everything that is not a leaf (this because we are not interested in the top branches) and we start with the parent being 'BE.VL' which represents Flanders.

We then loop everything by saying PRIOR hasc = parent and finally we ORDER SIBLINGS BY name which will order every single sibling by the name it was given.

**Query**

```sql
SELECT name, CONNECT_BY_ROOT name provincie
FROM regios
WHERE CONNECT_BY_ISLEAF = 1
START WITH parent = 'BE.VL'
CONNECT BY PRIOR hasc = parent
ORDER siblings BY name;
```

# Creating a calendar with SQL

## What we will create

```
Su Mo Tu We Th Fr Sa
--- -- -- -- -- -- -- --
jan 01 02 03
jan 04 05 06 07 08 09 10
jan 11 12 13 14 15 16 17
jan 18 19 20 21 22 23 24
jan 25 26 27 28 29 30 31

feb 01 02 03 04 05 06 07
feb 08 09 10 11 12 13 14
feb 15 16 17 18 19 20 21
feb 22 23 24 25 26 27 28

mar 01 02 03 04 05 06 07
mar 08 09 10 11 12 13 14
mar 15 16 17 18 19 20 21
mar 22 23 24 25 26 27 28
mar 29 30 31

apr 01 02 03 04
apr 05 06 07 08 09 10 11
apr 12 13 14 15 16 17 18
apr 19 20 21 22 23 24 25
apr 26 27 28 29 30

may 01 02
may 03 04 05 06 07 08 09
may 10 11 12 13 14 15 16
may 17 18 19 20 21 22 23
may 24 25 26 27 28 29 30
may 31
```

## How to

Creating a calendar in SQL is not an easy task, however with the help of recursion we can do this.

First we need to get all the days that we want to show, so let's say that we want to show the calendar for this month and the next 4 months.

For this we will need to **first** create a query that will get those days of the months that we want to show. We can do this by this query:

```sql
SELECT LAST_DAY(ADD_MONTHS(sysdate, -1)) + level x
FROM dual
CONNECT BY LAST_DAY(ADD_MONTHS(sysdate, -1)) + level <= LAST_DAY(ADD_MONTHS(sysdate, 4))
```

which basically gets the months and keeps looping for all the days while we are not at the end.

We will wrap this into a CTE so that we can use this to create a calendar.

**Secondly**, we will get some extra data, this data is needed so we can show the week day on the top and the month on the left, we can also correct the formatting with this.

```sql
WITH z AS (
SELECT LAST_DAY(ADD_MONTHS(sysdate, -1)) + level x
FROM dual
CONNECT BY LAST_DAY(ADD_MONTHS(sysdate, -1)) + level <= LAST_DAY(ADD_MONTHS(sysdate, 4))
)
SELECT
x
, EXTRACT(year FROM x) as year
, CAST(TO_CHAR(x, 'mm') AS NUMBER(2)) month
, TO_CHAR(x + 1, 'iw') weeknumber
, TO_CHAR(x, 'dd') daymonth
, TO_CHAR(x, 'd') daynumber
FROM z;
```

And the **last** thing we need to do is say that for the daynumber, when it is 1 print in column monday, when 2 in tuesday, when 3 in wednesday, .... for every day of the week. And the LEFT most column will be our month, so we use a substring with all the months in and we select the length based on the month.

When we did all this we get this as our final result:

```sql
WITH z AS (
SELECT LAST_DAY(ADD_MONTHS(sysdate, -1)) + level x
FROM dual
CONNECT BY LAST_DAY(ADD_MONTHS(sysdate, -1)) + level <= LAST_DAY(ADD_MONTHS(sysdate, 4))
), cal AS (
SELECT
x
, EXTRACT(year FROM x) as year
, CAST(TO_CHAR(x, 'mm') AS NUMBER(2)) month
, TO_CHAR(x + 1, 'iw') weeknumber
, TO_CHAR(x, 'dd') daymonth
, TO_CHAR(x, 'd') daynumber
FROM z
)
SELECT
substr('janfebmaraprmayjunjulaugsepoctnovdec', 3 * MIN(month) - 2, 3) " "
, MAX(CASE daynumber WHEN '1' THEN daymonth ELSE ' ' END) Su
, MAX(CASE daynumber WHEN '2' THEN daymonth ELSE ' ' END) Mo
, MAX(CASE daynumber WHEN '3' THEN daymonth ELSE ' ' END) Tu
, MAX(CASE daynumber WHEN '4' THEN daymonth ELSE ' ' END) We
, MAX(CASE daynumber WHEN '5' THEN daymonth ELSE ' ' END) Th
, MAX(CASE daynumber WHEN '6' THEN daymonth ELSE ' ' END) Fr
, MAX(CASE daynumber WHEN '7' THEN daymonth ELSE ' ' END) Sa
FROM cal
GROUP BY year, month, weeknumber
ORDER BY year, month, MAX(daymonth);
```
