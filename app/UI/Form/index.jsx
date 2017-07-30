import { h } from 'preact'

export default function Form ({ onChange, text }) {
  return (
    <form class='Form' action='#'>
      <textarea
        class='Textarea'
        autoFocus
        value={text}
        onInput={({ target: { value } }) => onChange(value)}
      />

      <button type='button' class='Button'>
        Publish
      </button>
    </form>
  )
}
