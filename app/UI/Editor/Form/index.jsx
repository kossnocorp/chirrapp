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

export default class Form extends Component {
  render (
    {
      onTextUpdate,
      onSubmit,
      onShowPreview,
      publishing,
      initialText,
      autoFocus = true,
      tweetsNumber
    },
    { text = initialText, replyURL, hasReply }
  ) {
    return (
      <V
        tag='form'
        action='#'
        onSubmit={preventDefault(() => {
          onSubmit({
            text,
            replyURL: hasReply && replyURL || null
          })
        })}
        size='small'
      >
        <H size='small'>
          {hasReply
            ? <Link
              tag='a'
              href='#'
              onClick={preventDefault(() => {
                this.setState({ hasReply: false })
              })}
            >
              <LinkIcon>
                <TimesIcon />
              </LinkIcon>
                Cancel reply
            </Link>
            : <Link
              tag='a'
              href='#'
              onClick={preventDefault(() => {
                this.setState({ hasReply: true })
              })}
            >
              <LinkIcon>
                <ReplyIcon />
              </LinkIcon>
                Reply to a tweet
            </Link>}
        </H>

        {hasReply &&
          <V size='small'>
            <Input
              tag='input'
              value={replyURL}
              placeholder='Paste the link to the tweet'
              onInput={({ target: { value } }) =>
                this.setState({ replyURL: value })}
              errored
            />

            <FieldError>
              The tweet URL isn't correct, it should be in form
              https://twitter.com/kossnocorp/status/891998517174161408
            </FieldError>
          </V>}

        <Textarea
          tag='textarea'
          value={text}
          onInput={({ target: { value } }) => {
            if (!this.startedTyping) {
              this.startedTyping = true
              trackStartTyping()
            }

            this.setState({ text: value })
            onTextUpdate(value)
          }}
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
        />

        <V size='small' aligned>
          <Tips>💁 To manually split the tweets, you can use [...]</Tips>

          <Actions>
            <Button
              tag='button'
              type='submit'
              fullWidth
              disabled={publishing || text.trim() === ''}
            >
              {publishing ? <Spinner /> : 'Publish'}
            </Button>

            <PreviewAction>
              <Button
                tag='button'
                type='button'
                color='green'
                fullWidth
                disabled={publishing || text.trim() === ''}
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
