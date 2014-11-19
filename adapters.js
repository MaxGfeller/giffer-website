var Adapter9Gag = require('giffer-adapter-9gag');
var AdapterTwitter = require('giffer-adapter-twitter');
var AdapterReddit = require('giffer-adapter-reddit');

var adapterConfig = require('./config');

module.exports = [
  new Adapter9Gag({ maxPages: 20 }),
  new AdapterTwitter({
   'config': adapterConfig.twitter,
   'path': 'statuses/filter',
   'query': {follow: [256099675, 1019188722, 223019569]},
   'image_types': 'gif'
  }),
  new AdapterReddit({
   'config': adapterConfig.reddit,
   'subreddit': 'funny_gifs',
   'sorting': 'hot',
   'limit': 100,
   'max_attempts': 5,
   'poll_interval': 5000,
   'items_to_get': 2000,
   'image_types': 'gif'
  }),
  new AdapterReddit({
   'config': adapterConfig.reddit,
   'subreddit': 'animalgifs',
   'sorting': 'hot',
   'limit': 100,
   'max_attempts': 5,
   'poll_interval': 5000,
   'items_to_get': 2000,
   'image_types': 'gif'
  }),
  new AdapterReddit({
    'config': adapterConfig.reddit,
    'subreddit': 'funnygifs',
    'sorting': 'hot',
    'limit': 100,
    'max_attempts': 5,
    'poll_interval': 5000,
    'items_to_get': 1000,
    'image_types': 'gif'
  }),
  new AdapterReddit({
    'config': adapterConfig.reddit,
    'subreddit': 'Owls',
    'sorting': 'hot',
    'limit': 100,
    'max_attempts': 5,
    'poll_interval': 5000,
    'items_to_get': 1000,
    'image_types': 'gif'
  }),
  new AdapterReddit({
    'config': adapterConfig.reddit,
    'subreddit': 'AnimalsBeingJerks',
    'sorting': 'hot',
    'limit': 100,
    'max_attempts': 5,
    'poll_interval': 5000,
    'items_to_get': 1000,
    'image_types': 'gif'
  }),
  new AdapterReddit({
    'config': adapterConfig.reddit,
    'subreddit': 'actuallyfunny',
    'sorting': 'hot',
    'limit': 100,
    'max_attempts': 5,
    'poll_interval': 5000,
    'items_to_get': 1000,
    'image_types': 'gif'
  }),
  new AdapterReddit({
    'config': adapterConfig.reddit,
    'subreddit': 'pranks',
    'sorting': 'hot',
    'limit': 100,
    'max_attempts': 5,
    'poll_interval': 5000,
    'items_to_get': 1000,
    'image_types': 'gif'
  })
]
