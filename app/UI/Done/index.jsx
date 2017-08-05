import { h, Component } from 'preact'
import $script from 'scriptjs'
import { Spinner } from '../_lib/Spinner.css'
import {
  Wrapper,
  Header,
  LogotypeWrapper,
  Message,
  Actions,
  Widget,
  Widgets
} from './style.css'
import { Button } from '../_lib/Button.css'
import Logotype from '../_lib/Logotype'
import { trackClickRecommend, trackClickPublishMore } from 'app/_lib/track'

const recommendText =
  'This thread is published using @chirrapp 👏 [...]It makes it easy to plan and post Twitter threads. Give it a try: https://chirrapp.com 👌😎👍'

export default class Done extends Component {
  componentWillMount () {
    $script('//platform.twitter.com/widgets.js', 'twitter-widgets')
    $script.ready('twitter-widgets', () => this.setState({ ready: true }))
    this.createdTweets = []
  }

  render ({ onBack, publishedURLs }, { ready }) {
    return (
      <Wrapper>
        <Header>
          <LogotypeWrapper>
            <Logotype
              onClick={() => {
                trackClickPublishMore('logo')
                onBack('')
              }}
              hideTextAt='mobileMedium'
            />
          </LogotypeWrapper>

          <Message>Done 🎉</Message>

          <Actions>
            <Button
              size='small'
              onClick={() => {
                trackClickPublishMore('done button')
                onBack('')
              }}
            >
              Publish More
            </Button>
            <Button
              size='small'
              color='green'
              onClick={() => {
                trackClickRecommend('done')
                onBack(recommendText)
              }}
            >
              Recommend
            </Button>
          </Actions>
        </Header>

        <Widgets>
          {(ready &&
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
            )) ||
            <Spinner size='large' color='dark' />}
        </Widgets>
      </Wrapper>
    )
  }
}
