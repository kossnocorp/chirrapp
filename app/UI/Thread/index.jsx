import { h } from 'preact'
import Tweet from './Tweet'
import { Wrapper } from './style.css'

export default function Thread ({ tweets, name, screenName, avatarURL }) {
  return (
    <Wrapper>
      {tweets.map(tweet =>
        <Tweet
          tweet={tweet}
          name={name}
          screenName={screenName}
          avatarURL={avatarURL}
        />
      )}
    </Wrapper>
  )
}
