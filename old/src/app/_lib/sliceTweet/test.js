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

test('test if no limit was passed', t => {
  t.deepEqual(sliceTweet('maxim'), ['', 'maxim'])
})

test('is limit is zero, first arg is empty second is full string', t => {
  t.deepEqual(sliceTweet('maxim', 0), ['', 'maxim'])
})

test('if limit is negative then it is treated as stringTweetLength + limit', t => {
  t.deepEqual(sliceTweet('maxim', -2), ['max', 'im'])
})

test('limit is greater or equal to stringTweetLength', t => {
  t.deepEqual(sliceTweet('some string', 11), ['some string', ''])
})

// TODO write tests for letters with weight equal 2
test('limit when word has 2-weight chars', t => {
  t.deepEqual(sliceTweet('ramaṇoya', 5), ['rama', 'ṇoya'])
  t.deepEqual(sliceTweet('日本語日', 5), ['日本', '語日'])
  t.deepEqual(sliceTweet('日本語日', 0), ['', '日本語日'])
  t.deepEqual(sliceTweet('日本語日', 1), ['', '日本語日'])
  t.deepEqual(sliceTweet('日本語日', 2), ['日', '本語日'])
  t.deepEqual(sliceTweet('日本語日', 7), ['日本語', '日'])
  t.deepEqual(sliceTweet('日本語日', 8), ['日本語日', ''])
  t.deepEqual(sliceTweet('日本語日', -8), ['', '日本語日'])
  t.deepEqual(sliceTweet('日本語日', 9), ['日本語日', ''])
})
