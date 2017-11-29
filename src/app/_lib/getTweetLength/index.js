const anchorme = require('anchorme').default
require('string.prototype.codepointat')

module.exports = getTweetLength

const configuration = {
  'version': 2,
  'maxWeightedTweetLength': 280,
  'scale': 100,
  'defaultWeight': 200,
  'transformedURLLength': 23,
  'ranges': [
    {
      'start': 0,
      'end': 4351,
      'weight': 100
    },
    {
      'start': 8192,
      'end': 8205,
      'weight': 100
    },
    {
      'start': 8208,
      'end': 8223,
      'weight': 100
    },
    {
      'start': 8242,
      'end': 8247,
      'weight': 100
    }
  ]
}

const removeAndCountUrl = (text) => {
  const listOfLinks = anchorme(text, {
    list: true
  })
  const textWithoutUrls = listOfLinks.reduce((acc, link) => acc.replace(link.raw, ''), text)
  const urlsLength = listOfLinks.length * configuration.transformedURLLength
  return [textWithoutUrls, urlsLength]
}

function getTweetLength (text) {
  const [textWithoutUrls, urlsLength] = removeAndCountUrl(text)
  return [...textWithoutUrls]
    .reduce((acc, char) => {
      const charCodePoint = char.codePointAt(0)
      let charWeight = configuration.defaultWeight
      for (let range of configuration.ranges) {
        if (charCodePoint >= range.start && charCodePoint <= range.end) {
          charWeight = range.weight
          break
        }
      }
      return acc + charWeight / configuration.scale
    }, urlsLength)
}
