import { h, Component } from 'preact'
import {
  V,
  H,
  El,
  HideOnMobileMedium,
  ShowOnMobileMedium
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
import {
  trackClickRecommend,
  trackMobileMenuToggle,
  trackClickFollow
} from 'app/_lib/track'

const recommendText =
  'This thread is published using @chirrapp 👏 [...]It makes it easy to plan and post Twitter threads. Give it a try: https://chirrapp.com 👌😎👍'

export default class TopBar extends Component {
  render({ openEditor, signIn, signedIn }, { showMenu }) {
    return (
      <Wrapper>
        <H tag="header" paddedH fullWidth expanded>
          <H adjusted>
            <ShowOnMobileMedium>
              <MenuButton
                onClick={() => {
                  trackMobileMenuToggle()
                  this.setState({ showMenu: !showMenu })
                }}
              >
                {showMenu ? <CloseMenuIcon /> : <MenuIcon />}
              </MenuButton>
            </ShowOnMobileMedium>

            <Logotype onClick={() => openEditor('top bar logotype')} />

            <HideOnMobileMedium>
              <Button
                color="positive"
                size="small"
                flat
                onClick={() => openEditor('compose button')}
              >
                Compose
              </Button>
            </HideOnMobileMedium>

            {featureEnabled('drafts') && (
              <Link>
                <H tag="span" size="small">
                  <span>Drafts</span>
                  <ScheduledCounter>3</ScheduledCounter>
                </H>
              </Link>
            )}

            {featureEnabled('history') && <Link current>Your Tweets</Link>}
          </H>

          <H adjusted>
            {featureEnabled('pro') && (
              <Button size="small" color="pro" flat>
                <H tag="span" size="small" adjusted>
                  <RocketIcon />
                  <span>Pro</span>
                </H>
              </Button>
            )}

            <HideOnMobileMedium>
              <Link tag="a" href="https://twitter.com/chirrapp" target="_blank">
                Follow @chirrapp
              </Link>
            </HideOnMobileMedium>

            <Button
              size="small"
              flat
              onClick={() => {
                trackClickRecommend('top bar')
                openEditor('share button', recommendText)
              }}
            >
              <H tag="span" size="small" adjusted>
                Recommend
              </H>
            </Button>

            {!signedIn && (
              <HideOnMobileMedium>
                <Button
                  size="small"
                  color="twitter"
                  flat
                  onClick={() => signIn('top bar')}
                >
                  <H tag="span" size="small" adjusted>
                    <TwitterIcon />
                    <span>Log In</span>
                  </H>
                </Button>
              </HideOnMobileMedium>
            )}
          </H>
        </H>

        <ShowOnMobileMedium>
          {showMenu && (
            <Menu>
              <MenuItem
                onClick={() => {
                  this.setState({ showMenu: false })
                  openEditor('mobile menu')
                }}
              >
                Compose Thread
              </MenuItem>

              <MenuItem
                tag="a"
                href="https://twitter.com/chirrapp"
                target="_blank"
                onClick={trackClickFollow}
              >
                Follow @chirrapp
              </MenuItem>

              {!signedIn && (
                <MenuItem
                  onClick={() => {
                    this.setState({ showMenu: false })
                    signIn('mobile menu')
                  }}
                >
                  Log in with Twitter
                </MenuItem>
              )}
            </Menu>
          )}
        </ShowOnMobileMedium>
      </Wrapper>
    )
  }
}
