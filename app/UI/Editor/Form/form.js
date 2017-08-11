import { cloneDeep, update } from 'lodash'

export function initialForm ({ text }) {
  return {
    fields: {
      hasReply: {
        value: false
      },

      replyURL: {
        value: '',
        valid: true
      },

      text: {
        value: text
      }
    }
  }
}

export function updateOnInput (comp, key, cb) {
  return ({ target: { value } }) => {
    comp.setState({
      form: updateField(comp.state.form, key, value)
    })

    return cb && cb(value, key)
  }
}

export function updateOnClick (comp, key, value) {
  return () => {
    comp.setState({
      form: updateField(comp.state.form, key, value)
    })
  }
}

export function updateField (form, key, value) {
  return update(cloneDeep(form), ['fields', key, 'value'], () => value)
}

export function trySubmit (form) {
  const newForm = cloneDeep(form)

  Object.keys(newForm.fields).forEach(fieldKey => {
    const field = newForm.fields[fieldKey]
    Object.assign(field, {
      valid: field.validate ? field.validate(field.value) : true
    })
  })

  const valid = Object.values(newForm.fields).some(value => !value)

  Object.assign(newForm, {
    valid,
    submitting: valid,
    onceTriedToSubmit: true
  })

  return newForm
}

export function processResponse (form, data) {
  const newForm = cloneDeep(form)

  Object.assign(newForm, {
  })

  return newForm
}
