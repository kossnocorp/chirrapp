import test from 'ava'
import parseTweet from '.'

test(t => {
  t.is(parseTweet('Hi http://test.co'), 26)
  t.is(parseTweet('日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本 https://google.com'), 280)
})

test('edge case', t => {
  t.is(parseTweet(''), 0)
})
