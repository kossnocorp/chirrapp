import { h } from 'preact'
import defaultAvatarPath from './defaultAvatar.png'

export default function Tweet ({
  tweet,
  displayName,
  screenName,
  avatarURL = defaultAvatarPath
}) {
  return (
    <section class='Tweet'>
      <div class='TweetAvatarWrapper'>
        <img
          class='TweetAvatar'
          src={avatarURL}
          alt='Sample avatar'
        />
      </div>

      <div class='TweetContent'>
        <div class='TweetName'>Sasha Koss</div>
        <div class='TweetUsername'>@kossnocorp</div>
        <div class='TweetText'>
          {tweet}
        </div>
      </div>
    </section>
  )
}
