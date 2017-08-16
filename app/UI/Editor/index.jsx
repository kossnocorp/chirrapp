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
  PreviewClose,
  PreviewCloseIcon
} from './style.css'
import { Link } from '../_lib/Link.css'
import { V, H, El } from 'app/UI/_lib/Spacing'
import {
  trackSubmit,
  trackPublish,
  trackException,
  trackPublicationError
} from 'app/_lib/track'
import { lsSet, lsGet } from 'app/_lib/localStorage'
import preventDefault from 'app/_lib/preventDefault'
import { pushFlash } from 'app/acts/flashes'
import { Button } from 'app/UI/_lib/Button'
import { functions } from 'app/config'

const promoText = `Chirr App makes it easy to publish Twitter threads.

Twitter threads allow you to express longer ideas by splitting up a lot of text into multiple tweets.

Also, Chirr App is free, and open source!

[...]

Try it out: https://getchirrapp.com`

export default class Editor extends Component {
  componentWillMount () {
    const { prefilledText } = this.props
    const initialText =
      typeof prefilledText === 'string' ? prefilledText : promoText
    const tweetsPreview = split(initialText)
    this.setState({ initialText, tweetsPreview })
  }

  render (
    { prefilledText, user, signIn, onPublish },
    { initialText, tweetsPreview, showPreview }
  ) {
    const { name, screenName, avatarURL } = user || {}

    return (
      <Wrapper showPreview={showPreview}>
        <Main tag='main'>
          <H grow padded>
            <Form
              initialText={initialText}
              onTextUpdate={newText => {
                this.latestText = newText

                if (!this.rebuilding) {
                  this.rebuilding = true

                  setTimeout(() => {
                    this.rebuilding = false
                    this.setState({ tweetsPreview: split(this.latestText) })
                  }, 250)
                }
              }}
              onSubmit={({
                text: { value: text },
                hasReply: { value: hasReply },
                replyURL: { value: replyURL }
              }) => {
                onPublish([
                  'https://twitter.com/chirrapp/status/895246852425220096',
                  'https://twitter.com/kossnocorp/status/897118277960335360'
                ])
                return
                const tweetsToPublish = split(text)
                const isPromo = [promoText]
                  .concat(prefilledText || [])
                  .includes(text.trim())

                trackSubmit(isPromo ? 'promo' : 'user', tweetsToPublish.length)

                return signIn('submit')
                  .then(auth =>
                    publish(
                      auth,
                      tweetsToPublish,
                      hasReply ? replyURL.match(/\w+\/status\/(\d+)/)[1] : null
                    )
                  )
                  .then(urls => {
                    trackPublish(
                      isPromo ? 'promo' : 'user',
                      tweetsToPublish.length
                    )
                    onPublish(urls)
                  })
                  .catch(err => {
                    trackPublicationError()
                    trackException(err)

                    pushFlash({
                      group: 'editor-form',
                      type: 'error',
                      message: err.message,
                      timeout: 5000
                    })

                    return { error: err }
                  })
              }}
              onShowPreview={() => this.setState({ showPreview: true })}
              tweetsNumber={tweetsPreview.length}
            />
          </H>
        </Main>

        <PreviewWrapper tag='aside'>
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
                    onClick={preventDefault(() => {
                      signIn('preview')
                    })}
                  >
                      Login to make it personal
                  </Link>.
                </PreviewDisclaimer>}
            </Preview>
          </PreviewScroll>

          <PreviewClose>
            <H fullWidth paddedH aligned>
              <Button
                tag='button'
                onClick={() => {
                  this.setState({ showPreview: false })
                  if (this.previewScroll) this.previewScroll.scrollTop = 0
                }}
              >
                Close Preview
              </Button>
            </H>
          </PreviewClose>
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
  tweets,
  replyID
) {
  return postJSON(functions.tweet, {
    accessToken,
    accessTokenSecret,
    tweets,
    replyID
  }).then(({ urls }) => urls)
}
