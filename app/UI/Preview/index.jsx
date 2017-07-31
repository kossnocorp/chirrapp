import { h } from 'preact'
import Tweet from './Tweet'

export default function ({ tweets, displayName, screenName, avatarURL }) {
  return (
    <aside class='Preview'>
      <div class='Thread'>
        {tweets.map(tweet =>
          <Tweet
            tweet={tweet}
            displayName={displayName}
            screenName={screenName}
            avatarURL={avatarURL}
          />
        )}
      </div>
    </aside>
  )
}
