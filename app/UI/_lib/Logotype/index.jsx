import { h } from 'preact'
import Image from './logo.svg'
import { Wrapper, ImageWrapper } from './style.css'

export default function Logotype ({ onClick }) {
  return (
    <Wrapper onClick={onClick} link={!!onClick}>
      Chirr App
      <ImageWrapper>
        <Image />
      </ImageWrapper>
    </Wrapper>
  )
}
