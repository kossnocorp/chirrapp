import { h, Component } from 'preact'
import firebase from 'firebase'
import split from '../_lib/split'
import { postJSON } from '../_lib/request'
import Form from './Form'
import Preview from './Preview'

export default class UI extends Component {
  render ({}, { text = 'Hello, world!' }) {
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
            onSubmit={() => publish(split(text))}
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

function publish (tweets) {
  const provider = new firebase.auth.TwitterAuthProvider()
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(({ credential: { accessToken, secret } }) => {
      postJSON('https://us-central1-chirrapp-8006f.cloudfunctions.net/tweet', {
        accessToken,
        secret,
        tweets
      })
        .then(data => {
          console.log('Response:', data)
        })
        .catch(err => {
          // TODO: Process failed response
        })
    })
}

function pluralize (size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}
