import { h, Component } from 'preact'
import $script from 'scriptjs'
import { Spinner } from '../_lib/Spinner.css'
import { V, H, El } from 'app/UI/_lib/Spacing'
import { Text } from 'app/UI/_lib/Text'
import {
  Wrapper,
  Scroll,
  SpinnerWrapper,
  Widget,
  Scheduled,
  BannersWrapper
} from './style.css'
import HypefuryBanner from './HypefuryBanner'
import BuyMeACoffeeBanner from './BuyMeACoffeeBanner'
import StopwatchIcon from 'app/UI/_lib/Icon/stopwatch.svg'
import format from 'date-fns/format'
import { shuffle } from 'lodash'

export default class Done extends Component {
  componentWillMount() {
    $script('//platform.twitter.com/widgets.js', 'twitter-widgets')
    $script.ready('twitter-widgets', () => this.setState({ ready: true }))
    this.createdTweets = []
  }

  render({ onBack, processedTweets }, { ready }) {
    return (
      <Wrapper>
        <Scroll>
          <V padded aligned adjusted>
            {(ready &&
              [<Banners />].concat(
                processedTweets.map((tweet, index) => {
                  switch (tweet.state) {
                    case 'published':
                      return (
                        <Widget
                          ref={comp => {
                            if (!comp || this.createdTweets[index]) return
                            this.createdTweets[index] = true
                            window.twttr.widgets.createTweet(
                              tweet.url.match(/(\d+)\/?$/)[0],
                              comp.base,
                              { conversation: 'none' }
                            )
                          }}
                        />
                      )
                    case 'scheduled':
                      return (
                        <Scheduled>
                          <El padded>
                            <V size="small">
                              <H adjusted size="small">
                                <StopwatchIcon />

                                <Text size="small" color="secondary">
                                  Scheduled at{' '}
                                  {format(
                                    tweet.scheduledAt,
                                    'HH:mm:ss, D MMM YY'
                                  )}
                                </Text>
                              </H>

                              <Text>{tweet.text}</Text>
                            </V>
                          </El>
                        </Scheduled>
                      )
                  }
                })
              )) || (
              <SpinnerWrapper>
                <Spinner size="large" color="dark" />
              </SpinnerWrapper>
            )}
          </V>
        </Scroll>
      </Wrapper>
    )
  }
}

function Banners() {
  return (
    <BannersWrapper>
      {shuffle([<BuyMeACoffeeBanner />, <HypefuryBanner />])}
    </BannersWrapper>
  )
}
