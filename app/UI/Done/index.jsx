import { h, Component } from 'preact'
import $script from 'scriptjs'
import { Spinner } from '../_lib/Spinner.css'
import {
  Wrapper,
  Header,
  LogotypeWrapper,
  Message,
  Actions,
  Widgets
} from './style.css'
import { Button } from '../_lib/Button.css'
import Logotype from '../_lib/Logotype'

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
            <Logotype onClick={() => onBack('')} />
          </LogotypeWrapper>

          <Message>Done 🎉</Message>

          <Actions>
            <Button size='small' onClick={() => onBack('')}>
              Publish More
            </Button>
            <Button size='small' color='green'>
              Recommend
            </Button>
          </Actions>
        </Header>

        <Widgets>
          {(ready &&
            publishedURLs.map((url, index) =>
              <div
                ref={el => {
                  if (!el || this.createdTweets[index]) return
                  this.createdTweets[index] = true
                  window.twttr.widgets.createTweet(
                    url.match(/(\d+)\/?$/)[0],
                    el,
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
