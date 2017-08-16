import { h, Component } from 'preact'
import {
  V,
  H,
  El,
  HideOnMobileSmall,
  ShowOnMobileSmall
} from 'app/UI/_lib/Spacing'
import Logotype from 'app/UI/_lib/Logotype'
import MenuIcon from 'app/UI/_lib/Icon/bars.svg'
import CloseMenuIcon from 'app/UI/_lib/Icon/times.svg'
import TwitterIcon from 'app/UI/_lib/Icon/twitter.svg'
import RocketIcon from 'app/UI/_lib/Icon/star.svg'
import {
  Wrapper,
  Link,
  ScheduledCounter,
  MenuButton,
  Menu,
  MenuItem
} from './style.css'
import { Button } from 'app/UI/_lib/Button'
import { featureEnabled } from 'app/_lib/features'
import { trackClickRecommend } from 'app/_lib/track'

const recommendText =
  'This thread is published using @chirrapp 👏 [...]It makes it easy to plan and post Twitter threads. Give it a try: https://chirrapp.com 👌😎👍'

export default class TopBar extends Component {
  render ({ openEditor, signIn, signedIn }, { showMenu }) {
    return (
      <Wrapper>
        <H tag='header' paddedH fullWidth expanded>
          <H adjusted>
            <ShowOnMobileSmall>
              <MenuButton
                onClick={() => this.setState({ showMenu: !showMenu })}
              >
                {showMenu ? <CloseMenuIcon /> : <MenuIcon />}
              </MenuButton>
            </ShowOnMobileSmall>

            <Logotype onClick={() => openEditor('top bar logotype')} />

            <HideOnMobileSmall>
              <Button
                color='positive'
                size='small'
                flat
                onClick={() => openEditor('compose button')}
              >
                Compose
              </Button>
            </HideOnMobileSmall>

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
              <HideOnMobileSmall>
                <Button
                  size='small'
                  color='twitter'
                  flat
                  onClick={() => signIn('top bar')}
                >
                  <H tag='span' size='small' adjusted>
                    <TwitterIcon />
                    <span>Login</span>
                  </H>
                </Button>
              </HideOnMobileSmall>}
          </H>
        </H>

        <ShowOnMobileSmall>
          {showMenu &&
            <Menu>
              <MenuItem
                onClick={() => {
                  this.setState({ showMenu: false })
                  openEditor('mobile menu')
                }}
              >
                Compose Thread
              </MenuItem>
              {!signedIn &&
                <MenuItem
                  onClick={() => {
                    this.setState({ showMenu: false })
                    signIn('mobile menu')
                  }}
                >
                  Login with Twitter
                </MenuItem>}
            </Menu>}
        </ShowOnMobileSmall>
      </Wrapper>
    )
  }
}
