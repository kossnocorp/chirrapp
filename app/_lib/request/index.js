const builtinFetch = window.fetch

export function request (url, options = {}) {
  const { method = 'GET', data, headers } = options
  const _headers = Object.assign({}, headers)

  let fetchOptions = { mode: 'cors' }

  if (data) {
    if (method === 'GET') {
      // TODO: Enable qs when GET with data will be required.
      // url += `?${qs.stringify(data, {arrayFormat: 'brackets'})}`
    } else {
      fetchOptions.body = JSON.stringify(data)
      Object.assign(_headers, { 'Content-Type': 'application/json' })
    }
  }

  return builtinFetch(url, {
    ...fetchOptions,
    method,
    headers: new Headers(_headers)
  }).then(resp => {
    const { status } = resp

    if (status === 500) {
      // TODO: Process 500 when it will be required.
    }

    if (status >= 400) {
      // TODO: Process 4xx when it will be required.
    }

    return resp
  })
}

export function requestJSON (url, options = {}) {
  const headers = Object.assign({}, options.headers || {}, {
    Accept: 'application/json'
  })
  return request(
    url,
    Object.assign({}, Object.assign({}, options, { headers }))
  ).then(resp => resp.json())
}

export function postJSON (url, options = {}) {
  return requestJSON(url, Object.assign({}, options, { method: 'POST' }))
}
