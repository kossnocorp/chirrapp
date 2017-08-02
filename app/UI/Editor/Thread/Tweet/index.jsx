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
        <Name>{name}</Name>
        <DisplayName>@{screenName}</DisplayName>
        <Text>
          {tweet}
        </Text>
      </Content>
    </Wrapper>
  )
}
