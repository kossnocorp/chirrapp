import { act } from 'enso'
import { lsSet } from 'app/_lib/localStorage'

export function enableNumbering() {
  updateNumbering(true)
}

export function disableNumbering() {
  updateNumbering(false)
}

function updateNumbering(numberingEnabled) {
  lsSet('numbering-enabled', numberingEnabled)
  act(state => ({ ...state, numberingEnabled }))
}
