import { h } from 'preact'
import { Wrapper, Textarea, Tips, Actions, PreviewAction } from './style.css'
import { Button } from '../../_lib/Button.css'
import { Spinner } from '../../_lib/Spinner.css'

export default function Form ({
  onChange,
  onSubmit,
  onShowPreview,
  publishing,
  text,
  autoFocus = true
}) {
  return (
    <Wrapper
      tag='form'
      action='#'
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Textarea
        tag='textarea'
        value={text}
        onInput={({ target: { value } }) => onChange(value)}
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

      <Tips>💁 To manuall split the tweets, you can use [...]</Tips>

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
    </Wrapper>
  )
}
