import { h } from 'preact'
import defaultAvatarPath from './defaultAvatar.png'
import {
  Wrapper,
  AvatarWrapper,
  Avatar,
  Content,
  Name,
  DisplayName,
  Text,
  Blank
} from './style.css'

export default function Tweet ({
  tweet,
  displayName = 'Chirr App',
  screenName = 'chirrapp',
  avatarURL = defaultAvatarPath
}) {
  return (
    <Wrapper tag='section'>
      <AvatarWrapper>
        <Avatar tag='img' src={avatarURL} alt='Sample avatar' />
      </AvatarWrapper>

      <Content>
        <Name>{displayName}</Name>
        <DisplayName>@{screenName}</DisplayName>
        <Text>
          {tweet || <Blank>Nothing to preview ¯\_(ツ)_/¯</Blank>}
        </Text>
      </Content>
    </Wrapper>
  )
}
