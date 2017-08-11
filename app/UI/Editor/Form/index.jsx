import { h, Component } from 'preact'
import {
  Wrapper,
  Textarea,
  Tips,
  Actions,
  PreviewAction,
  Stats
} from './style.css'
import { Button } from '../../_lib/Button.css'
import { Input, FieldError } from 'app/UI/_lib/Input.css'
import { Link, LinkIcon } from 'app/UI/_lib/Link.css'
import { Spinner } from '../../_lib/Spinner.css'
import { V, H } from 'app/UI/_lib/Spacing'
import ReplyIcon from 'app/UI/_lib/Icon/reply.svg'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'
import { trackStartTyping, trackSubmit } from 'app/_lib/track'
import preventDefault from 'app/_lib/preventDefault'
import { featureEnabled } from 'app/_lib/features'
import { pushFlash, dismissFlashGroup } from 'app/acts/flashes'
import {
  initialForm,
  updateOnInput,
  updateOnClick,
  updateField,
  trySubmit
} from './form'

export default class Form extends Component {
  componentWillMount () {
    const { initialText } = this.props
    this.setState({ form: initialForm({ text: initialText }) })
  }

  render (
    {
      onTextUpdate,
      onSubmit,
      onShowPreview,
      autoFocus = true,
      tweetsNumber
    },
    {
      form: {
        submitting,
        onceTriedToSubmit,
        valid,
        fields: {
          text: { value: text },
          hasReply: { value: hasReply },
          replyURL: {
            value: replyURL,
            valid: replyURLIsValid,
            message: replyURLMessage
          }
        }
      }
    }
  ) {
    return (
      <V
        tag='form'
        action='#'
        onSubmit={preventDefault(() => {
          dismissFlashGroup('editor-form')

          const form = trySubmit(this.state.form)

          if (form.submitting) {
            // onSubmit(form.fields)
              //.then()
            setTimeout(() => {
              this.setState({
                form: Object.assign({}, form, { submitting: false })
              })
            }, 3000)
          }

          //if (form.message) {
            //pushFlash({
              //group: 'editor-form',
              //type: form.valid ? 'info' : 'error',
              //message: form.message,
              //timeout: 5000
            //})
            //form.message = ''
          //}

          this.setState({ form })
        })}
        size='small'
        fullWidth
      >
        <H size='small'>
          {featureEnabled('reply') &&
            ((hasReply &&
              <Link
                tag='a'
                href='#'
                onClick={preventDefault(updateOnClick(this, 'hasReply', false))}
                disabled={submitting}
              >
                <LinkIcon>
                  <TimesIcon />
                </LinkIcon>
                Cancel reply
              </Link>) ||
              <Link
                tag='a'
                href='#'
                onClick={preventDefault(updateOnClick(this, 'hasReply', true))}
                disabled={submitting}
              >
                <LinkIcon>
                  <ReplyIcon />
                </LinkIcon>
                Reply to a tweet
              </Link>)}
        </H>

        {featureEnabled('reply') &&
          (hasReply &&
            <V size='small'>
              <Input
                tag='input'
                value={replyURL}
                placeholder='Paste the link to the tweet'
                onInput={updateOnInput(this, 'replyURL')}
                errored={!replyURLIsValid}
                disabled={submitting}
              />

              {replyURLMessage &&
                <FieldError>
                  {replyURLMessage}
                </FieldError>}
            </V>)}

        <Textarea
          tag='textarea'
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
        />

        <V size='small' aligned>
          <Tips>💁 To manually split the tweets, you can use [...]</Tips>

          <Actions>
            <Button
              tag='button'
              type='submit'
              color='twitter'
              fullWidth
              disabled={submitting || (onceTriedToSubmit && !valid)}
            >
              {submitting ? <Spinner /> : 'Publish'}
            </Button>

            <PreviewAction>
              <Button
                tag='button'
                type='button'
                color='green'
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

function pluralize (size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}
