import { h } from 'preact'
import Banner from 'app/UI/_lib/Banner'
import { Button } from 'app/UI/_lib/Button'
import { V } from 'app/UI/_lib/Spacing'
import { Header, Text } from 'app/UI/_lib/Text'

export default function BuyMeACoffeeBanner() {
  return (
    <Banner id="buymeacoffee" pinned>
      <V size="small">
        <Header size="small">☕️ Do you like Chirr App?</Header>

        <Text>
          Hi, my name is Sasha! I'm the author of Chirr App. If it's helpful to
          you, support me by buying me a coffee.
        </Text>

        <Button
          tag="a"
          href="https://www.buymeacoffee.com/kossnocorp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a coffee
        </Button>
      </V>
    </Banner>
  )
}
