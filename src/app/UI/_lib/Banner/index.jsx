import { h, Component } from 'preact'
import { V, El } from 'app/UI/_lib/Spacing'
import { Wrapper, Dismiss } from './style.css'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'
import { lsSet, lsGet } from 'app/_lib/localStorage'
import { trackDismissBanner } from 'app/_lib/track'

export default class Banner extends Component {
  render({ children, id, pinned }, { show = true }) {
    if (lsGet(dimissID(id)) || !show) return null

    return (
      <Wrapper>
        {!pinned && (
          <Dismiss onClick={() => this.dismiss()}>
            <TimesIcon />
          </Dismiss>
        )}

        <El padded>{children}</El>
      </Wrapper>
    )
  }

  dismiss() {
    const { id } = this.props
    lsSet(dimissID(id), true)
    this.setState({ show: false })
    trackDismissBanner(id)
  }
}

function dimissID(id) {
  return `banner-${id}-dismissed`
}
