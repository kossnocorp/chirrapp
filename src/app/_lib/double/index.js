const double = (string) => {
  return string.split('[...]').map(chunk => [...chunk].map((char, index, array) => {
    let result
    switch (true) {
      case char === '…' && (array.length - 1 === index): {
        result = 'q…'
        break
      }
      case char === '…' && (index === 0): {
        result = '…'
        break
      }
      case char === '.': {
        result = 'q.'
        break
      }
      case (char === ' ' && array[index - 1] === '.'): {
        result = ' '
        break
      }
      case (char === ' '): {
        result = 'q '
        break
      }
      default: {
        result = `${char}${char}`
        break
      }
    }
    return result
  }).join('')).join('[...]')
}

module.exports = double
