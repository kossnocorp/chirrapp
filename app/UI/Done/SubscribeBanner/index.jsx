import { h } from 'preact'
import { Header, Text } from 'app/UI/_lib/Text'
import { V, El } from 'app/UI/_lib/Spacing'
import Banner from 'app/UI/_lib/Banner'
import { Button } from 'app/UI/_lib/Button'
import { Input, FieldError } from 'app/UI/_lib/Input'
import { trackSubscribeSubmit } from 'app/_lib/track'

export default function SubscribeBanner() {
  return (
    <Banner id="subscribe">
      <form
        action="https://cafe.us16.list-manage.com/subscribe/post?u=bf10ea6555c1dc38f3bcfa7e5&id=d5d9685a63"
        method="post"
        target="_blank"
        onSubmit={trackSubscribeSubmit}
      >
        <V size="small">
          <Header size="small">Subscribe to Chirr App updates</Header>
          <Text>
            Get notified when Chirr App got updated. We won't send you spam or
            bother you too often.
          </Text>

          <Input
            tag="input"
            type="email"
            name="EMAIL"
            placeholder="Your email"
          />

          <Button tag="button" type="submit">
            Subscribe
          </Button>
        </V>
      </form>
    </Banner>
  )
}
