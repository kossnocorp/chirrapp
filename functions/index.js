const functions = require('firebase-functions')

exports.tweet = functions.https.onRequest((request, response) => {
  response.send('Hello, cruel world!')
})
