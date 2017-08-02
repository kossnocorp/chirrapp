const { sentences } = require('sbd')
const { getTweetLength } = require('twitter-text')

module.exports = split

const limit = 140
const splitStr = '[...]'

function split (text) {
  return sentences(text)
    .reduce(
      (acc, sentence) => {
        const lastIndex = acc.length - 1
        const concatCandidate = joinSentences(acc[lastIndex], sentence)

        // If the current sentence fits the last tweet.
        if (getTweetLength(concatCandidate) <= limit) {
          // If the sentence includes the split string.
          if (concatCandidate.includes(splitStr)) {
            // Incrementally add each chunk as an individual tweet.
            concatCandidate.split(splitStr).forEach((chunk, chunkIndex) => {
              acc[lastIndex + chunkIndex] = chunk
            })
          } else {
            // Add the sentence to the last tweet.
            acc[lastIndex] = concatCandidate
          }

          // If the current sentence if bigger than the tweet limit
        } else if (sentence.length > limit) {
          let indexShift = 0
          let rest = concatCandidate
          while (rest.length > limit) {
            // Split the last tweet + sentence into two chunks 140 symbols
            // minus 1 symbol reserved for the ellipsis symbol and the rest.
            const [_, head, tail] = rest.match(
              new RegExp(`(.{${limit - 1}})(.+)`)
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
          // If the sentence includes the split string.
          if (sentence.includes(splitStr)) {
            // Split into chunks
            const chunks = sentence.split(splitStr)

            const chunkConcatCandidate = joinSentences(
              acc[lastIndex],
              chunks[0]
            )
            // If the first chunk can fit the last tweet
            if (getTweetLength(chunkConcatCandidate) <= limit) {
              acc[lastIndex] = chunkConcatCandidate
              chunks.shift()
            }

            // Incrementally add each chunk as an individual tweet.
            chunks.forEach((chunk, chunkIndex) => {
              acc[lastIndex + 1 + chunkIndex] = chunk
            })
          } else {
            // Push the sentence as an individual tweet.
            acc.push(sentence)
          }
        }

        return acc
      },
      ['']
    )
    .filter(str => str)
}

function joinSentences (a, b) {
  return ((a && [a]) || []).concat(b).join(' ')
}
