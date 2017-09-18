const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const Twit = require('twit')
const { addSeconds } = require('date-fns')
const got = require('got')

const { host } = functions.config().functions

exports.tweet = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => {
    const { accessToken, accessTokenSecret, tweets, replyID, delay } = req.body
    postThread({ accessToken, accessTokenSecret, tweets, replyID, delay })
      .then(processedTweets => resp.json({ processedTweets }))
      // TODO: Track exception to Sentry
      .catch(err => resp.status(422).json({ message: err.message }))
  })
})

function postThread({
  accessToken,
  accessTokenSecret,
  tweets,
  replyID,
  delay: dirtyDelay
}) {
  const twitterAPI = getTwitterAPI({ accessToken, accessTokenSecret })

  const delay = dirtyDelay === undefined ? undefined : parseInt(dirtyDelay)
  if (delay !== undefined && Number.isNaN(delay)) {
    throw new Error('The delay should be a number ಠ_ಠ')
  }

  const initialPromise = replyID
    ? getTweet(twitterAPI, replyID)
        .then(() => replyID)
        .catch(() => {
          // TODO: Check the type of the error and throw the message below
          //   only when tweet isn't found.
          throw new Error(
            "We can't find the tweet to reply, please check the URL ヽ(。_°)ノ"
          )
        })
    : Promise.resolve(null)

  if (delay) {
    const restTweets = Object.assign(tweets)
    const firstTweet = restTweets.shift()
    const now = new Date()

    return initialPromise
      .then(initialID => postTweet(twitterAPI, firstTweet, initialID))
      .then(({ user: { screen_name: tweetAuthorName }, id_str: id }) => {
        if (restTweets.length) {
          got('https://delay.run/tweet', {
            json: true,
            body: {
              accessToken,
              accessTokenSecret,
              tweets: restTweets,
              replyID: id,
              delay
            },
            headers: {
              'Delay-Origin': host,
              'Delay-Value': delay * 1000 // Chirr App accepts delay in seconds, while Delay accepts milliseconds
            }
          })
        }
        return tweetURL(tweetAuthorName, id)
      })
      .then(firstTweetURL => {
        return [{ state: 'published', url: firstTweetURL }].concat(
          restTweets.map((tweet, index) => ({
            state: 'scheduled',
            text: tweet,
            scheduledAt: addSeconds(now, (index + 1) * delay).toISOString()
          }))
        )
      })
  } else {
    const processedTweets = []
    return tweets
      .reduce((prevPromise, tweet, index) => {
        return prevPromise
          .then(prevID => postTweet(twitterAPI, tweet, prevID))
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
}

function getTweet(twitterAPI, statusID) {
  return new Promise((resolve, reject) => {
    twitterAPI.get('statuses/show', { id: statusID }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function postTweet(twitterAPI, tweet, statusID) {
  return new Promise((resolve, reject) => {
    twitterAPI.post(
      'statuses/update',
      {
        tweet_mode: 'extended',
        status: tweet,
        in_reply_to_status_id: statusID,
        auto_populate_reply_metadata: true
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

function getTwitterAPI({ accessToken, accessTokenSecret }) {
  const {
    key: consumerKey,
    secret: consumerSecret
  } = functions.config().twitter
  return new Twit({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret
  })
}

function tweetURL(screenName, id) {
  return `https://twitter.com/${screenName}/status/${id}`
}
