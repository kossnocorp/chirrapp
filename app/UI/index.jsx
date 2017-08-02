import { h, Component } from 'preact'
import Editor from './Editor'
import Done from './Done'
import './style.css'
import firebase from 'firebase'

const provider = new firebase.auth.TwitterAuthProvider()

export default class UI extends Component {
  render ({}, { page = 'editor', auth, publishedURLs, prefilledText }) {
    const user = getUser(auth)

    switch (page) {
      case 'editor':
        return (
          <Editor
            prefilledText={prefilledText}
            onPublish={urls =>
              this.setState({ page: 'done', publishedURLs: urls })}
            user={user}
            signIn={() =>
              signIn().then(auth => {
                this.setState({ auth })
                try {
                  window.localStorage.setItem(
                    'user',
                    JSON.stringify(getUser(auth))
                  )
                } catch (err) {}
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
  }
}

let auth
function signIn () {
  if (auth) {
    return Promise.resolve(auth)
  } else {
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(_auth => (auth = _auth))
      .then(() => auth)
  }
}

function getUser (auth) {
  if (!auth) {
    let userJSON = window.localStorage.getItem('user')
    return userJSON && JSON.parse(userJSON)
  }
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
