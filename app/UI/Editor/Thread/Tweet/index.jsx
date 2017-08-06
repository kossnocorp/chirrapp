import { h } from 'preact'
import {
  Wrapper,
  AvatarWrapper,
  Avatar,
  Content,
  Name,
  DisplayName,
  Text
} from './style.css'
import { autoLink, htmlEscape } from 'twitter-text'

export default function Tweet ({
  tweet,
  name = 'Chirr App',
  screenName = 'chirrapp',
  avatarURL
}) {
  return (
    <Wrapper tag='section'>
      <AvatarWrapper>
        <Avatar tag='img' src={avatarURL} alt='Sample avatar' />
      </AvatarWrapper>

      <Content>
        <Name>
          {name}
        </Name>
        <DisplayName>
          @{screenName}
        </DisplayName>
        <Text dangerouslySetInnerHTML={{ __html: highlight(tweet) }} />
      </Content>
    </Wrapper>
  )
}

function highlight (tweet) {
  return autoLink(htmlEscape(tweet), {
    targetBlank: true
  })
}
