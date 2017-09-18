export function trackStartTyping() {
  trackEvent('thread', 'start typing')
}

export function trackSubmit(label, numberOfTweets, hasReply) {
  trackEvent('thread', 'submit', label, undefined, {
    metric1: numberOfTweets,
    metric2: hasReply ? 1 : 0
  })
}

export function trackAuthorize(label) {
  trackEvent('thread', 'authorize', label)
}

export function trackAutorizationError(label) {
  trackEvent('thread', 'authorization error', label)
}

export function trackPublish(
  label,
  { numberOfTweets, hasReply, numberingEnabled, delay }
) {
  trackEvent('thread', 'publish', label, undefined, {
    metric1: numberOfTweets,
    metric2: hasReply ? 1 : 0,
    metric3: numberingEnabled ? 1 : 0,
    metric4: delay
  })
}

export function trackPublicationError() {
  trackEvent('thread', 'publication error')
}

export function trackClickRecommend(label) {
  trackEvent('thread', 'click recommend', label)
}

export function trackClickPublishMore(label) {
  trackEvent('thread', 'click publish more', label)
}

export function trackMobileMenuToggle() {
  trackEvent('thread', 'mobile menu toggle')
}

export function trackReplyClick() {
  trackEvent('thread', 'reply click')
}

export function trackSubmitSubscribe() {
  trackEvent('thread', 'submit subscribe')
}

export function trackClickSubscribe() {
  trackEvent('thread', 'click subscribe')
}

export function trackClickFollow() {
  trackEvent('thread', 'click follow')
}

export function trackDismissBanner(label) {
  trackEvent('thread', 'dismiss banner', label)
}

export function trackFeedbackClick() {
  trackEvent('thread', 'click feedback')
}

export function trackNumberingClick() {
  trackEvent('thread', 'numbering click')
}

export function trackDelayClick() {
  trackEvent('thread', 'delay click')
}

export function trackEvent(category, action, label, value, extra) {
  track('event', category, action, label, value, extra)
}

export function track(hitType, ...fields) {
  window.ga && window.ga('send', hitType, ...fields)
}

export function trackException(err) {
  window.Raven && window.Raven.captureException(err)
}
