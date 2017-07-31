import { h, Component } from 'preact'
import firebase from 'firebase'
import split from '../_lib/split'
import { postJSON } from '../_lib/request'
import Form from './Form'
import Thread from './Thread'
import {
  Layout,
  Main,
  Preview,
  Header,
  Logotype,
  LogoWrapper,
  Headline,
  Stats
} from './style.css'
import Logo from './logo.svg'

export default class UI extends Component {
  render ({}, { text = 'Hello, world!' }) {
    const tweets = split(text)
    return (
      <Layout>
        <Main tag='main'>
          <Header tag='header'>
            <Logotype>
              Chirr App

              <LogoWrapper>
                <Logo />
              </LogoWrapper>
            </Logotype>

            <Headline tag='h1'>
              Chirr App makes it easy to plan and post Twitter threads
            </Headline>
          </Header>

          <Form
            text={text}
            onChange={newText => this.setState({ text: newText })}
            onSubmit={() => publish(split(text))}
          />

          <Stats>
            {pluralize(text.length, 'char', 'chars')} ・{' '}
            {pluralize(tweets.length, 'tweet', 'tweets')}
          </Stats>
        </Main>

        <Preview tag='aside'>
          <Thread tweets={tweets} />
        </Preview>
      </Layout>
    )
  }
}

function publish (tweets) {
  const provider = new firebase.auth.TwitterAuthProvider()
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(({ credential: { accessToken, secret: accessTokenSecret } }) => {
      postJSON('https://us-central1-chirrapp-8006f.cloudfunctions.net/tweet', {
        accessToken,
        accessTokenSecret,
        tweets
      })
        .then(({ url }) => {
          window.location.href = url
        })
        .catch(err => {
          // TODO: Process failed response
        })
    })
}

function pluralize (size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}
