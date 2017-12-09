const { sentences } = require('sbd')
const getTweetLength = require('../getTweetLength')
const sliceTweet = require('../sliceTweet')

module.exports = split

const limit = 280
const splitStr = '[...]'
const ellipsis = '…'

function split (text, options = {}) {
  const { numbering } = options
  let globalAccLength = 0
  return text
    .split(splitStr)
    .map(textChunk => {
      const tweets = sentences(textChunk)
        .reduce(
          (acc, sentence) => {
            const lastIndex = acc.length - 1
            const currentNumber = globalAccLength + acc.length
            const nextNumber = currentNumber + 1
            const extraNumberWidth = 2 // "/" plus <space>
            const nextNumberWidth =
              nextNumber.toString().length + extraNumberWidth
            const lastTweet = acc[lastIndex]
            const concatCandidate = joinSentences(
              numbering ? lastTweet || `${currentNumber}/` : lastTweet,
              sentence
            )

            // If the current sentence fits the last tweet.
            if (getTweetLength(concatCandidate) <= limit) {
              // Add the sentence to the last tweet.
              acc[lastIndex] = concatCandidate

              // If the current sentence is bigger than the tweet limit
            } else if (
              getTweetLength(sentence) + (numbering ? nextNumberWidth : 0) >
              limit
            ) {
              let indexShift = 0
              let rest = concatCandidate
              console.log(rest)
              while (getTweetLength(rest) > limit) {
                console.log(getTweetLength(rest))
                // Split the last tweet + sentence into two chunks 140 symbols
                // minus 2 reserved for the ellipsis.
                const slicePos = limit - 1 // - 2 because ellipses weight is equal 2 TODO change number 2 to ellipsis weight
                const head = rest.slice(0, slicePos)
                console.log(`HEAD: ${head}`)
                const tail = rest.slice(slicePos)

                // Find the last space position excluding the number's space
                let lastSpaceIndex
                const numberingCaptures = head.match(/^(\d+\/\s)(.+)$/)
                // If the head has number (\d+\/\s)
                if (numberingCaptures) {
                  // Find the last space index excluding the number's space
                  const [, number, headWithoutNumber] = numberingCaptures
                  const index = headWithoutNumber.lastIndexOf(' ')
                  lastSpaceIndex = index === -1 ? index : number.length + index
                } else {
                  lastSpaceIndex = head.lastIndexOf(' ')
                }

                if (lastSpaceIndex !== -1) {
                  const tweet = head.slice(0, lastSpaceIndex)
                  const leftover = head.slice(lastSpaceIndex)
                  acc[lastIndex + indexShift] = `${tweet}…`
                  rest = `${numbering
                    ? `${currentNumber + indexShift + 1}/ `
                    : ''}…${(leftover + tail).trim()}`
                } else {
                  // If the string has no spaces.
                  // Cut off the last symbol in order to give space for the ellipsis
                  // const tweet = head.slice(0, limit - 2) // TODO change number 2 to ellipsis weight
                  // const leftover = head.slice(lastSpaceIndex)
                  const [tweet, leftover] = sliceTweet(head, limit - getTweetLength(ellipsis))
                  acc[lastIndex + indexShift] = `${tweet}${ellipsis}`
                  rest = `${numbering
                    ? `${currentNumber + indexShift + 1}/ `
                    : ''}${ellipsis}${leftover}${tail}`
                }
                indexShift++
              }

              acc[lastIndex + indexShift] = rest

              // Otherwise
            } else {
              // Push the sentence as an individual tweet.
              acc.push(`${numbering ? `${nextNumber}/ ` : ''}${sentence}`)
            }

            return acc
          },
          ['']
        )
        .filter(str => str)

      globalAccLength += tweets.length
      return tweets
    })
    .reduce((acc, chunkTweets) => acc.concat(chunkTweets), [])
    .filter(str => str)
}

function joinSentences (a, b) {
  return ((a && [a]) || []).concat(b).join(' ')
}
