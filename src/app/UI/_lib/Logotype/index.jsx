import { h } from 'preact'
import Image from './logo.svg'
import { H } from 'app/UI/_lib/Spacing'
import { Wrapper, Text, ImageWrapper } from './style.css'

export default function Logotype({ hideTextAt, onClick }) {
  return (
    <Wrapper onClick={onClick} link={!!onClick} hideTextAt={hideTextAt}>
      <H size="small" adjusted>
        <Text>Chirr App</Text>
        <ImageWrapper>
          <Image />
        </ImageWrapper>
      </H>
    </Wrapper>
  )
}
