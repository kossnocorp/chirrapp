import test from 'ava'
import sliceTweet from '.'

test('test if no arguments were passed', t => {
  const error = t.throws(() => {
    sliceTweet()
  }, Error)
  t.is(error.message, 'no arguments were passed')
})

test('first argument is not a string', t => {
  const error = t.throws(() => {
    sliceTweet(1234)
  }, Error)
  t.is(error.message, 'first argument must be a string')
})

test('test if no startIndex and endIndex were passed', t => {
  t.is(sliceTweet('maxim'), 'maxim')
})

test('is startIndex is zero, return whole string', t => {
  t.is(sliceTweet('maxim', 0), 'maxim')
})

test('if startIndex is negative then it is treated as stringTweetLength - startIndex', t => {
  t.is(sliceTweet('maxim', -2), 'im')
})

test('startIndex greater or equal to stringTweetLength must return whole string', t => {
  t.is(sliceTweet('some string', 11), '')
})

test('endIndex is negative then it is treated as stringTweetLength + endIndex', t => {
  t.is(sliceTweet('some new string', 5, -3), 'new str')
})

// TODO write tests for letters with weight equal 2
test('test if no endIndex argument', t => {
  t.deepEqual(sliceTweet('ramaṇoya', 5), 'ramaṇoya')
})
