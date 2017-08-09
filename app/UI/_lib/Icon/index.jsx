import { h } from 'preact'
import { Wrapper } from './style.css'

export default function (Svg) {
  return function Icon ({ size = 'medium' }) {
    return (
      <Wrapper tag='span' size={size}>
        <Svg fill='currentColor' />
      </Wrapper>
    )
  }
}
