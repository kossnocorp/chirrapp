const { sentences } = require('sbd')
const { getTweetLength } = require('twitter-text')

module.exports = split

const limit = 140
const splitStr = '[...]'

function split (text) {
  return text
    .split(splitStr)
    .map(textChunk => {
      return sentences(textChunk).reduce(
        (acc, sentence) => {
          const lastIndex = acc.length - 1
          const concatCandidate = joinSentences(acc[lastIndex], sentence)

          // If the current sentence fits the last tweet.
          if (getTweetLength(concatCandidate) <= limit) {
            // Add the sentence to the last tweet.
            acc[lastIndex] = concatCandidate

            // If the current sentence if bigger than the tweet limit
          } else if (sentence.length > limit) {
            let indexShift = 0
            let rest = concatCandidate
            while (rest.length > limit) {
              // Split the last tweet + sentence into two chunks 140 symbols
              // minus 1 symbol reserved for the ellipsis symbol and the rest.
              const [_, head, tail] = rest.match(
                new RegExp(`(.{${limit - 1}})(.+)`, 'm')
              )

              // Split the string by last space symbol.
              const captures = head.match(/(.+)\s([^\s]*)$/)
              if (captures) {
                const [__, tweet, leftover] = captures
                acc[lastIndex + indexShift] = `${tweet}…`
                rest = `…${leftover}${tail}`

                // If the string has no spaces.
              } else {
                acc[lastIndex + indexShift] = `${head}…`
                rest = `…${tail}`
              }
              indexShift++
            }

            acc[lastIndex + indexShift + 1] = rest

            // Otherwise
          } else {
            // Push the sentence as an individual tweet.
            acc.push(sentence)
          }

          return acc
        },
        ['']
      )
    })
    .reduce((acc, chunkTweets) => acc.concat(chunkTweets), [])
    .filter(str => str)
}

function joinSentences (a, b) {
  return ((a && [a]) || []).concat(b).join(' ')
}
