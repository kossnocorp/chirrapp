import { h, Component } from 'preact'
import Editor from './Editor'
import Done from './Done'
import { Layout } from './style.css'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { lsSet, lsGet } from 'app/_lib/localStorage'
import {
  trackAuthorize,
  trackAutorizationError,
  trackException,
  trackClickPublishMore
} from 'app/_lib/track'
import TopBar from './TopBar'
import Flashes from './Flashes'
import { featureEnabled } from 'app/_lib/features'
import { without } from 'lodash'

const provider = new firebase.auth.TwitterAuthProvider()

export default class UI extends Component {
  render ({ flashes }, { page = 'editor', auth, publishedURLs, prefilledText }) {
    const user = getUser(auth)

    return (
      <Layout>
        <TopBar
          openEditor={(source, text = '') => {
            trackClickPublishMore(source)
            this.setState({ page: 'editor', prefilledText: text })
          }}
          signIn={source =>
            signIn(source).then(auth => {
              this.setState({ auth })
              lsSet('user', getUser(auth))
              return auth
            })}
          signedIn={!!auth}
        />

        {(() => {
          switch (page) {
            case 'editor':
              return (
                <Editor
                  key={prefilledText /* re-render when prefilled text changes */}
                  prefilledText={prefilledText}
                  onPublish={urls =>
                    this.setState({ page: 'done', publishedURLs: urls })}
                  user={user}
                  signIn={source =>
                    signIn(source).then(auth => {
                      this.setState({ auth })
                      lsSet('user', getUser(auth))
                      return auth
                    })}
                />
              )

            case 'done':
              return (
                <Done
                  onBack={text => {
                    this.setState({ page: 'editor', prefilledText: text })
                  }}
                  publishedURLs={publishedURLs}
                />
              )
          }
        })()}

        <Flashes flashes={flashes} />
      </Layout>
    )
  }
}

let auth
function signIn (source) {
  if (auth) {
    return Promise.resolve(auth)
  } else {
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(_auth => {
        trackAuthorize(source)
        auth = _auth
      })
      .then(() => auth)
      .catch(err => {
        trackAutorizationError(source)
        trackException(err)
      })
  }
}

function getUser (auth) {
  if (!auth) return lsGet('user')
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
