import test from 'ava'
import split from '.'

test(t => {
  t.deepEqual(split('Short tweet.'), ['Short tweet.'])
  const url =
    'http://example.com/9531AA08FB25F8146A0472EE7E43623010CACC7E8BFB7C992229A39B9210248E795A84197EE01B9D50B40889BC5689E930A8839DB3D43010E887DDEEE643CCDCEE5EDCBD6A866480FFAC850D7EDE367B859E70F0D7E5E5E28B78CE6E4D5D35748310898A8DA4EC8B82A2E7AF72596F64E4742C22273FC8865662ED7F64AC8D01F3FFD442BB64AD6B9FD79B523BB586252C1D5A4CAE50548C56CBBDA498A2BEF11927B4D9CEE85854A0DC3DBAC0EE46659A0ADEBB7D5678E25E13D6AD2AADC625B4907CF45E3B0EC2602F03179E3FA3A27D8BEF198E456B0F5CBBFB9DB182C2499A359D3A8A92771918906EBC85B0CD3215A861F69D527135B28A362117CFF63F'

  t.deepEqual(split(`Short tweet with extremly long URL: ${url}`), [
    `Short tweet with extremly long URL: ${url}`
  ])
})

test(t => {
  t.deepEqual(
    split(
      "It took me half a year to release @date_fns v1.0.0. I was anxious and insecure and spend time procrastinating on unimportant tiny details. After a successful release, I realized how stupid I was and promised myself to never repeat the mistake. It's been alright until I decided to finally release v2.0.0... 8 months ago. I mean, yeah, v2.0.0 is coming really soon."
    ),
    [
      'It took me half a year to release @date_fns v1.0.0. I was anxious and insecure and spend time procrastinating on unimportant tiny details.',
      'After a successful release, I realized how stupid I was and promised myself to never repeat the mistake.',
      "It's been alright until I decided to finally release v2.0.0... 8 months ago. I mean, yeah, v2.0.0 is coming really soon."
    ]
  )
})

test(t => {
  t.deepEqual(
    split('It[...]allows[...]to[...]split[...]tweets[...]manually!'),
    ['It', 'allows', 'to', 'split', 'tweets', 'manually!']
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam ante risus,[...]vehicula at arcu eleifend, tempus condimentum lectus.'
    ),
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam ante risus,',
      'vehicula at arcu eleifend, tempus condimentum lectus.'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit[...]ultricies. Nullam ante risus, vehicula at arcu eleifend tempus condimentum lectus.'
    ),
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit',
      'ultricies. Nullam ante risus, vehicula at arcu eleifend tempus condimentum lectus.'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam ante risus, vehicula at[...]arcu.'
    ),
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam ante risus, vehicula at',
      'arcu.'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam ante risus, vehicula at arcu.[...]'
    ),
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam ante risus, vehicula at arcu.'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam[...]ante risus, vehicula at.'
    ),
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique nunc quis blandit ultricies. Nullam',
      'ante risus, vehicula at.'
    ]
  )
})

test(t => {
  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus, vehicula at arcu eleifend, tempus condimentum lectus.'
    ),
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus, vehicula at arcu…',
      '…eleifend, tempus condimentum lectus.'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum. Dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus. Vehicula at arcu eleifend, tempus condimentum lectus proin lacinia dolor elit, nec laoreet magna ultrices vel maecenas scelerisque tortor massa, non faucibus dui consectetur sed.'
    ),
    [
      'Lorem ipsum. Dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus. Vehicula at arcu…',
      '…eleifend, tempus condimentum lectus proin lacinia dolor elit, nec laoreet magna ultrices vel maecenas scelerisque tortor massa, non…',
      '…faucibus dui consectetur sed.'
    ]
  )

  t.deepEqual(
    split(
      'Loremxipsumxdolorxsitxametxxconsecteturxadipiscingxelitxxnullaxtristiquexnuncxquisxblanditxultriciesxxnullamxantexrisusxxvehiculaxatxarcuxeleifendxxtempusxcondimentumxlectusx'
    ),
    [
      'Loremxipsumxdolorxsitxametxxconsecteturxadipiscingxelitxxnullaxtristiquexnuncxquisxblanditxultriciesxxnullamxantexrisusxxvehiculaxatxarcuxe…',
      '…leifendxxtempusxcondimentumxlectusx'
    ]
  )
})

test(t => {
  t.deepEqual(
    split(
      `test test test test test[...] test test test test test.[...] test test test test test test test test test test test test test…

…test test`
    ),
    [
      'test test test test test',
      'test test test test test.',
      'test test test test test test test test test test test test test… \n \n …test test'
    ]
  )
  t.deepEqual(
    split(`Mary had a little lamb and it followed her to school one day and the…

…teacher lost all control of the class because there was this cute lamb entertaining all the children`),
    [
      'Mary had a little lamb and it followed her to school one day and the… \n \n …teacher lost all control of the class because there was this…',
      '…cute lamb entertaining all the children'
    ]
  )
})

test('numbering', t => {
  t.deepEqual(
    split(
      "It took me half a year to release @date_fns v1.0.0. I was anxious and insecure and spend time procrastinating on unimportant tiny details. After a successful release, I realized how stupid I was and promised myself to never repeat the mistake. It's been alright until I decided to finally release v2.0.0... 8 months ago. I mean, yeah, v2.0.0 is coming really soon.",
      {
        numbering: true
      }
    ),
    [
      '1/ It took me half a year to release @date_fns v1.0.0.',
      '2/ I was anxious and insecure and spend time procrastinating on unimportant tiny details.',
      '3/ After a successful release, I realized how stupid I was and promised myself to never repeat the mistake.',
      "4/ It's been alright until I decided to finally release v2.0.0... 8 months ago. I mean, yeah, v2.0.0 is coming really soon."
    ]
  )

  t.deepEqual(
    split(
      `test test test test test[...] test test test test test.[...] test test test test test test test test test test test test test…

  …test test`,
      { numbering: true }
    ),
    [
      '1/ test test test test test',
      '2/ test test test test test.',
      '3/ test test test test test test test test test test test test test… \n \n …test test'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus, vehicula at arcu eleifend, tempus condimentum lectus.',
      { numbering: true }
    ),
    [
      '1/ Lorem ipsum dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus, vehicula at…',
      '2/ …arcu eleifend, tempus condimentum lectus.'
    ]
  )

  t.deepEqual(
    split(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus vehicula at arcu eleifend, tempus condimentum lectus proin lacinia dolor elit, nec laoreet magna ultrices vel maecenas scelerisque tortor massa, non faucib dui consectetur sed.',
      { numbering: true }
    ),
    [
      '1/ Lorem ipsum dolor sit amet, consectetur adipiscing elitx nulla tristique nunc quis blandit ultriciesx nullam ante risus vehicula at arcu…',
      '2/ …eleifend, tempus condimentum lectus proin lacinia dolor elit, nec laoreet magna ultrices vel maecenas scelerisque tortor massa, non…',
      '3/ …faucib dui consectetur sed.'
    ]
  )

  t.deepEqual(
    split(
      'It[...]allows[...]to[...]Test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test[...]split[...]tweets[...]manually!',
      {
        numbering: true
      }
    ),
    [
      '1/ It',
      '2/ allows',
      '3/ to',
      '4/ Test test test test test test test test test test test test test test test test test test test test test test test test test test test…',
      '5/ …test test test test test test test test test test test test test test test test test test test test test',
      '6/ split',
      '7/ tweets',
      '8/ manually!'
    ]
  )
})

test('long word', t => {
  t.deepEqual(
    split(
      'nirantarāndhakāritā-digantara-kandaladamanda-sudhārasa-bindu-sāndratara-ghanāghana-vr̥nda-sandehakara-rayandamāna-makaranda-bindu-bandhuratara-mākanda-taru-phula-talpa-phalpa-mr̥dula-sikatā-jāla-jaṭila-mūla-tala-marutraka-miladalaghu-laghu-laya-kalita-ramaṇoya-pānoya-śālikā-bālikā-karāra-vinda-galantikā-galadelā-lavaṅga-pāṭala-ghanasāra-karutūrikātisauratha-medura-laghutara-madhura-śotalatara-saliladhārā-nirākariṣṇu-tadoya-vimala-vilocana-mayū-rava-reravāpasārita-pipāsāyāsa-pathika-lokān00000000000000000000000000000000000000000000000000000000000000'
    ),
    [
      'nirantarāndhakāritā-digantara-kandaladamanda-sudhārasa-bindu-sāndratara-ghanāghana-vr̥nda-sandehakara-rayandamāna-makaranda-bindu-bandhurat…',
      '…ara-mākanda-taru-phula-talpa-phalpa-mr̥dula-sikatā-jāla-jaṭila-mūla-tala-marutraka-miladalaghu-laghu-laya-kalita-ramaṇoya-pānoya-śālikā-bā…',
      '…likā-karāra-vinda-galantikā-galadelā-lavaṅga-pāṭala-ghanasāra-karutūrikātisauratha-medura-laghutara-madhura-śotalatara-saliladhārā-nirākar…',
      '…iṣṇu-tadoya-vimala-vilocana-mayū-rava-reravāpasārita-pipāsāyāsa-pathika-lokān00000000000000000000000000000000000000000000000000000000000000'
    ]
  )
})

test('long word with numbering', t => {
  t.deepEqual(
    split(
      'nirantarāndhakāritā-digantara-kandaladamanda-sudhārasa-bindu-sāndratara-ghanāghana-vr̥nda-sandehakara-rayandamāna-makaranda-bindu-bandhuratara-mākanda-taru-phula-talpa-phalpa-mr̥dula-sikatā-jāla-jaṭila-mūla-tala-marutraka-miladalaghu-laghu-laya-kalita-ramaṇoya-pānoya-śālikā-bālikā-karāra-vinda-galantikā-galadelā-lavaṅga-pāṭala-ghanasāra-karutūrikātisauratha-medura-laghutara-madhura-śotalatara-saliladhārā-nirākariṣṇu-tadoya-vimala-vilocana-mayū-rava-reravāpasārita-pipāsāyāsa-pathika-lokān00000000000000000000000000000000000000000000000000000000000000',
      { numbering: true }
    ),
    [
      '1/ nirantarāndhakāritā-digantara-kandaladamanda-sudhārasa-bindu-sāndratara-ghanāghana-vr̥nda-sandehakara-rayandamāna-makaranda-bindu-bandhu…',
      '2/ …ratara-mākanda-taru-phula-talpa-phalpa-mr̥dula-sikatā-jāla-jaṭila-mūla-tala-marutraka-miladalaghu-laghu-laya-kalita-ramaṇoya-pānoya-śāl…',
      '3/ …ikā-bālikā-karāra-vinda-galantikā-galadelā-lavaṅga-pāṭala-ghanasāra-karutūrikātisauratha-medura-laghutara-madhura-śotalatara-saliladhār…',
      '4/ …ā-nirākariṣṇu-tadoya-vimala-vilocana-mayū-rava-reravāpasārita-pipāsāyāsa-pathika-lokān0000000000000000000000000000000000000000000000000…',
      '5/ …0000000000000'
    ]
  )
})
