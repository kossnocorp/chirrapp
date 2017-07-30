import { h, render } from 'preact'

render(
  <div class='Wrapper'>
    <main class='Main'>
      <header class='Header'>
        <div class='Logo'>Chirr App</div>
        <h1 class='Headline'>Simplifies tweet threads</h1>
      </header>

      <form class='Form' action='#'>
        <textarea class='Textarea'>
          It took me half a year to release @date_fns v1.0.0. I was anxious and
          insecure and spend time procrastinating on unimportant tiny details.
          After a successful release, I realized how stupid I was and promised
          myself to never repeat the mistake. It's been alright until I decided
          to finally release v2.0.0... 8 months ago. I mean, yeah, v2.0.0 is
          coming really soon.
        </textarea>

        <button type='button' class='Button'>
          Publish
        </button>
      </form>

      <div class='Stats'>364 chars ・ 4 tweets</div>
    </main>

    <aside class='Preview'>
      <div class='Thread'>
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

            <div class='TweetText'>
              It took me half a year to release @date_fns v1.0.0. I was anxious
              and insecure and spend time procrastinating on unimportant tiny
              details.
            </div>
          </div>
        </section>

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

            <div class='TweetText'>
              After a successful release, I realized how stupid I was and
              promised myself to never repeat the mistake.
            </div>
          </div>
        </section>

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

            <div class='TweetText'>
              It's been alright until I decided to finally release v2.0.0... 8
              months ago.
            </div>
          </div>
        </section>

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

            <div class='TweetText'>
              I mean, yeah, v2.0.0 is coming really soon.
            </div>
          </div>
        </section>
      </div>
    </aside>
  </div>,
  document.body
)
