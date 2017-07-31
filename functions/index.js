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

    let url
    tweets.reduce((acc, tweet) => {
      const fn = resp => {
        if (resp) {
          const { id_str: id } = resp
          return postTweet(t, tweet, id)
        } else {
          return postTweet(t, tweet)
            .then(resp => {
              const { id_str: id, user: { screen_name: screenName } } = resp
              url = tweetURL(screenName, id)
              return resp
            })
        }
      }

      if (acc) {
        return acc.then(fn)
      } else {
        return fn()
      }
    }, null)
      .then(() => {
        resp.json({ url })
      })
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
