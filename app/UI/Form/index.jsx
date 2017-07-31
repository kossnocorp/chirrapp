import { h } from 'preact'
import { Wrapper, Textarea, Button } from './style.css'

export default function Form ({ onChange, onSubmit, text }) {
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
        autoFocus
        value={text}
        onInput={({ target: { value } }) => onChange(value)}
      />

      <Button tag='button' type='submit'>
        Publish
      </Button>
    </Wrapper>
  )
}
