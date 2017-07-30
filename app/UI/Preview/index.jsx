import { h } from 'preact'
import Tweet from './Tweet'

export default function ({ tweets }) {
  return (
    <aside class='Preview'>
      <div class='Thread'>
        {tweets.map(tweet => <Tweet tweet={tweet} />)}
      </div>
    </aside>
  )
}
