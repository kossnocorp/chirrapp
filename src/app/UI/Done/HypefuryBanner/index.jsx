import { h } from 'preact'
import Banner from 'app/UI/_lib/Banner'
import { Button } from 'app/UI/_lib/Button'
import { V } from 'app/UI/_lib/Spacing'
import { Header, Text } from 'app/UI/_lib/Text'

export default function HypefuryBanner() {
  return (
    <Banner id="hypefury" pinned>
      <V size="small">
        <Header size="small">🔥 Want more?</Header>

        <Text>
          Try Hypefury and level up your Twitter game. It allows scheduling
          threads, retweets, and provides useful analytics that will help you to
          understand your auditory better.
        </Text>

        <Button
          tag="a"
          href="https://hypefury.com/?via=kossnocorp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try Hypefury
        </Button>
      </V>
    </Banner>
  )
}
