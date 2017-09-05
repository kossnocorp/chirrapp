import { cloneDeep, update, merge, map, fromPairs } from 'lodash'
import { lsSet, lsGet } from 'app/_lib/localStorage'

export function initialForm({ text }) {
  const fields = merge(
    {
      hasReply: {
        value: false
      },

      replyURL: {
        value: '',
        valid: true,
        validate: (
          value,
          {
            fields: {
              hasReply: { value: hasReply },
              replyURL: { value: replyURL }
            }
          }
        ) => {
          const valid =
            !hasReply ||
            /^https:\/\/twitter\.com\/\w+\/status\/\d+\/?$/.test(
              replyURL.trim()
            )

          return {
            valid,
            error: valid
              ? null
              : 'URL should match https://twitter.com/xxx/status/999'
          }
        }
      },

      delay: {
        value: undefined,
        valid: true,
        validate: (value, { fields: { delay: { value: delay } } }) => {
          const valid = delay === undefined || !Number.isNaN(parseInt(delay))
          return {
            valid,
            error: valid ? null : 'The delay should be in seconds'
          }
        }
      },

      text: {
        value: text,
        valid: true,
        validate: value => {
          const valid = !!value.trim()
          return {
            valid,
            error: valid ? null : 'There is nothing to publish'
          }
        }
      }
    },
    lsGet('editor-form') || {}
  )

  // XXX: Fallback for initial text
  if (!fields.text.value) {
    fields.text.value = text
  }

  return {
    fields
  }
}

export function updateOnInput(comp, key, cb) {
  return ({ target: { value } }) => {
    comp.setState({
      form: updateField(comp.state.form, key, value)
    })

    return cb && cb(value, key)
  }
}

export function updateOnClick(comp, key, value) {
  return () => {
    comp.setState({
      form: updateField(comp.state.form, key, value)
    })
  }
}

export function updateField(form, key, value) {
  const newForm = update(cloneDeep(form), ['fields', key, 'value'], () => value)
  lsSet(
    'editor-form',
    fromPairs(map(newForm.fields, ({ value }, k) => [k, { value }]))
  )
  return newForm
}

export function trySubmit(form) {
  const newForm = cloneDeep(form)

  Object.keys(newForm.fields).forEach(fieldKey => {
    const field = newForm.fields[fieldKey]
    Object.assign(
      field,
      field.validate
        ? field.validate(field.value, form)
        : { valid: true, error: null }
    )
  })

  const valid = !Object.values(newForm.fields).some(({ valid }) => !valid)

  Object.assign(newForm, {
    valid,
    error: valid ? null : "We can't publish that ლ(ಠ_ಠლ)",
    submitting: valid,
    onceTriedToSubmit: true
  })

  return newForm
}

export function processResponse(form, data) {
  const newForm = cloneDeep(form)

  Object.assign(newForm, {})

  return newForm
}
