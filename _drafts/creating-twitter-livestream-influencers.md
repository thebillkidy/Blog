1. Go to https://apps.twitter.com/app/new and create an application 
![/assets/images/posts/creating-twitter-livestream-influencers/1.png](/assets/images/posts/creating-twitter-livestream-influencers/1.png)
2. Get Consumer Key & Consumer Secret (under Keys and Access Tokens)
![/assets/images/posts/creating-twitter-livestream-influencers/2.png](/assets/images/posts/creating-twitter-livestream-influencers/2.png)
3. Create Access Token
![/assets/images/posts/creating-twitter-livestream-influencers/3.png](/assets/images/posts/creating-twitter-livestream-influencers/3.png)
![/assets/images/posts/creating-twitter-livestream-influencers/4.png](/assets/images/posts/creating-twitter-livestream-influencers/4.png)
3. Install https://www.npmjs.com/package/twitter-stream-api


What I found important:

From the user (https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object)
* followers_count --> how many followers do they have?
* friends_count --> How many people is he/she following?
* id_str --> Maybe anonomize this, but needed for specific model

From the tweet (https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object)
* text
* created_at
* favorite_count --> how many times is this liked?
* retweet_count --> how many times is this retweeted?
* reply_count --> how many times is this replied on?
* quote_count --> how many times is this quoted by people?


Docs: https://developer.twitter.com/en/docs/tweets/filter-realtime/overview.html --> limited to 5.000 userids