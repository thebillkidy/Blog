---
layout: post
current: post
cover: 'assets/images/covers/buckets.png'
navigation: True
title: Dividing numbers into equal buckets or bins through Bucketization
date: 2018-06-07 09:00:00
tags: tutorials javascript reinforcement-learning
class: post-template
subclass: 'post tag-tutorials'
author: xavier
---

A common practice in Reinforcement Learning is to go from a continuous space towards a discrete space. What does this mean? Take for example a range of numbers between $]-3, 3[$, if we want to represent all the numbers that fit in this range as a state then we would have $\infty$ numbers being represented or $\infty$ states.

We thus need to find a way on how to classify our numbers, such that we are able to control the amount of "states", this approach is called **bucketization**.

## Defining our assumptions and test

Let's work this out through a practical example. Take the following number set `[-100, -2.635, -1.052, -1.051, 0, 0.54, 2.2, 3.698, 100]` for the range $]-3, 3[$ and let's create `4` equal buckets.

This means that we will have the following ranges (rounded off):

```
Range #1: ] -INF,   -1.0517 [
Range #2: ] -1.0517, 0.532  [
Range #3: ] 0.532,   2.115  [
Range #4: ] 2.115,   INF    [
```

Manually putting these numbers in their correct buckets, results in:

|Bucket #1|Bucket #2|Bucket #3|Bucket #4|
|-|-|-|-|
|-100|-1.051|0.5400|2.200|
|-2.635|0||3.6980|
|-1.052|||100|

## Which problems to solve

To convert this to code, we can see that we have some problems to solve:

1. How do we go from one bucket to the other?
2. How do we classify number to their respective bucket?

### Solving Problem #1

For our first problem, we can just look at defining the space between our buckets. This is defined by our easy math formula: $\frac{lower + upper}{buckets}$ or in our programming language:

```javascript
const stepSize = (Math.abs(rangeLow) + Math.abs(rangeHigh)) / bucketCount;
```

> Note the `Math.abs` here, since when we have a negative rangeLow we would get a wrong result ;)

### Solving Problem #2

Our other problem is a bit harder though, we want to be able to solve it in a performance that is good enough and does not require too much effort.

A simple (maybe naive) solution would just be to go over our ranges one by one, starting from the lowerBound. So let's just implement this one.

We know that we will need a loop that ends when we reach the last bucket (so that we put values that are greater than our range in the last bucket automatically) through `(idx < bucketCount - 1)`.

What we also know is that we will keep looping until our value is larger than the end bound of the current range. Which we calculate through `rangeLow + stepSize * (idx + 1)`.

In code this results in:

```javascript
let idx = 0;

// Find bucket, put values on the outer size of the range in the last bucket
while ((idx < bucketCount - 1) && val > rangeLow + stepSize * (idx + 1)) {
  idx++;
}

return idx;
```

> We accept this method, because we control the performance in the end.  Given by the numbers of buckets we have, so $O(20)$ would still be acceptable

## Our final result

Putting this all together in one beautiful class that we can re-use, results in:

```javascript
class Bucket {
  constructor(bucketCount, rangeLow, rangeHigh) {
    this.bucketCount = bucketCount;
    this.rangeLow = rangeLow;
    this.rangeHigh = rangeHigh;
    this.stepSize = (Math.abs(rangeLow) + Math.abs(rangeHigh)) / bucketCount;
    this.buckets = [];

    this.initBuckets();
  }

  initBuckets() {
    for (let i = 0; i < this.bucketCount; i++) {
      this.buckets[i] = [];
    }
  }

  addValueToBucket(val) {
    let idx = this.getBucketIdxForValue(val);
    this.buckets[idx].push(val);
  }

  getBucketIdxForValue(val) {
    let idx = 0;

    // Find bucket, put values on the outer size of the range in the last bucket
    while ((idx < this.bucketCount - 1) && val > this.rangeLow + this.stepSize * (idx + 1)) {
      idx++;
    }

    return idx;
  }
}

module.exports = Bucket;
```

## Testing this

And to test we can use our testing parameters defined in the `Defining our assumptions and test` chapter:

```javascript
const assert = require('assert');
const Bucket = require('../');

describe('Bucketing', function() {
  const rangeLowBound = -2.635;
  const rangeHighBound = 3.698;
  const bucketCount = 4;

  //const numbersToTest = [-100, -2.635, -1.052, -1.051, 0, 0.54, 2.2, 3.698, 100 ];
  it('should put a value below its range in the first bucket', () => {
    const bucket = new Bucket(bucketCount, rangeLowBound, rangeHighBound);
    assert.equal(bucket.getBucketIdxForValue(-100), 0);
  });

  it('should put a value above its range in the last bucket', () => {
    const bucket = new Bucket(bucketCount, rangeLowBound, rangeHighBound);
    assert.equal(bucket.getBucketIdxForValue(100), bucketCount - 1);
  });

  it('should put the values in the correct buckets', () => {
    const bucket = new Bucket(bucketCount, rangeLowBound, rangeHighBound);
    const numbersToTest = [-100, -2.635, -1.052, -1.051, 0, 0.54, 2.2, 3.698, 100 ];

    for (i of numbersToTest) {
      bucket.addValueToBucket(i);
    }

    // correct number classification
    assert.equal(JSON.stringify(bucket.buckets[0]), JSON.stringify([-100, -2.635, -1.052]));
    assert.equal(JSON.stringify(bucket.buckets[1]), JSON.stringify([-1.051, 0]));
    assert.equal(JSON.stringify(bucket.buckets[2]), JSON.stringify([0.54]));
    assert.equal(JSON.stringify(bucket.buckets[3]), JSON.stringify([2.2,3.698,100]));
  })
});
```