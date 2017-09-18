import { h, Component } from 'preact'
import {
  Wrapper,
  Textarea,
  Tips,
  Actions,
  PreviewAction,
  Stats,
  DelayInput
} from './style.css'
import { Button, ButtonSpinner } from '../../_lib/Button.css'
import { Input, FieldError } from 'app/UI/_lib/Input.css'
import { Link, LinkIcon } from 'app/UI/_lib/Link.css'
import { Spinner } from '../../_lib/Spinner.css'
import { V, H } from 'app/UI/_lib/Spacing'
import ReplyIcon from 'app/UI/_lib/Icon/reply.svg'
import CounterIcon from 'app/UI/_lib/Icon/list-ol.svg'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'
import StopwatchIcon from 'app/UI/_lib/Icon/stopwatch.svg'
import {
  trackStartTyping,
  trackReplyClick,
  trackNumberingClick,
  trackDelayClick
} from 'app/_lib/track'
import preventDefault from 'app/_lib/preventDefault'
import { pushFlash, dismissFlashGroup } from 'app/acts/flashes'
import { enableNumbering, disableNumbering } from 'app/acts/editor'
import {
  initialForm,
  updateOnInput,
  updateOnClick,
  updateField,
  trySubmit
} from './form'
import { Text } from 'app/UI/_lib/Text'
import { connect } from 'app/state'

class Form extends Component {
  componentWillMount() {
    const { initialText, onTextUpdate } = this.props
    const form = initialForm({ text: initialText })
    this.setState({ form })
    onTextUpdate(form.fields.text.value)
  }

  componentWillReceiveProps(nextProps) {
    const { initialText, prefilledTextKeyCache } = nextProps
    if (
      (initialText || initialText === '') &&
      prefilledTextKeyCache &&
      this.props.prefilledTextKeyCache !== prefilledTextKeyCache
    ) {
      this.setState({
        form: updateField(
          updateField(
            updateField(this.state.form, 'replyURL', ''),
            'hasReply',
            false
          ),
          'text',
          initialText
        )
      })
    }
  }

  render(
    {
      onTextUpdate,
      onSubmit,
      onShowPreview,
      autoFocus = true,
      tweetsNumber,
      numberingEnabled
    },
    {
      form: {
        submitting,
        onceTriedToSubmit,
        valid,
        fields: {
          text: { value: text, valid: textIsValid, error: textError },
          hasReply: { value: hasReply },
          delay: { value: delay, valid: delayIsValid, error: delayError },
          replyURL: {
            value: replyURL,
            valid: replyURLIsValid,
            error: replyURLError
          }
        }
      }
    }
  ) {
    return (
      <V
        tag="form"
        action="#"
        onSubmit={preventDefault(() => {
          dismissFlashGroup('editor-form')

          const form = trySubmit(this.state.form)

          if (form.submitting) {
            onSubmit(form.fields).then(() => {
              this.setState({
                form: Object.assign({}, form, { submitting: false })
              })
            })
          }

          // Delegate to flashes
          if (form.error) {
            pushFlash({
              group: 'editor-form',
              type: form.valid ? 'info' : 'error',
              message: form.error,
              timeout: 5000
            })
            form.error = ''
          }

          this.setState({ form })
        })}
        size="small"
        fullWidth
      >
        <div>
          <H size="small" wrap>
            {(hasReply && (
              <Link
                tag="a"
                href="#"
                onClick={preventDefault(updateOnClick(this, 'hasReply', false))}
                disabled={submitting}
              >
                <LinkIcon>
                  <TimesIcon />
                </LinkIcon>
                Cancel reply
              </Link>
            )) || (
              <Link
                tag="a"
                href="#"
                onClick={preventDefault(() => {
                  trackReplyClick()
                  this.setState({
                    form: updateField(this.state.form, 'hasReply', true)
                  })
                })}
                disabled={submitting}
              >
                <LinkIcon>
                  <ReplyIcon />
                </LinkIcon>
                Reply to a tweet
              </Link>
            )}

            {numberingEnabled ? (
              <Link
                tag="a"
                href="#"
                disabled={submitting}
                onClick={preventDefault(disableNumbering)}
              >
                <LinkIcon>
                  <TimesIcon />
                </LinkIcon>
                Disable numbering
              </Link>
            ) : (
              <Link
                tag="a"
                href="#"
                disabled={submitting}
                onClick={preventDefault(() => {
                  trackNumberingClick()
                  enableNumbering()
                })}
              >
                <LinkIcon>
                  <CounterIcon />
                </LinkIcon>
                Enable numbering
              </Link>
            )}

            {delay === undefined ? (
              <Link
                tag="a"
                href="#"
                disabled={submitting}
                onClick={preventDefault(() => {
                  trackDelayClick()
                  this.setState({
                    form: updateField(this.state.form, 'delay', 5)
                  })
                })}
              >
                <LinkIcon>
                  <StopwatchIcon />
                </LinkIcon>
                Enable delay
              </Link>
            ) : (
              <Link
                tag="a"
                href="#"
                disabled={submitting}
                onClick={preventDefault(() => {
                  trackDelayClick()
                  this.setState({
                    form: updateField(this.state.form, 'delay', undefined)
                  })
                })}
              >
                <LinkIcon>
                  <TimesIcon />
                </LinkIcon>
                Disable delay
              </Link>
            )}
          </H>
        </div>
        {hasReply && (
          <V size="small">
            <Input
              tag="input"
              value={replyURL}
              placeholder="Paste the link to the tweet"
              onInput={updateOnInput(this, 'replyURL')}
              errored={!replyURLIsValid}
              disabled={submitting}
            />

            {replyURLError && <FieldError>{replyURLError}</FieldError>}
          </V>
        )}

        {delay !== undefined && (
          <V size="small">
            <H size="small" adjusted>
              <DelayInput>
                <Input
                  tag="input"
                  type="number"
                  value={delay}
                  placeholder="Delay in seconds"
                  onInput={updateOnInput(this, 'delay')}
                  errored={!delayIsValid}
                  disabled={submitting}
                />
              </DelayInput>

              <Text>Delay between tweets in seconds</Text>
            </H>

            {delayError && <FieldError>{delayError}</FieldError>}
          </V>
        )}

        <Textarea
          tag="textarea"
          value={text}
          onInput={updateOnInput(this, 'text', value => {
            if (!this.startedTyping) {
              this.startedTyping = true
              trackStartTyping()
            }

            onTextUpdate(value)
          })}
          ref={comp => {
            if (!comp || !autoFocus || this.selectedOnce) return
            this.selectedOnce = true
            // XXX: The field won't be focused without setTimeout ლ(ಠ_ಠლ)
            setTimeout(() => {
              comp.base.focus()
              comp.base.select()
            })
          }}
          placeholder="What's happening?"
          disabled={submitting}
          errored={!textIsValid}
        />

        {textError && <FieldError>{textError}</FieldError>}

        <V size="small" aligned>
          <Tips>💁 To manually split the tweets, you can use [...]</Tips>

          <Actions>
            <Button
              tag="button"
              type="submit"
              color="twitter"
              fullWidth
              disabled={submitting}
            >
              {submitting ? (
                <ButtonSpinner>
                  <Spinner />
                </ButtonSpinner>
              ) : (
                'Publish'
              )}
            </Button>

            <PreviewAction>
              <Button
                tag="button"
                type="button"
                color="green"
                fullWidth
                onClick={onShowPreview}
              >
                Preview
              </Button>
            </PreviewAction>
          </Actions>

          <Stats>
            {pluralize(
              text.replace('[...]', '').trim().length,
              'char',
              'chars'
            )}{' '}
            ・ {pluralize((text.length && tweetsNumber) || 0, 'tweet', 'tweets')}
          </Stats>
        </V>
      </V>
    )
  }
}

function pluralize(size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}

const ConnectedComponent = connect(
  ({ numberingEnabled }) => ({ numberingEnabled }),
  Form
)
export default ConnectedComponent
