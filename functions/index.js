const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })

exports.tweet = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => {
    resp.json(req.body)
  })
})
