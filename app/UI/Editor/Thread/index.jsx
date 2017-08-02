import { h } from 'preact'
import Tweet from './Tweet'
import { Wrapper, Blank } from './style.css'

export default function Thread ({ tweets, name, screenName, avatarURL }) {
  return tweets.length
    ? <Wrapper>
        {tweets.map(tweet =>
          <Tweet
            tweet={tweet}
            name={name}
            screenName={screenName}
            avatarURL={avatarURL}
          />
        )}
      </Wrapper>
    : <Blank>Nothing to preview ¯\_(ツ)_/¯</Blank>
}
