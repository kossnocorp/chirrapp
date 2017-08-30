import { h } from 'preact'
import Banner from 'app/UI/_lib/Banner'

export default function ClapBanner() {
  return (
    <Banner id="clap">
      <div id="clap-widget" data-key="-KscuHHA1socHVlyacdZ">
        <script async src="https://clap.tips/widget.js" async />
      </div>
    </Banner>
  )
}
