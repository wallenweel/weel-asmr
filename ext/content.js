window.addEventListener('weel', async ({ detail = {} }) => {
  const { version = '1.0', type = 'asmr', payload = {} } = detail

  if ('1.0' !== version) return false

  if ('asmr' === type) await send({ type, payload })
}, false)

function send (message) {
  return browser.runtime.sendMessage(message)
}
