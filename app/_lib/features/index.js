import config from 'app/config'
import { lsGet } from 'app/_lib/localStorage'

export function featureEnabled (featureName) {
  return (
    config[process.env.NODE_ENV].features.includes(featureName) ||
    lsGet(`feature-${featureName}`)
  )
}
