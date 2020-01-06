import { h } from 'preact'
import { Link } from 'app/UI/_lib/Link'
import { Text } from 'app/UI/_lib/Text'
import { trackFeedbackClick } from 'app/_lib/track'
import { Section, Wrapper } from './style.css'

export default function FooterLine() {
  return (
    <Wrapper>
      <Section>
        <Link tag="a" href="mailto:koss@nocorp.me" onClick={trackFeedbackClick}>
          Leave feedback
        </Link>

        <Link
          tag="a"
          href="https://www.buymeacoffee.com/kossnocorp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a coffee
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
