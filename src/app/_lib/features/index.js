import { features } from 'app/config'
import { lsGet } from 'app/_lib/localStorage'

export function featureEnabled(featureName) {
  return features.includes(featureName) || lsGet(`feature-${featureName}`)
}
