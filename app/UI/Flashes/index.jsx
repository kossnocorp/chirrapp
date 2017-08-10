import { h } from 'preact'
import { V, H } from 'app/UI/_lib/Spacing'
import { Wrapper, Flash, FlashIcon } from './style.css'
import { Text } from 'app/UI/_lib/Text'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'

export default function Flashes () {
  return (
    <Wrapper>
      <V padded size='big'>
        <V size='small'>
          <Flash>
            <H padded expanded>
              <Text size='small'>
                Test, test, test, very long text, whatever, waaaaaaatveveveve
                longwordislonglongcatislonglonglonglonglong
              </Text>

              <FlashIcon>
                <TimesIcon />
              </FlashIcon>
            </H>
          </Flash>

          <Flash color='positive'>
            <H padded expanded>
              <Text size='small'>
                Hello, world
              </Text>

              <FlashIcon>
                <TimesIcon />
              </FlashIcon>
            </H>
          </Flash>

          <Flash color='negative'>
            <H padded expanded>
              <Text size='small'>
                Something went wrong, please try again.
              </Text>

              <FlashIcon>
                <TimesIcon />
              </FlashIcon>
            </H>
          </Flash>
        </V>
      </V>
    </Wrapper>
  )
}
