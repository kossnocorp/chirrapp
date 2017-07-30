import test from 'ava'
import split from '.'

test(t => {
  t.is(split(), undefined)
})
