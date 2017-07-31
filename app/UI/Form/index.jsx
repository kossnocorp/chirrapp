import { h } from 'preact'
import { Wrapper, Textarea, Button } from './style.css'

export default function Form ({ onChange, onSubmit, text, autoFocus = true }) {
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
        autoFocus={autoFocus}
        value={text}
        onInput={({ target: { value } }) => onChange(value)}
        ref={({ base }) => {
          if (!autoFocus || this.selectedOnce) return
          this.selectedOnce = true
          base.select()
        }}
      />

      <Button tag='button' type='submit'>
        Publish
      </Button>
    </Wrapper>
  )
}
