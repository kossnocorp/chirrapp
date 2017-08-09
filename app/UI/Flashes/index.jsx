import { h } from 'preact'
import { V, H } from 'app/UI/_lib/Spacing'
import { Wrapper, Flash, FlashText, FlashIcon } from './style.css'
import TimesIcon from 'app/UI/_lib/Icon/times.svg'

export default function Flashes () {
  return (
    <Wrapper>
      <V padded size='big'>
        <V size='small'>
          <Flash>
            <H padded expanded>
              <FlashText>
                Test, test, test, very long text, whatever, waaaaaaatveveveve
                longwordislonglongcatislong
              </FlashText>
              <FlashIcon>
                <TimesIcon />
              </FlashIcon>
            </H>
          </Flash>

          <Flash>
            <H padded expanded>
              <FlashText>
                Hello, world
              </FlashText>
              <FlashIcon>
                <TimesIcon />
              </FlashIcon>
            </H>
          </Flash>

          <Flash color='red'>
            <H padded expanded>
              <FlashText>
                Something went wrong, please try again.
              </FlashText>
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
