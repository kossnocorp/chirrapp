import test from 'ava'
import getTweetLength from '.'

test(t => {
  t.is(getTweetLength('Hi http://test.co'), 26)
  t.is(getTweetLength('日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本 https://google.com'), 280)
})

test('edge case', t => {
  t.is(getTweetLength(''), 0)
  t.is(getTweetLength('ab'), 2)
})
