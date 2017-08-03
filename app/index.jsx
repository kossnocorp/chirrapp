import 'babel-polyfill'
import { h, render } from 'preact'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import UI from './UI'

firebase.initializeApp({
  apiKey: 'AIzaSyDYgmEzXJ0OJ5ftydVnBK4D2afYWlIi7HE',
  authDomain: 'getchirrapp.com'
})

render(<UI />, document.body)
