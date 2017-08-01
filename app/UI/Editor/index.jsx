import { h, Component } from 'preact'
import firebase from 'firebase'
import split from '../../_lib/split'
import { postJSON } from '../../_lib/request'
import Form from './Form'
import Thread from './Thread'
import {
  Wrapper,
  Main,
  Preview,
  Header,
  Headline,
  Stats,
  ThreadWrapper,
  PreviewDisclaimer
} from './style.css'
import { Link } from '../_lib/Link.css'
import Logotype from '../_lib/Logotype'

const promoText =
  "The Twitter threads feature is an amazing way to tell a story and express complex ideas. That also allows to hear the voices outside of your social circle and discover new ideas. Yet it's not easy to plan and publish a thread, Twitter UI just isn't made for that. Chirr App makes it easy to build and publish Twitter threads. It's free and open source! Try it out: https://getchirrapp.com!"

export default class Editor extends Component {
  render ({ prefilledText, onPublish }, { text: _text, auth, publishing }) {
    const text =
      typeof _text === 'string'
        ? _text
        : typeof prefilledText === 'string' ? prefilledText : promoText
    const tweets = split(text)
    const user = getUserFromAuth(auth)
    const { name, screenName, avatarURL } = user || {}

    return (
      <Wrapper>
        <Main tag='main'>
          <Header tag='header'>
            <Logotype />

            <Headline tag='h1'>
              Chirr App makes it easy to plan and post Twitter threads
            </Headline>
          </Header>

          <Form
            text={text}
            onChange={newText => this.setState({ text: newText })}
            onSubmit={() => {
              this.setState({ publishing: true })
              publish(split(text)).then(onPublish)
            }}
            publishing={publishing}
          />

          <Stats>
            {pluralize(text.length, 'char', 'chars')} ・{' '}
            {pluralize(
              text.length === 0 ? 0 : tweets.length,
              'tweet',
              'tweets'
            )}
          </Stats>
        </Main>

        <Preview tag='aside'>
          <ThreadWrapper>
            <Thread
              tweets={tweets}
              name={name}
              screenName={screenName}
              avatarURL={avatarURL}
            />
          </ThreadWrapper>

          {user
            ? null
            : <PreviewDisclaimer>
                The thread will be published under your name, this is just a
                preview.
                <br />
                <Link
                  tag='a'
                  href='#'
                  onClick={e => {
                    e.preventDefault()
                    signIn().then(auth => this.setState({ auth }))
                  }}
                >
                  Login to make it personal
                </Link>.
              </PreviewDisclaimer>}
        </Preview>
      </Wrapper>
    )
  }
}

const provider = new firebase.auth.TwitterAuthProvider()

let auth
function signIn () {
  if (auth) {
    return Promise.resolve(auth)
  } else {
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(_auth => (auth = _auth))
  }
}

function getUserFromAuth (auth) {
  if (!auth) return
  const {
    additionalUserInfo: {
      profile: {
        name,
        screen_name: screenName,
        profile_image_url_https: avatarURL
      }
    }
  } = auth
  return {
    name,
    screenName,
    avatarURL: avatarURL.replace('normal', '200x200')
  }
}

function publish (tweets) {
  const provider = new firebase.auth.TwitterAuthProvider()
  return signIn()
    .then(({ credential: { accessToken, secret: accessTokenSecret } }) => {
      return postJSON(
        'https://us-central1-chirrapp-8006f.cloudfunctions.net/tweet',
        {
          accessToken,
          accessTokenSecret,
          tweets
        }
      )
    })
    .then(({ urls }) => urls)
    .catch(err => {
      // TODO: Process failed response
    })
}

function pluralize (size, one, many) {
  return `${size} ${size === 1 ? one : many}`
}
