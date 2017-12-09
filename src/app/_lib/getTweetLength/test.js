import test from 'ava'
import getTweetLength from '.'

test(t => {
  t.is(getTweetLength('Hi http://test.co'), 26)
  t.is(getTweetLength('日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本 https://google.com'), 280)
  t.is(getTweetLength('nirantarāndhakāritā'), 19)
  t.is(getTweetLength('lavaṅga'), 8)
  t.is(getTweetLength('ramaṇoya'), 9)
  t.is(getTweetLength('ramaṇ'), 6)
  // t.is(getTweetLength('nirantarāndhakāritā-digantara-kandaladamanda-sudhārasa-bindu-sāndratara-ghanāghana-vr̥nda-sandehakara-rayandamāna-makaranda-bindu-bandhuratara-mākanda-taru-phula-talpa-phalpa-mr̥dula-sikatā-jāla-jaṭila-mūla-tala-marutraka-miladalaghu-laghu-laya-kalita-ramaṇoya-pānoya-śālikā-bāl…'), 280)
  // t.is(getTweetLength('nirantarāndhakāritā-digantara-kandaladamanda-sudhārasa-bindu-sāndratara-ghanāghana-vr̥nda-sandehakara-rayandamāna-makaranda-bindu-bandhuratara-mākanda-taru-phula-talpa-phalpa-mr̥dula-sikatā-jāla-jaṭila-mūla-tala-marutraka-miladalaghu-laghu-laya-kalita-ramaṇoya-pānoya-śālikā-bāli'), 280)
})

test('edge case', t => {
  t.is(getTweetLength(''), 0)
  t.is(getTweetLength('ab'), 2)
})

test('one ellipsis weight is 2', t => {
  t.is(getTweetLength('Lorem ipsum. Dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus. Vehicula at arcu eleifend, tempus condimentum lectus proin lacinia dolor elit, nec laoreet magna ultrices vel maecenas scelerisque tortor massa, non faucibus…'), 281)
  t.is(getTweetLength('…'), 2)
})
