const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const { TwitterApi } = require('twitter-api-v2')

const { api_key: appKey, api_secret: appSecret } = functions.config().twitter

exports.tweet = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => {
    const { accessToken, accessTokenSecret, tweets, replyID } = req.body
    postThread({ accessToken, accessTokenSecret, tweets, replyID })
      .then(processedTweets => resp.json({ processedTweets }))
      // TODO: Track exception to Sentry
      .catch(err => resp.status(422).json({ message: err.message }))
  })
})

function postThread({ accessToken, accessTokenSecret, tweets, replyID }) {
  const client = getTwitterAPI({ accessToken, accessTokenSecret })

  const initialPromise = replyID
    ? getTweet(client, replyID)
        .then(() => replyID)
        .catch(() => {
          // TODO: Check the type of the error and throw the message below
          //   only when tweet isn't found.
          throw new Error(
            "We can't find the tweet to reply, please check the URL ヽ(。_°)ノ"
          )
        })
    : Promise.resolve(null)

  const processedTweets = []
  return tweets
    .reduce((prevPromise, tweet, index) => {
      return prevPromise
        .then(prevID => postTweet(client, tweet, prevID))
        .then(({ user: { screen_name: tweetAuthorName }, id_str: id }) => {
          processedTweets[index] = {
            state: 'published',
            url: tweetURL(tweetAuthorName, id)
          }
          return id
        })
    }, initialPromise)
    .then(() => processedTweets)
}

function getTweet(client, statusID) {
  return client.v1.singleTweet(statusID)
}

function postTweet(client, tweet, statusID) {
  return client.v1.tweet(tweet, {
    tweet_mode: 'extended',
    in_reply_to_status_id: statusID,
    auto_populate_reply_metadata: true
  })
}

function getTwitterAPI({ accessToken, accessTokenSecret }) {
  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret: accessTokenSecret
  })
}

function tweetURL(screenName, id) {
  return `https://twitter.com/${screenName}/status/${id}`
}
