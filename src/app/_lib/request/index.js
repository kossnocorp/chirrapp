export function postJSON (url, json) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    req.open('POST', url, true)
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    req.withCredentials = false

    req.onreadystatechange = () => {
      if (req.readyState !== 4) return

      if (req.status >= 200 && req.status < 300) {
        resolve(JSON.parse(req.responseText))
      } else {
        try {
          reject(JSON.parse(req.responseText))
        } catch (err) {
          reject(req)
        }
      }
    }

    req.send(JSON.stringify(json))
  })
}
