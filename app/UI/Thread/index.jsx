import { h } from 'preact'
import Tweet from './Tweet'
import { Wrapper } from './style.css'

export default function Thread ({ tweets, displayName, screenName, avatarURL }) {
  return (
    <Wrapper>
      {tweets.map(tweet =>
        <Tweet
          tweet={tweet}
          displayName={displayName}
          screenName={screenName}
          avatarURL={avatarURL}
        />
      )}
    </Wrapper>
  )
}
