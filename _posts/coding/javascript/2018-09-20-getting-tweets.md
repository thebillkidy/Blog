---
layout: post
current: post
cover: 'assets/images/covers/twitter.png'
navigation: True
title: Getting Tweets of multiple people on Twitter
date: 2018-09-20 09:00:00
tags: tutorials javascript
class: post-template
subclass: 'post tag-tutorials'
author: xavier
---

For a new project of mine, I wanted to get the different tweets of multiple people at once and save those as a CSV and JSON for further processing. But how can we do this easily in just a couple of lines?

As in every project, I start by assessing what will be the quickest way to resolve this problem (of course in my mind and based on experience). For this project, I decided that since I am going to be working with JSON a lot and web technologies (Twitter API) that [Node.js](https://nodejs.org/en/) is my best option and it should take me around 1h (or even less). More typed languages as C# or Java would require me to parse all the JSON code into objects, and that is too much work for me on this moment for the return I will get from it.

To get started, I started by looking what is already available. A quick search on the [npm](https://www.npmjs.com/) repository resulted in a package called [twitter](https://www.npmjs.com/package/twitter) where we just pass the API keys that you get from twitter (more here: [https://developer.twitter.com/en/apply-for-access.html](https://developer.twitter.com/en/apply-for-access.html)) to query their API. While looking at the API references for Twitter, I discovered the [statuses/user_timeline](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html) endpoint allowing just what I want (getting tweets from users).

So I installed it by running `npm install twitter --save` and started writing my code resulting in the code that you can find at the end of this article.

> **Note:** As also mentioned in the code comments, pagination is NOT implemented so only 200 tweets per user are being shown.

What this code does is that it will call this API and get the tweets. But not only that, it will also map those tweets to a certain format that is easy to work with:

```javascript
{
    twitter_user: {
        tweets: [],
        metadata: []
    }
}
```

Which is important for further processing. Once these tweets are mapped to the correct format, I then save them as a `.json` file and as a `.csv` file. The `.csv` file however needs a correct translation which can be easily coded in a few lines like this:

```javascript
let csv = "user,user_followers,user_favourites,tweet,tweet_created_at";
Object.keys(result).forEach((user) => {
    result[user]['tweets'].forEach((tweet) => {
        csv += `\n${result[user]['metadata']['screen_name']},${result[user]['metadata']['followers']},${result[user]['metadata']['favourites']},${tweet['text'].replace(/,/g, '').replace(/\n/g, '')},${tweet['created_at']}`;
    });
});
```

> **Note:** the above also strips of ',' and '\n' to prevent parsing in our Excel to mess up due to the usage of a `.csv` file.

**index.js**

```javascript
const fs = require('fs');
const Twitter = require('twitter');
const config = require('./config');

const client = new Twitter(config.twitter);

// configure the tweets to fetch per user
// Note: we can get up to 3.200 tweets per user
// Note: we can fetch max 200 tweets as https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html notes
//       so pagination should be implemented @todo but not for now
const tweetsToFetch = 200;

const users = [ 
  'MSEurope',
  'XavierGeerinck',
];

const getTweets = (user) => new Promise((resolve, reject) => {
  const params = { 
    screen_name: user,
    count: tweetsToFetch
  };

  client.get('statuses/user_timeline', params, (err, tweets, res) => {
    if (err) {
      return reject(err);
    }

    return resolve(tweets);
  });
});

const start = async () => {
  const promises = [];
  const allTweets = {}; // Object since it's <user>: [tweets]
  let tweetCount = 0;

  // Get tweets
  users.forEach((user) => {
    promises.push(new Promise(async (resolve, reject) => {
      const tweets = await getTweets(user);
      allTweets[user] = tweets;
      tweetCount += tweets.length;
      resolve();
    }));
  });

  await Promise.all(promises);
  
  // Manipulate tweets, we want to store the text, date posted and metadata about the user
  let result = {};

  Object.keys(allTweets).forEach((user) => {
    // Can be empty, so skip
    if (!allTweets[user]) {
      return;
    }

    if (!result[user]) {
      result[user] = {};
    }

    result[user]['tweets'] = allTweets[user].map((tweet) => ({
      created_at: tweet.created_at,
      text: tweet.text
    }));
    
    result[user]['metadata'] = {
      id: allTweets[user][0]['user']['id_str'],
      name: allTweets[user][0]['user']['name'],
      screen_name: allTweets[user][0]['user']['screen_name'],
      description: allTweets[user][0]['user']['description'],
      followers: allTweets[user][0]['user']['followers_count'],
      favourites: allTweets[user][0]['user']['favourites_count'],
    }
  })

  // Save as JSON
  fs.writeFileSync('./results.json', JSON.stringify(result), 'utf8');

  // Also write as a CSV as in <user>,<user_followers>,<user_favourites>,<tweet>,<tweet_created_at>
  let csv = "user,user_followers,user_favourites,tweet,tweet_created_at";
  Object.keys(result).forEach((user) => {
    result[user]['tweets'].forEach((tweet) => {
      csv += `\n${result[user]['metadata']['screen_name']},${result[user]['metadata']['followers']},${result[user]['metadata']['favourites']},${tweet['text'].replace(/,/g, '').replace(/\n/g, '')},${tweet['created_at']}`;
    });
  });
  
  fs.writeFileSync('./results.csv', csv);

  console.log(`DONE, saved ${tweetCount} tweets`);
};

start();
```

**config.js**

```javascript
module.exports = {
  twitter: {
    consumer_key: '<your_consumer_key>',
    consumer_secret: '<your_consumer_secret>',
    access_token_key: '<your_access_token>',
    access_token_secret: '<your_access_token_secret>'
  }
}
```