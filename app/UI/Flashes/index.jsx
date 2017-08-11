import { h } from 'preact'
import { V, H } from 'app/UI/_lib/Spacing'
import { Wrapper, Flash, FlashIcon } from './style.css'
import { Text } from 'app/UI/_lib/Text'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'
import { dismissFlash } from 'app/acts/flashes'

const colors = {
  info: 'main',
  success: 'positive',
  error: 'negative'
}

export default function Flashes ({ flashes }) {
  return (
    <Wrapper>
      <V padded size='big'>
        <V size='small'>
          {flashes.map(flash => {
            const { type, message } = flash
            return (
              <Flash color={colors[type]}>
                <H padded expanded>
                  <Text size='small'>
                    {message}
                  </Text>

                  <FlashIcon onClick={() => dismissFlash(flash)}>
                    <TimesIcon />
                  </FlashIcon>
                </H>
              </Flash>
            )
          })}
        </V>
      </V>
    </Wrapper>
  )
}
