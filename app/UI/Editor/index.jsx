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
  Headline,
  ThreadWrapper,
  PreviewDisclaimer,
  PreviewClose
} from './style.css'
import { Link } from '../_lib/Link.css'
import Logotype from '../_lib/Logotype'
import { V, H, El } from 'app/UI/_lib/Spacing'
import {
  trackSubmit,
  trackPublish,
  trackException,
  trackPublicationError
} from 'app/_lib/track'
import { lsSet, lsGet } from 'app/_lib/localStorage'

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

export default class Editor extends Component {
  componentWillMount () {
    const { prefilledText } = this.props
    const initialText =
      typeof prefilledText === 'string'
        ? prefilledText
        : lsGet('text-draft') || promoText
    const tweetsPreview = split(initialText)
    this.setState({ initialText, tweetsPreview })
  }

  render (
    { prefilledText, user, signIn, onPublish },
    { initialText, tweetsPreview, publishing, showPreview }
  ) {
    const { name, screenName, avatarURL } = user || {}

    return (
      <Wrapper showPreview={showPreview}>
        <Main tag='main'>
          <V size='large' padded>
            <H tag='header'>
              <Logotype />

              <Headline tag='h1'>
                Chirr App splits text into tweets and posts it as a thread
              </Headline>
            </H>

            <H grow>
              <Form
                initialText={initialText}
                onTextUpdate={newText => {
                  this.latestText = newText

                  if (!this.rebuilding) {
                    this.rebuilding = true

                    setTimeout(() => {
                      this.rebuilding = false
                      lsSet('text-draft', this.latestText)
                      this.setState({ tweetsPreview: split(this.latestText) })
                    }, 250)
                  }
                }}
                onSubmit={({ text }) => {
                  console.log('===')
                  console.log(text)
                  const tweetsToPublish = split(text)
                  const isPromo = [promoText]
                    .concat(prefilledText || [])
                    .includes(text.trim())

                  trackSubmit(
                    isPromo ? 'promo' : 'user',
                    tweetsToPublish.length
                  )

                  this.setState({ publishing: true })
                  signIn('submit')
                    .then(auth => publish(auth, tweetsToPublish))
                    .then(urls => {
                      lsSet('text-draft')
                      trackPublish(
                        isPromo ? 'promo' : 'user',
                        tweetsToPublish.length
                      )
                      onPublish(urls)
                    })
                }}
                onShowPreview={() => this.setState({ showPreview: true })}
                publishing={publishing}
                tweetsNumber={tweetsPreview.length}
              />
            </H>
          </V>
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
                      signIn('preview')
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
      trackPublicationError()
      trackException(err)
    })
}
