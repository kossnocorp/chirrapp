const getTweetLength = require('../getTweetLength')

module.exports = sliceTweet

function sliceTweet (tweet, limit = 0) {
  if (tweet === undefined) {
    throw new Error('no arguments were passed')
  }
  if (typeof tweet !== 'string') {
    throw new Error('first argument must be a string')
  }
  if (limit === 0) {
    return ['', tweet]
  }
  if (limit > getTweetLength(tweet)) {
    return [tweet, '']
  }
  if (limit < 0) {
    const newLimit = getTweetLength(tweet) + limit
    console.log(getTweetLength(tweet))
    console.log(limit)
    console.log(newLimit)
    return sliceTweet(tweet, newLimit)
  }
  let firstPart = ''
  let lastPart = ''
  for (let index = 0; index < tweet.length; index += 1) {
    if (getTweetLength(firstPart + tweet[index]) > limit) {
      lastPart = tweet.slice(index)
      return [firstPart, lastPart]
    }
    firstPart += tweet[index]
    lastPart = tweet.slice(index + 1)
  }
  return [firstPart, lastPart]
}
