// ==UserScript==
// @name         Aria2 Common
// @namespace    weel
// @version      0.0.1
// @description  common chunk for aria2 downloading
// @author       wallen
// @grant        GM_xmlhttpRequest
// @include      *://*
// ==/UserScript==

;(global => {
  const JSON_RPC = 'http://localhost:6800/jsonrpc'
  const SAVE_PATH = `E:/11_SHARE/Downloads/`
  const REQUEST_HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/65.0"
  }
  const CONFIG = {
    savepath: SAVE_PATH,
    filename: `%host%/%year%%month%/%file%`,
    proxy: null,
    headers: REQUEST_HEADERS
  }

  const FLAT_FILENAME = false
  const FILENAME_LENGTH = 228
  const FILE_EXT = 'jpg|jpeg|png|gif|mp4|webm|blank'
  const FILE_EXT_REG = new RegExp(`\\.(?=${FILE_EXT})`)
  const SEPARATOR = '_'

  global.weel_aria2 = {
    config: null,
    options(customConfig, data) {
      const { proxy, savepath, filename } = { ...CONFIG, ...(this.config || customConfig) }

      return {
        'all-proxy': proxy,
        'dir': savepath,
        'out': getfilename(filename, data)
      }
    },
    download (uri, data = {}, customConfig = {}) {
      const options = this.options(customConfig, { uri, ...data })

      for (let [k, v] of Object.entries(options)) {
        if (!v) delete options[k]
      }
      console.log(options)

      const event = new CustomEvent('weel', { detail: {
        version: '1.0',
        type: 'asmr',
        payload: {
          url: JSON_RPC,
          target: 'aria2',
          data: {
            jsonrpc: '2.0',
            id: uuid(),
            method: 'aria2.addUri',
            params: [[uri], options]
          }
        }
      }})

      window.dispatchEvent(event)
    }
  }

  function uuid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = (c === 'x') ? r : (r & 0x3 | 0x8)

      return v.toString(16)
    })
  }

  function masker (filename = '', data = {}) {
    const date = new Date()

    let year = `${date.getFullYear()}`
    let year2 = year.slice(2)

    let month = `${date.getMonth() + 1}`
    month = month.length - 1 ? month : `0${month}`

    let day = `${date.getDate()}`
    day = day.length - 1 ? day : `0${day}`

    let host = location.host
    let file = data.uri ? data.uri.split('/').pop() : 'filename.blank'
    file = file.split('?')[0]

    return filename.replace(/%(.+?)%/g, (_, $) =>
      ({ year, year2, month, day, host, file, ...data }[$] || '').trim())
  }

  function getfilename (filename, data = {}, nospace = true, nocamels = true) {
    const sep = SEPARATOR

    let r = masker(filename, data)

    if (!!nospace) r = r.replace(/\s+/g, sep)
    if (!!nocamels) r = r.replace(/([a-z])([A-Z])/g, ($0, $1, $2) => $1 ? $1 + sep + $2 : $0)

    r = r.toLowerCase().replace(
      new RegExp(`${sep}+(\\.)|${sep}*(-)${sep}*|(${sep}){2,}`, 'g'),
      (...$) => ((!!FLAT_FILENAME ? false : $[2]) || $[1] || sep))

    r = r.split(sep).join(sep)

    let [name, ext] = r.split(FILE_EXT_REG)
    name = name.slice(0, FILENAME_LENGTH) || 'blank'
    ext = ext || data.ext || 'ext'

    return `${name}.${ext}`
  }
})(unsafeWindow)