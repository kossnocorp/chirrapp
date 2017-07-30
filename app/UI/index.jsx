import { h, Component } from 'preact'
import split from '../_lib/split'
import Form from './Form'
import Preview from './Preview'

export default class UI extends Component {
  render ({}, { text = '' }) {
    const tweets = split(text)
    return (
      <div class='Wrapper'>
        <main class='Main'>
          <header class='Header'>
            <div class='Logo'>Chirr App</div>
            <h1 class='Headline'>Simplifies tweet threads</h1>
          </header>

          <Form
            text={text}
            onChange={newText => this.setState({ text: newText })}
          />

          <div class='Stats'>
            {pluralize(text.length, 'char', 'chars')} ・{' '}
            {pluralize(tweets.length, 'tweet', 'tweets')}
          </div>
        </main>

        <Preview tweets={tweets} />
      </div>
    )
  }
}

function pluralize (size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}
