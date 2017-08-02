import { h } from 'preact'
import Tweet from './Tweet'
import { Wrapper, Blank } from './style.css'
import hunterAvatarPath from './hunterAvatar.png'
import defaultAvatarPath from './defaultAvatar.png'

export default function Thread ({ tweets, name, screenName, avatarURL, isHunter }) {
  return tweets.length
    ? <Wrapper>
        {tweets.map(tweet =>
          <Tweet
            tweet={tweet}
            name={name}
            screenName={screenName}
            avatarURL={avatarURL || (isHunter ? hunterAvatarPath : defaultAvatarPath)}
          />
        )}
      </Wrapper>
    : <Blank>Nothing to preview ¯\_(ツ)_/¯</Blank>
}
