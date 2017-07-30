import { h } from 'preact'

export default function Tweet ({ tweet }) {
  return (
    <section class='Tweet'>
      <div class='TweetAvatarWrapper'>
        <img
          class='TweetAvatar'
          src='https://pbs.twimg.com/profile_images/883667218235617282/KRSXCyVy_bigger.jpg'
          alt='Sample avatar'
        />
      </div>

      <div class='TweetContent'>
        <div class='TweetName'>Sasha Koss</div>
        <div class='TweetUsername'>@kossnocorp</div>
        <div class='TweetText'>{tweet}</div>
      </div>
    </section>
  )
}
