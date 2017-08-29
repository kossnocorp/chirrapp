import { h, Component } from 'preact'
import $script from 'scriptjs'
import { Spinner } from '../_lib/Spinner.css'
import { V } from 'app/UI/_lib/Spacing'
import { Wrapper, Scroll, SpinnerWrapper, Widget, Widgets } from './style.css'
import SubscribeBanner from './SubscribeBanner'
import ClapBanner from './ClapBanner'

export default class Done extends Component {
  componentWillMount() {
    $script('//platform.twitter.com/widgets.js', 'twitter-widgets')
    $script.ready('twitter-widgets', () => this.setState({ ready: true }))
    this.createdTweets = []
  }

  render({ onBack, publishedURLs }, { ready }) {
    return (
      <Wrapper>
        <Scroll>
          <V padded aligned adjusted>
            {(ready &&
              [<SubscribeBanner />, <ClapBanner />].concat(
                publishedURLs.map((url, index) =>
                  <Widget
                    ref={comp => {
                      if (!comp || this.createdTweets[index]) return
                      this.createdTweets[index] = true
                      window.twttr.widgets.createTweet(
                        url.match(/(\d+)\/?$/)[0],
                        comp.base,
                        { conversation: 'none' }
                      )
                    }}
                  />
                )
              )) ||
              <SpinnerWrapper>
                <Spinner size="large" color="dark" />
              </SpinnerWrapper>}
          </V>
        </Scroll>
      </Wrapper>
    )
  }
}
