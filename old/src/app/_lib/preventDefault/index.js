export default function preventDefault(fn) {
  return e => {
    e.preventDefault()
    return fn(e)
  }
}
