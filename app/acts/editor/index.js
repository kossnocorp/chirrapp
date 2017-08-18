import { act } from 'enso'
import { lsSet } from 'app/_lib/localStorage'

export function enableNumbring() {
  updateNumbering(true)
}

export function disableNumbring() {
  updateNumbering(false)
}

function updateNumbering(numberingEnabled) {
  lsSet('numbering-enabled', numberingEnabled)
  act(state => ({ ...state, numberingEnabled }))
}
