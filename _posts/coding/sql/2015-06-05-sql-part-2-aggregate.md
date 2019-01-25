---
layout: post
current: post
cover: 'assets/images/covers/database.jpg'
navigation: True
title: SQL - Part 2 - Aggregate Functions (GROUP BY, CUBE, ROLLUP, ...)
date: 2015-06-05 10:00:01
tags: coding coding-sql
class: post-template
subclass: 'post tag-sql'
author: xavier
---

## Aggregate Functions

Aggregate functions are functions that are going to aggregate data from columns, or rows. Some of these functions are: SUM, AVG, MAX, MIN, .... .

### Special GROUP BY where we are going to group by values using a CASE and then sort by based on that case

__Example:__ In this example we are sorting based on the rank achieved, we will GROUP BY this rank category so that we can count how many times the person has achieved this rank. And then we will sort based on the category from excellent to really bad.

> The trick here is to use the GROUP BY on both the category but also the category as a number, this is needed for the order by to work

```sql
SELECT cid, name,
CASE
  WHEN rank IN(1, 2, 3) THEN 'excellent'
  WHEN rank IN(4, 5, 6) THEN 'good'
  WHEN rank IN(7, 8, 9) THEN 'almost ok'
  WHEN rank IN(10, 11, 12) THEN 'bad'
  ELSE 'really bad'
END choice, count(1) amount

FROM results
GROUP BY cid, name,
CASE
  WHEN rank IN(1, 2, 3) THEN 'excellent'
  WHEN rank IN(4, 5, 6) THEN 'good'
  WHEN rank IN(7, 8, 9) THEN 'almost ok'
  WHEN rank IN(10, 11, 12) THEN 'bad'
  ELSE 'really bad'
END,
CASE
  WHEN rank IN(1, 2, 3) THEN 1
  WHEN rank IN(4, 5, 6) THEN 2
  WHEN rank IN(7, 8, 9) THEN 3
  WHEN rank IN(10, 11, 12) THEN 4
  ELSE 5
END
ORDER BY cid, name,
CASE
  WHEN rank IN(1, 2, 3) THEN 1
  WHEN rank IN(4, 5, 6) THEN 2
  WHEN rank IN(7, 8, 9) THEN 3
  WHEN rank IN(10, 11, 12) THEN 4
  ELSE 5
END;
```

### Pivoting the result table

By pivoting we want to move our results from vertical to horizontal and reverse

Example (Where result could be A, B, C, D):

NR | Name | Result
-- | ---- | ------
1 | ABBA | A
2 | Bert | B
3 | Jan | C
4 | Dan | D

And when we pivot this we get:

NR | Name | A | B | C | D |
-- | ---- | - | - | - | - |
1 | ABBA | X | | | |
1 | Bert | | X | | |
1 | Jan | | | X | |
1 | Dan | | | | X |

__Example:__ If we perform this on the previous example then we get this query:

```sql
SELECT cid, name
, COUNT(CASE WHEN rank IN(1, 2, 3) THEN 'X' END) "excellent"
, COUNT(CASE WHEN rank IN(4, 5, 6) THEN 'X' END) "good"
, COUNT(CASE WHEN rank IN(7, 8, 9) THEN 'X' END) "almost ok"
, COUNT(CASE WHEN rank IN(10, 11, 12) THEN 'X' END) "bad"
, COUNT(CASE WHEN rank > 12 THEN 'X' END) "really bad"
FROM results
GROUP BY cid, name
ORDER BY cid, name;
```

### Getting a sub-result after every group by (CUBE)

When we use the GROUP BY function, then we will select certain intervals and group those together. When we do this we are actually creating sub-results. Using ROLLUP we will generate a result set that will show an aggregation of every single combination possible. (this for the selected columns)

__Example 1:__ We select races that happened after 2000, limit it to some disciplines, and then we are going to create sub results after every GROUP BY and completely at the end.

```sql
SELECT EXTRACT(year FROM racedate) year, discipline, count(1) number_of_races
FROM races
WHERE EXTRACT(year FROM racedate) >= 2000 AND discipline IN ('SL', 'SG')
GROUP BY CUBE(EXTRACT(year FROM racedate), discipline)
ORDER BY year;
```

The result (simulated and not the real one) will look a bit like this:

| NR | Disc | NUMBER_OF_GAMES |
| ----| ------ | --------------- |
| 1 | SG | 5 |
| 2 | SL | 3 |
| 3 | SE | 2 |
| 4 | SE | 5 |
| ALL | (NULL) | 5 |
| ALL | (NULL) | 3 |
| ALL | (NULL) | 7 |
| ALL | (NULL) | 10 |

The NULL column will show the counted values from ABOVE, or NULL when it can't count those together.

> __Note:__ We are able to change the NULL value to something else such as '---' or ' ' by using the GROUPING function. This will be explained in the next example.

__Example 2:__ We now want to remove that NULL value (We don't like those kind of values in a result set ;) ). This can be done by using the GROUPING function. GROUPING accepts 1 parameter and that is a column. As a result it will return a 1 or a 0 depending on if the result was aggregated or not.

In our example the grouping will thus return 1 when we have a CUBE row, or 0 when we don't have a CUBE row. So if we check if the GROUPING(discipline) is 1 then we know it is cubed and then we just enter '---'. Else we print the discipline.

```sql
SELECT EXTRACT(year FROM racedate) year, CASE WHEN grouping(discipline) = 1 THEN '---' ELSE discipline END, count(1) number_of_races
FROM races
WHERE EXTRACT(year FROM racedate) >= 2000 AND discipline IN ('SL', 'SG')
GROUP BY CUBE(EXTRACT(year FROM racedate), discipline)
ORDER BY year;
```

> __Note:__ We used CUBE here, but there is another function called ROLLUP, ROLLUP will also get a count of values, but this time ROLLUP will "generate a result set that shows the aggregates for a hierarchy of values in the selected columns." (which in simple terms means: 1 result over for each combination of elements in the group by, and not total set / group by on the end.)

### Setting the name of the rollup results

For this we can use a ROLLUP which will give us the extra rows, but we will also need to name those (which is tricky). We can do this by applying a trick. We know that GROUPING returns 1 or 0. And we also know that together this could return 0, 1 or 2. Now if it is 1 then we are not sure in which column we are. so that is why we will multiply one of the groupings by 2 so that we get 4 unique results back which we can then handle.

You can compare this by a binary table for 2 values (this is when we do not multiply by 2 and just add them together):

| a1 | a2 | q0 |
| -- | -- | -- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 2 |

However when we multiply the first column by 2 then we are actually using the above binary table as the way it is supposed to work.

| a1 | a2 | q0 |
| -- | -- | -- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 2 |
| 1 | 1 | 3 |

Which returns 4 values for us to use.

__Example:__ Let's say we want to get the population from France and Germany in their county. Now we want to get the sum of the total population in both France and Germany but also a sub-result noting the total population for France and Germany separately.

```sql
SELECT
CASE
WHEN GROUPING(iso) + GROUPING(lev1) = 0 THEN iso ELSE ' '
END iso
, lev1, count(1)

,CASE 2* GROUPING(iso) + GROUPING(lev1)
WHEN 0 THEN lev1
WHEN 1 THEN 'total country ' || iso
WHEN 3 THEN '**total**'
END regio

FROM cities
WHERE (iso = 'DE' OR iso = 'FR') AND lev1 IS NOT NULL
GROUP BY ROLLUP(iso, lev1)
```

### Putting it all together

For this exercise we are going to put everything together that we have learned so far. The task here was to get data from a table that holds regios, we grouped those together to be able to get the continents, area, population and more.

On the end we had to make sure that we had this result:

continent | population | area <= 50000 | area <= 100000 | area <= 500000 | area > 500000 | #
:-------: | :--------: | :-----------: | :------------: | :------------: | :-----------: | :-:
AFR | pop < 1 million | 11 | 0 | 1 | 0 | 12 AFR | pop 1-5 million | 3 | 3 | 4 | 3 | 13 AFR | pop > 5 million | 1 | 1 | 8 | 13 | 23
--- | AFR totaal | 15 | 4 | 13 | 16 | 48
ASI | pop < 1 million | 7 | 0 | 0 | 0 | 7 ASI | pop 1-5 million | 4 | 1 | 4 | 1 | 10 ASI | pop > 5 million | 2 | 4 | 12 | 10 | 28
--- | ASI totaal | 13 | 5 | 16 | 11 | 45
EUR | pop < 1 million | 10 | 1 | 1 | 0 | 12 EUR | pop 1-5 million | 4 | 4 | 1 | 0 | 9 EUR | pop > 5 million | 5 | 4 | 11 | 3 | 23
--- | EUR totaal | 19 | 9 | 13 | 3 | 44
--- | globaal totaal | 47 | 18 | 42 | 30 | 137

For this we wrote this query:

```sql
SELECT
  -- Continent
  CASE 
    WHEN 
      grouping(parent) * 2 + grouping(
        CASE 
          WHEN population < 1000000 THEN 'pop < 1 million'
          WHEN population BETWEEN 1000000 AND 5000000 THEN 'pop 1-5 million' 
          ELSE 'pop > 5 million'
        END
      ) >= 1 THEN '---' 
    ELSE TO_CHAR(parent) 
  END continent,

  -- Population
  CASE grouping(parent) * 2 + grouping(
    CASE WHEN population < 1000000 THEN 'pop < 1 million' 
      WHEN population BETWEEN 1000000 AND 5000000 THEN 'pop 1-5 million' 
      ELSE 'pop > 5 million'
    END
  ) 
  WHEN 3 THEN 'globaal totaal'
  WHEN 1 THEN TO_CHAR(parent) || ' totaal'
  ELSE
  CASE 
    WHEN population < 1000000 THEN 'pop < 1 million' 
    WHEN population BETWEEN 1000000 AND 5000000 THEN 'pop 1-5 million' 
    ELSE 'pop > 5 million'
  END
  END population

  -- Area <= 50000
  , SUM(CASE WHEN area <= 50000 THEN 1 ELSE 0 END) "area <= 50000"
  , SUM(CASE WHEN area > 50000 AND area <= 100000 THEN 1 ELSE 0 END) "area <= 100000"
  , SUM(CASE WHEN area > 100000 AND area <= 500000 THEN 1 ELSE 0 END) "area <= 500000"
  , SUM(CASE WHEN area > 500000 THEN 1 ELSE 0 END) "area > 500000"

  -- Number of countries
  ,COUNT(1) "#"
FROM regios
WHERE parent IN('EUR', 'AFR', 'ASI')
  AND population IS NOT NULL
  AND area IS NOT NULL
GROUP BY ROLLUP(parent, 
  CASE 
    WHEN population < 1000000 THEN 'pop < 1 million'
    WHEN population BETWEEN 1000000 AND 5000000 THEN 'pop 1-5 million'
    ELSE 'pop > 5 million'
  END
)
ORDER BY parent,
  CASE population
  WHEN 'pop < 1 million' THEN 1
  WHEN 'pop 1-5 million' THEN 2
  ELSE 3
END;
```

> Don't be discouraged by a query's size, many of these query's look big but once you start writing them you just have to make sure you have the right formatting and then everything will fall in place just nicely.