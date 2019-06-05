import 'babel-polyfill'
import { h, render } from 'preact'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import UI from './UI'
import { firebase as firebaseCredentials } from 'app/config'
import { loop } from 'app/state'

const { apiKey, authDomain } = firebaseCredentials
firebase.initializeApp({ apiKey, authDomain })

let root
loop(({ flashes }) => {
  root = render(<UI flashes={flashes} />, document.body, root)
})
