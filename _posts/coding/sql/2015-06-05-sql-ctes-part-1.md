---
layout: post
current: post
cover: 'assets/images/covers/database.jpg'
navigation: True
title: Common Table Expression (CTE) - Part 1
date: 2015-06-05 10:00:00
tags: sql
class: post-template
subclass: 'post tag-sql'
author: xavier
---

While I was studying the course Databases at the University of Ghent, we encountered some special queries that we were not being thaught in the Professional Bachelor course. This is why I tried to summarise those queries here for everyone to learn from.

The database engine being used is Oracle SQL server. This has been chosen
because Oracle supports most of the functions that we needed in this class.
(Another good SQL engine to use is MSSQL).

> Please note, every query given here is based on the database that we had in
the class, this database is not mine and therefor I can not publish this here
nor post results of the query.

## Case Functions

### Order by given order

To order by a given order we are going to give a specific number from 1 .. x for the values that we want. We do this by using a case in the order part of our SQL statement.

__Example 1:__ Order by disciplines 'KB', 'GS', 'SL', 'DH', 'SG'

```sql
SELECT distinct discipline, resort
FROM races
ORDER BY
CASE discipline
  WHEN 'KB' THEN 1
  WHEN 'GS' THEN 2
  WHEN 'SL' THEN 3
  WHEN 'DH' THEN 4
  WHEN 'SG' THEN 5
  ELSE 6
END;
```

__Example 2:__ Order by NULL or other values (NULL first, then the other values)

```sql
SELECT rid, modus
FROM races
WHERE discipline = 'SL' AND gender = 'M'
ORDER BY
CASE
  WHEN modus IS NULL THEN 0
  ELSE (modus + 1)
END
ASC;
```

### Putting an X in one of multiple columns based on the value that we have

here is a query that is going to put an X in the column where we want it.

__Example 1:__ We are calculating the BMI and have 3 columns stating: "underweight",
"obesity", "normal". Now we are going to put an X in the column that matches the
person his/her weight.

```sql
SELECT
name
, weight
, gender
, ROUND((weight / (height * height) ), 3) BMI
, CASE WHEN ROUND((weight / (height * height) ), 3) < 17
    THEN 'X'
    ELSE ' '
  END underweight
, CASE WHEN ROUND((weight / (height * height) ), 3) BETWEEN 17 AND 23.999 
    THEN 'X'
    ELSE ' '
  END normal
, CASE WHEN ROUND((weight / (height * height) ), 3) >= 24 
    THEN 'X'
    ELSE ' '
  END obesity
FROM competitors
WHERE weight IS NOT NULL AND height IS NOT NULL
ORDER BY ROUND((weight / (height * height) ), 3);
```

__Example 2:__ We have races that are being done on a specific date, we want to be able to put an X based on the season.

```sql
SELECT EXTRACT(year FROM (racedate + 183)) season, racedate
, CASE WHEN racedate BETWEEN TO_DATE('21 03 ' || extract(year FROM racedate), 'dd MM YYYY') AND TO_DATE('20 06 ' || extract(year FROM racedate), 'dd MM YYYY') THEN 'X' ELSE ' ' END spring
, CASE WHEN racedate BETWEEN TO_DATE('21 06 ' || extract(year FROM racedate), 'dd MM YYYY') AND TO_DATE('20 09 ' || extract(year FROM racedate), 'dd MM YYYY') THEN 'X' ELSE ' ' END summer
, CASE WHEN racedate BETWEEN TO_DATE('21 09 ' || extract(year FROM racedate), 'dd MM YYYY') AND TO_DATE('20 12 ' || extract(year FROM racedate), 'dd MM YYYY') THEN 'X' ELSE ' ' END autumn
, CASE WHEN racedate BETWEEN TO_DATE('21 03 ' || extract(year FROM racedate), 'dd MM YYYY') AND TO_DATE('20 12 ' || extract(year FROM racedate), 'dd MM YYYY') THEN ' ' ELSE 'X' END winter
FROM races
WHERE EXTRACT(year FROM (racedate + 183)) BETWEEN 1990 AND 1992 AND discipline = 'SL'
ORDER BY summer desc, spring desc, autumn desc, winter desc, racedate;
```

### Replace NVL with a CASE structure

NVL is a database engine specific function that is going to replace the NULL values with a value that you give to it. We want to be able to use this on other database engines so that is why we are going to write this as a normal CASE structure.

__Example with NVL:__

```sql
SELECT rid, rank, nvl(points, 0)
FROM results
WHERE rank = 4 AND points < 12;
```

__Example with CASE:__

```sql
SELECT rid, rank,
CASE
WHEN points IS NULL THEN 0
ELSE points
END points
FROM results
WHERE rank = 4 AND points < 12;
```

### Combination of all the above

```sql
SELECT
CASE
WHEN nation IN ('CAN', 'USA') THEN 'North America'
WHEN nation IN ('BUL', 'RUS', 'CZE', 'SLO', 'CRO') THEN 'Eastern-Europe'
WHEN nation IN ('JPN', 'KOR') THEN 'Asia'
ELSE 'Western-Europe'
END Continent
, nation, name, finishaltitude
, CASE WHEN finishaltitude < 1200 THEN 'X' ELSE ' ' END "<1200" , CASE WHEN finishaltitude BETWEEN 1200 AND 1700 THEN 'X' ELSE ' ' END "1200-1700" , CASE WHEN finishaltitude > 1700 THEN 'X' ELSE ' ' END ">1700"
FROM resorts
WHERE finishaltitude IS NOT NULL
-- Order by: Western-Europe, Eastern-Europe, North America, Asia
ORDER BY
CASE
WHEN nation IN ('CAN', 'USA') THEN 3
WHEN nation IN ('BUL', 'RUS', 'CZE', 'SLO', 'CRO') THEN 2
WHEN nation IN ('JPN', 'KOR') THEN 4
ELSE 1
END
ASC

-- By category with X
, CASE WHEN finishaltitude < 1200 THEN 1
WHEN finishaltitude BETWEEN 1200 AND 1700 THEN 2
ELSE 3
END
ASC

-- Resort name
, name;
```