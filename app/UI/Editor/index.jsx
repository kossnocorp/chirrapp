import { h, Component } from 'preact'
import split from '../../_lib/split'
import { postJSON } from '../../_lib/request'
import Form from './Form'
import Thread from './Thread'
import {
  Wrapper,
  Main,
  PreviewWrapper,
  Preview,
  Header,
  Headline,
  Stats,
  ThreadWrapper,
  PreviewDisclaimer
} from './style.css'
import { Link } from '../_lib/Link.css'
import Logotype from '../_lib/Logotype'

const promoText =
  "The Twitter threads feature is an amazing way to tell a story and express complex ideas. That also allows to hear the voices outside of your social circle and discover new ideas. Yet it's not easy to plan and publish a thread, Twitter UI just isn't made for that. Chirr App makes it easy to build and publish Twitter threads. It's free and open source! Try it out: https://getchirrapp.com!"

export default class Editor extends Component {
  componentWillMount () {
    const { prefilledText } = this.props
    const text = typeof prefilledText === 'string' ? prefilledText : promoText
    const tweetsPreview = split(text)
    this.setState({ text, tweetsPreview })
  }

  render (
    { prefilledText, user, signIn, onPublish },
    { text, tweetsPreview, publishing }
  ) {
    const { name, screenName, avatarURL } = user || {}

    return (
      <Wrapper>
        <Main tag='main'>
          <Header tag='header'>
            <Logotype />

            <Headline tag='h1'>
              Chirr App makes it easy to plan and post Twitter threads
            </Headline>
          </Header>

          <Form
            text={text}
            onChange={newText => {
              this.setState({ text: newText })
              if (!this.rebuilding) {
                this.rebuilding = true
                setTimeout(() => {
                  this.rebuilding = false
                  this.setState({ tweetsPreview: split(this.state.text) })
                }, 250)
              }
            }}
            onSubmit={() => {
              this.setState({ publishing: true })
              signIn()
                .then(auth => publish(auth, split(text)))
                .then(onPublish)
            }}
            publishing={publishing}
          />

          <Stats>
            {pluralize(text.length, 'char', 'chars')} ・{' '}
            {pluralize(
              text.length === 0 ? 0 : tweetsPreview.length,
              'tweet',
              'tweets'
            )}
          </Stats>
        </Main>

        <PreviewWrapper tag='aside'>
          <Preview>
            <ThreadWrapper>
              <Thread
                tweets={tweetsPreview}
                name={name}
                screenName={screenName}
                avatarURL={avatarURL}
              />
            </ThreadWrapper>

            {user
              ? null
              : <PreviewDisclaimer>
                  The thread will be published under your name, this is just a
                  preview.
                  <br />
                  <Link
                    tag='a'
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      signIn()
                    }}
                  >
                    Login to make it personal
                  </Link>.
                </PreviewDisclaimer>}
          </Preview>
        </PreviewWrapper>
      </Wrapper>
    )
  }
}

function publish (
  { credential: { accessToken, secret: accessTokenSecret } },
  tweets
) {
  return postJSON(
    'https://us-central1-chirrapp-8006f.cloudfunctions.net/tweet',
    {
      accessToken,
      accessTokenSecret,
      tweets
    }
  )
    .then(({ urls }) => urls)
    .catch(err => {
      // TODO: Process failed response
    })
}

function pluralize (size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}
