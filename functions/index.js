const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const Twit = require('twit')

exports.tweet = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => {
    const {
      key: consumerKey,
      secret: consumerSecret
    } = functions.config().twitter
    const { accessToken, accessTokenSecret, tweets } = req.body
    const t = new Twit({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token: accessToken,
      access_token_secret: accessTokenSecret
    })

    const urls = []
    tweets.reduce((acc, tweet, index) => {
      const fn = prevResp => {
        return postTweet(t, tweet, prevResp && prevResp.id_str)
          .then(({ user: { screen_name: screenName }, id_str: id }) => {
            urls[index] = tweetURL(screenName, id)
            return resp
          })
      }

      if (acc) {
        return acc.then(fn)
      } else {
        return fn()
      }
    }, null)
      .then(() => resp.json({ urls }))
  })
})

function postTweet (t, status, statusId) {
  return new Promise((resolve, reject) => {
    t.post(
      'statuses/update',
      { status, in_reply_to_status_id: statusId },
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
