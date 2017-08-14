import 'babel-polyfill'
import { h, render } from 'preact'
import { loop } from 'enso'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import UI from './UI'
import { firebase as firebaseCredentials } from 'app/config'

const { apiKey, authDomain } = firebaseCredentials
firebase.initializeApp({ apiKey, authDomain })

let root
loop({ flashes: [] }, ({ flashes }) => {
  root = render(<UI flashes={flashes} />, document.body, root)
})
