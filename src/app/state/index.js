import { h } from 'preact'
import { loop as ensoLoop } from 'enso'
import { lsGet } from 'app/_lib/localStorage'

let state = {
  flashes: [],
  numberingEnabled: lsGet('numbering-enabled')
}

export function loop(render) {
  ensoLoop(state, newState => {
    state = newState
    render(state)
  })
}

export function connect(getProps, Component) {
  const ConnectedComponent = props =>
    <Component {...props} {...getProps(state)} />
  ConnectedComponent.displayName = `Connected${Component.displayName}`
  return ConnectedComponent
}
