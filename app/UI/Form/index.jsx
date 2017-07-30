import { h } from 'preact'

export default function Form ({ onChange, onSubmit, text }) {
  return (
    <form
      class='Form'
      action='#'
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <textarea
        class='Textarea'
        autoFocus
        value={text}
        onInput={({ target: { value } }) => onChange(value)}
      />

      <button type='submit' class='Button'>
        Publish
      </button>
    </form>
  )
}
