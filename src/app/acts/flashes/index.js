import { act } from 'enso'
import { without } from 'lodash'

export function pushFlash (flash) {
  act(state => {
    console.log(flash)
    if (flash.timeout) {
      setTimeout(() => dismissFlash(flash), flash.timeout)
    }

    return Object.assign({}, state, { flashes: state.flashes.concat(flash) })
  })
}

export function dismissFlashGroup (group) {
  act(state =>
    Object.assign({}, state, {
      flashes: state.flashes.filter(({ group: _group }) => group !== _group)
    })
  )
}

export function dismissFlash (flash) {
  act(state =>
    Object.assign({}, state, {
      flashes: without(state.flashes, flash)
    })
  )
}
