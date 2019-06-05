import { h, Component } from 'preact'
import split from 'app/_lib/split'
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
import { connect } from 'app/state'
import FooterLine from 'app/UI/_lib/FooterLine'

const promoText = `Chirr App makes it easy to publish Twitter threads.

Twitter threads allow you to express longer ideas by splitting up a lot of text into multiple tweets.

Also, Chirr App is free, and open source!

[...]

Try it out: https://getchirrapp.com`

class Editor extends Component {
  componentWillMount() {
    const { prefilledText } = this.props
    const initialText =
      typeof prefilledText === 'string' ? prefilledText : promoText
    this.setState({ initialText })
  }

  componentWillReceiveProps({
    prefilledText,
    prefilledTextKeyCache,
    numberingEnabled
  }) {
    if (
      (prefilledText || prefilledText === '') &&
      prefilledTextKeyCache &&
      this.props.prefilledTextKeyCache !== prefilledTextKeyCache
    ) {
      const initialText = prefilledText
      this.latestText = prefilledText
      const tweetsPreview = split(initialText, { numbering: numberingEnabled })
      this.setState({
        initialText,
        tweetsPreview
      })
    } else if (numberingEnabled !== this.props.numberingEnabled) {
      this.setState({
        tweetsPreview: split(this.latestText, {
          numbering: numberingEnabled
        })
      })
    }
  }

  render(
    {
      prefilledText,
      prefilledTextKeyCache,
      user,
      signIn,
      onPublish,
      numberingEnabled
    },
    { initialText, tweetsPreview, showPreview }
  ) {
    const { name, screenName, avatarURL } = user || {}

    return (
      <Wrapper showPreview={showPreview}>
        <Main tag="main">
          <V grow padded>
            <H grow>
              <Form
                initialText={initialText}
                prefilledTextKeyCache={prefilledTextKeyCache}
                onTextUpdate={newText => {
                  this.latestText = newText

                  if (!this.rebuilding) {
                    this.rebuilding = true

                    setTimeout(() => {
                      this.rebuilding = false
                      this.setState({
                        tweetsPreview: split(this.latestText, {
                          numbering: numberingEnabled
                        })
                      })
                    }, tweetsPreview ? 250 : 0)
                  }
                }}
                onSubmit={({
                  text: { value: text },
                  hasReply: { value: hasReply },
                  replyURL: { value: replyURL }
                }) => {
                  const tweetsToPublish = split(text, {
                    numbering: numberingEnabled
                  })
                  const isPromo = [promoText]
                    .concat(prefilledText || [])
                    .includes(text.trim())

                  trackSubmit(
                    isPromo ? 'promo' : 'user',
                    tweetsToPublish.length,
                    hasReply
                  )

                  return signIn('submit')
                    .then(auth =>
                      publish(
                        auth,
                        tweetsToPublish,
                        hasReply
                          ? replyURL.match(/\w+\/status\/(\d+)/)[1]
                          : null
                      )
                    )
                    .then(processedTweets => {
                      lsSet('editor-form')
                      trackPublish(isPromo ? 'promo' : 'user', {
                        numberOfTweets: tweetsToPublish.length,
                        hasReply,
                        numberingEnabled
                      })
                      onPublish(
                        (hasReply
                          ? [{ state: 'published', url: replyURL }]
                          : []
                        ).concat(processedTweets)
                      )
                    })
                    .catch(err => {
                      trackPublicationError()
                      trackException(err)

                      pushFlash({
                        group: 'editor-form',
                        type: 'error',
                        message:
                          err.message ||
                          'Something went wrong, please try again (」ﾟﾛﾟ)｣',
                        timeout: 5000
                      })

                      return { error: err }
                    })
                }}
                onShowPreview={() => this.setState({ showPreview: true })}
                tweetsNumber={tweetsPreview ? tweetsPreview.length : 0}
              />
            </H>

            <FooterLine />
          </V>
        </Main>

        <PreviewWrapper tag="aside">
          <PreviewScroll ref={comp => (this.previewScroll = comp && comp.base)}>
            <Preview>
              <ThreadWrapper>
                <Thread
                  tweets={tweetsPreview || []}
                  name={name}
                  screenName={screenName}
                  avatarURL={avatarURL}
                  isHunter={isHunter()}
                />
              </ThreadWrapper>

              {user ? null : (
                <PreviewDisclaimer>
                  The thread will be published under your name, this is just a
                  preview.
                  <br />
                  <Link
                    tag="a"
                    href="#"
                    onClick={preventDefault(() => {
                      signIn('preview')
                    })}
                  >
                    Log in to make it personal
                  </Link>
                  .
                </PreviewDisclaimer>
              )}
            </Preview>
          </PreviewScroll>

          <PreviewClose>
            <H fullWidth paddedH aligned>
              <Button
                tag="button"
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

function isHunter() {
  return window.location.search.includes('ref=producthunt')
}

function publish(
  { credential: { accessToken, secret: accessTokenSecret } },
  tweets,
  replyID
) {
  return postJSON(functions.tweet, {
    accessToken,
    accessTokenSecret,
    tweets,
    replyID
  }).then(
    data =>
      // TODO: Get rid of legacy format
      data.urls
        ? data.urls.map(url => ({ state: 'published', url }))
        : data.processedTweets
  )
}

const ConnectedComponent = connect(
  ({ numberingEnabled }) => ({ numberingEnabled }),
  Editor
)
export default ConnectedComponent
