import { h, render } from 'preact'
import firebase from 'firebase'
import UI from './UI'

firebase.initializeApp({
  apiKey: 'AIzaSyDYgmEzXJ0OJ5ftydVnBK4D2afYWlIi7HE',
  authDomain: 'getchirrapp.com'
})

render(<UI />, document.body)
