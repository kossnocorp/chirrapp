const { sentences } = require('sbd')
const { getTweetLength } = require('twitter-text')

module.exports = split

const limit = 140

function split (text) {
  return sentences(text).reduce(
    (acc, sentence) => {
      const i = acc.length - 1
      const concatCandidate = joinSentences(acc[i], sentence)
      if (getTweetLength(concatCandidate) <= limit) {
        if (concatCandidate.includes('[...]')) {
          const parts = concatCandidate.split('[...]')
          parts.forEach((part, partIndex) => {
            acc[i + partIndex] = part
          })
        } else {
          acc[i] = concatCandidate
        }
      } else {
        acc.push(sentence)
      }
      return acc
    },
    ['']
  )
}

function joinSentences (a, b) {
  return ((a && [a]) || []).concat(b).join(' ')
}
