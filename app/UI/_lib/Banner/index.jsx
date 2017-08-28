import { h, Component } from 'preact'
import { V, El } from 'app/UI/_lib/Spacing'
import { Wrapper, Dismiss } from './style.css'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'
import { lsSet, lsGet } from 'app/_lib/localStorage'

export default class Banner extends Component {
  render({ children, id }, { show = true }) {
    if (lsGet(dimissID(id)) || !show) return null

    return (
      <Wrapper>
        <Dismiss onClick={() => this.dismiss()}>
          <TimesIcon />
        </Dismiss>

        <El padded>
          {children}
        </El>
      </Wrapper>
    )
  }

  dismiss() {
    lsSet(dimissID(this.props.id), true)
    this.setState({ show: false })
  }
}

function dimissID(id) {
  return `banner-${id}-dismissed`
}
