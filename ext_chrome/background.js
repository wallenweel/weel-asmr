const JSON_RPC = 'http://localhost:6800/jsonrpc'
const METHOD = 'POST'

chrome.runtime.onMessage.addListener(async ({ payload = {} }) => {
  const { target = 'aria2', url = JSON_RPC, data = {}, config = {} } = payload

  if (target === 'aria2') await Promise.resolve(await aria2download(url, data, config))
})

async function aria2download (url, data = {}, config = {}) {
  return await request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...config
  })
}

function request (url, config = {}) {
  const { timeout } = { timeout: 5000, ...config }

  const controller = new AbortController()
  const signal = controller.signal

  setTimeout(() => controller.abort(), timeout)

  return fetch(url, { signal, ...config })
}
