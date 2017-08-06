export function trackStartTyping () {
  trackEvent('thread', 'start typing')
}

export function trackSubmit (label, numberOfTweets) {
  trackEvent('thread', 'submit', label, undefined, { metric1: numberOfTweets })
}

export function trackAuthorize (label) {
  trackEvent('thread', 'authorize', label)
}

export function trackAutorizationError (label) {
  trackEvent('thread', 'authorization error', label)
}

export function trackPublish (label, numberOfTweets) {
  trackEvent('thread', 'publish', label, undefined, { metric1: numberOfTweets })
}

export function trackPublicationError () {
  trackEvent('thread', 'publication error')
}

export function trackClickRecommend (label) {
  trackEvent('thread', 'click recommend', label)
}

export function trackClickPublishMore (label) {
  trackEvent('thread', 'click publish more', label)
}

export function trackEvent (category, action, label, value, extra) {
  track('event', category, action, label, value, extra)
}

export function track (hitType, ...fields) {
  window.ga && window.ga('send', hitType, ...fields)
}

export function trackException (err) {
  window.Raven && window.Raven.captureException(err)
}
