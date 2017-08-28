import { h } from 'preact'
import { Text } from 'app/UI/_lib/Text'
import { Link, LinkIcon } from 'app/UI/_lib/Link'
import { Wrapper, Section } from './style.css'
import { trackClickSubscribe, trackFeedbackClick } from 'app/_lib/track'

export default function FooterLine() {
  return (
    <Wrapper>
      <Section>
        <Link
          tag="a"
          href="mailto:ahoy@getchirrapp.com"
          onClick={trackFeedbackClick}
        >
          Leave feedback
        </Link>

        <Link
          tag="a"
          href="https://cafe.us16.list-manage.com/subscribe/post?u=bf10ea6555c1dc38f3bcfa7e5&id=d5d9685a63"
          onClick={trackClickSubscribe}
        >
          Subscribe to updates
        </Link>
      </Section>

      <Section>
        <Text>
          Made by <a href="https://twitter.com/kossnocorp">@kossnocorp</a>
        </Text>

        <Text>
          <a href="https://teleport.cafe/">Teleport</a> ©{' '}
          {new Date().getFullYear()}
        </Text>
      </Section>
    </Wrapper>
  )
}
