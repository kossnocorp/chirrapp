import { h } from 'preact'
import defaultAvatarPath from './defaultAvatar.png'
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
  displayName,
  screenName,
  avatarURL = defaultAvatarPath
}) {
  return (
    <Wrapper tag='section'>
      <AvatarWrapper>
        <Avatar tag='img' src={avatarURL} alt='Sample avatar' />
      </AvatarWrapper>

      <Content>
        <Name>Sasha Koss</Name>
        <DisplayName>@kossnocorp</DisplayName>
        <Text>
          {tweet}
        </Text>
      </Content>
    </Wrapper>
  )
}
