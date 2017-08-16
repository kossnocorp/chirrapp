import { h } from 'preact'
import { V, H, El } from 'app/UI/_lib/Spacing'
import Logotype from 'app/UI/_lib/Logotype'
import TwitterIcon from 'app/UI/_lib/Icon/twitter.svg'
import RocketIcon from 'app/UI/_lib/Icon/star.svg'
import { Wrapper, Link, ScheduledCounter } from './style.css'
import { Button } from 'app/UI/_lib/Button'
import { featureEnabled } from 'app/_lib/features'
import { trackClickRecommend } from 'app/_lib/track'

const recommendText =
  'This thread is published using @chirrapp 👏 [...]It makes it easy to plan and post Twitter threads. Give it a try: https://chirrapp.com 👌😎👍'

export default function TopBar ({ openEditor, signIn, signedIn }) {
  return (
    <Wrapper>
      <H tag='header' paddedH fullWidth expanded>
        <H adjusted>
          <Logotype onClick={() => openEditor('top bar logotype')} />

          <Button
            color='positive'
            size='small'
            flat
            onClick={() => openEditor('compose button')}
          >
            Compose
          </Button>

          {featureEnabled('drafts') &&
            <Link>
              <H tag='span' size='small'>
                <span>Drafts</span>
                <ScheduledCounter>3</ScheduledCounter>
              </H>
            </Link>}

          {featureEnabled('history') && <Link current>Your Tweets</Link>}
        </H>

        <H adjusted>
          {featureEnabled('pro') &&
            <Button size='small' color='pro' flat>
              <H tag='span' size='small' adjusted>
                <RocketIcon />
                <span>Pro</span>
              </H>
            </Button>}

          <Button
            size='small'
            flat
            onClick={() => {
              trackClickRecommend('top bar')
              openEditor('share button', recommendText)
            }}
          >
            <H tag='span' size='small' adjusted>
              Share
            </H>
          </Button>

          {!signedIn &&
            <Button size='small' color='twitter' flat onClick={signIn}>
              <H tag='span' size='small' adjusted>
                <TwitterIcon />
                <span>Login</span>
              </H>
            </Button>}
        </H>
      </H>
    </Wrapper>
  )
}
