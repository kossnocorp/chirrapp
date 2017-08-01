const { sentences } = require('sbd')
const { getTweetLength } = require('twitter-text')

module.exports = split

const limit = 140
const splitStr = '[...]'

function split (text) {
  return sentences(text).reduce(
    (acc, sentence) => {
      const lastIndex = acc.length - 1
      const concatCandidate = joinSentences(acc[lastIndex], sentence)

      if (getTweetLength(concatCandidate) <= limit) {
        if (concatCandidate.includes(splitStr)) {
          concatCandidate.split(splitStr).forEach((chunk, chunkIndex) => {
            acc[lastIndex + chunkIndex] = chunk
          })
        } else {
          acc[lastIndex] = concatCandidate
        }
      } else {
        if (sentence.includes(splitStr)) {
          const chunks = sentence.split(splitStr)

          const chunkConcatCandidate = joinSentences(acc[lastIndex], chunks[0])
          if (getTweetLength(chunkConcatCandidate) <= limit) {
            acc[lastIndex] = chunkConcatCandidate
            chunks.shift()
          }

          chunks.forEach((chunk, chunkIndex) => {
            acc[lastIndex + 1 + chunkIndex] = chunk
          })
        } else {
          acc.push(sentence)
        }
      }

      return acc
    },
    ['']
  )
}

function joinSentences (a, b) {
  return ((a && [a]) || []).concat(b).join(' ')
}
