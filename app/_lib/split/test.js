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
})
