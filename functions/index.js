const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const Twit = require('twit')

exports.tweet = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => {
    const {
      key: consumerKey,
      secret: consumerSecret
    } = functions.config().twitter
    const { accessToken, accessTokenSecret, tweets, replyID } = req.body
    const t = new Twit({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token: accessToken,
      access_token_secret: accessTokenSecret
    })

    const urls = []
    tweets.reduce((acc, tweet, index) => {
      const fn = ({ id: prevID, screenName: prevScreenName }) => {
        return postTweet(
          t,
          tweet,
          prevID
        ).then(({ user: { screen_name: tweetAuthorName }, id_str: id }) => {
          urls[index] = tweetURL(tweetAuthorName, id)
          return id
        })
      }

      if (acc) {
        return acc.then(fn)
      } else {
        return fn()
      }
    }, replyID ? getTweet(t, replyID).then(() => replyID) : null)
      .then(() => resp.json({ urls }))
      .catch(err => {
        // TODO: Track exception to Sentry
        resp.status(422).json({ message: err.message })
      })
  })
})

function getTweet (t, statusID) {
  return new Promise((resolve, reject) => {
    t.get('statuses/show', { id: statusID }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function postTweet (t, status, statusID) {
  return new Promise((resolve, reject) => {
    t.post(
      'statuses/update',
      {
        tweet_mode: 'extended',
        status,
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

function tweetURL (screenName, id) {
  return `https://twitter.com/${screenName}/status/${id}`
}
