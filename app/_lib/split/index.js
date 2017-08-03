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
              const slicePos = limit - 1
              const head = rest.slice(0, slicePos)
              const tail = rest.slice(slicePos)

              // Split the string by last space symbol.
              const lastSpaceIndex = head.lastIndexOf(' ')
              if (lastSpaceIndex !== -1) {
                const tweet = head.slice(0, lastSpaceIndex)
                const leftover = head.slice(lastSpaceIndex)
                acc[lastIndex + indexShift] = `${tweet}…`
                rest = `…${(leftover + tail).trim()}`

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
