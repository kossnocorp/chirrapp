export function lsSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {}
}

export function lsGet(key) {
  try {
    const item = window.localStorage.getItem(key)
    return item && JSON.parse(item)
  } catch (err) {}
}
