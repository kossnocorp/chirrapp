import 'babel-polyfill'
import { h, render } from 'preact'
import { loop } from 'enso'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import UI from './UI'

firebase.initializeApp({
  apiKey: 'AIzaSyDYgmEzXJ0OJ5ftydVnBK4D2afYWlIi7HE',
  authDomain: 'getchirrapp.com'
})

let root
loop({ flashes: [] }, ({ flashes }) => {
  root = render(<UI flashes={flashes} />, document.body, root)
})
