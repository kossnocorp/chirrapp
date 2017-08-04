import { h, Component } from 'preact'
import split from '../../_lib/split'
import { postJSON } from '../../_lib/request'
import Form from './Form'
import Thread from './Thread'
import {
  Wrapper,
  Main,
  PreviewWrapper,
  PreviewScroll,
  Preview,
  Header,
  Headline,
  Stats,
  ThreadWrapper,
  PreviewDisclaimer,
  PreviewClose
} from './style.css'
import { Link } from '../_lib/Link.css'
import Logotype from '../_lib/Logotype'

// TODO: Use external asset when the bug is fixed: https://github.com/developit/preact/issues/786
const TimesIcon = () =>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z' />
  </svg>

const promoText = `Chirr App makes it easy to publish Twitter threads.

Twitter threads allow you to express longer ideas by splitting up a lot of text into multiple tweets.

Also, Chirr App is free, and open source!

[...]

Try it out: https://getchirrapp.com`

const hunterText = `Hello, fellow hunter!

${promoText}`

const demoText =
  'Chirr App splits your text into tweet-sized chunks and posts it as a Twitter thread so you don’t have to. It makes the text easy to read by splitting by sentences when it’s possible. It’s also free and open source.[...]Give it a try!'

export default class Editor extends Component {
  componentWillMount () {
    const { prefilledText } = this.props
    const text =
      typeof prefilledText === 'string'
        ? prefilledText
        : isHunter() ? hunterText : promoText
    const tweetsPreview = split(text)
    this.setState({ text, tweetsPreview })
  }

  render (
    { prefilledText, user, signIn, onPublish },
    { text, tweetsPreview, publishing, showPreview }
  ) {
    const { name, screenName, avatarURL } = user || {}

    return (
      <Wrapper showPreview={showPreview}>
        <Main tag='main'>
          <Header tag='header'>
            <Logotype />

            <Headline tag='h1'>
              Chirr App splits text into tweets and posts it as a thread
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

                if (!this.playingDemo && this.state.text === 'PLAY DEMO') {
                  this.playingDemo = true
                  this.setState({ text: '' })

                  let currentText = demoText
                  const timer = setInterval(() => {
                    const currentSymbol = currentText[0]
                    currentText = currentText.slice(1)
                    const nextText = this.state.text + currentSymbol
                    this.setState({
                      text: nextText,
                      tweetsPreview: split(nextText)
                    })
                    if (currentText === '') clearInterval(timer)
                  }, 30)
                }
              }
            }}
            onSubmit={() => {
              this.setState({ publishing: true })
              signIn().then(auth => publish(auth, split(text))).then(onPublish)
            }}
            onShowPreview={() => this.setState({ showPreview: true })}
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
          <PreviewClose
            onClick={() => {
              this.setState({ showPreview: false })
              this.previewScroll && this.previewScroll.scrollTo(0, 0)
            }}
          >
            <TimesIcon />
          </PreviewClose>

          <PreviewScroll ref={comp => (this.previewScroll = comp && comp.base)}>
            <Preview>
              <ThreadWrapper>
                <Thread
                  tweets={tweetsPreview}
                  name={name}
                  screenName={screenName}
                  avatarURL={avatarURL}
                  isHunter={isHunter()}
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
          </PreviewScroll>
        </PreviewWrapper>
      </Wrapper>
    )
  }
}

function isHunter () {
  return window.location.search.includes('ref=producthunt')
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
