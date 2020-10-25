const qs = require('qs')
const net = require('net')
const parserHTML = require('./parser')

class Request {
  constructor(options) {
    this.method = options.method.toUpperCase() || 'GET'
    this.ip = options.ip || '127.0.0.1'
    this.port = options.port || 3000,
    this.path = options.path || '/'
    this.headers = options.headers || {}
    this.body = options.body || {}
    this.bodyText = ''
    if(!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = qs.stringify(this.body)
    }
    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }

  send() {
    return new Promise((reslove, reject) => {
      const connection = net.createConnection({
        host: this.host,
        port: this.port
      })

      const request = this.toString()
      connection.write(request)

      connection.on('data', data => {
        const parser = new ResponseParser()
        reslove(parser.parse(data.toString()))
        connection.destroy()
      })
    })
  }
}

class ResponseParser {
  constructor() {
    this.statusText = ''
    this.statusCode = 0
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
  }

  parse(responseText) {
    const lines = responseText.split('\r\n')
    let statusReg = /^.+ (\d+) (.+)$/
    this.statusCode = lines[0].match(statusReg)[1]
    this.statusText = lines[0].match(statusReg)[2]
    const headerLines = lines.slice(1, lines.findIndex(line => line === ''))
    let headerReg = /^(.+): (.+)$/
    for (let line of headerLines) {
      let matches = line.match(headerReg)
      this.headers[matches[1]] = matches[2]
    }
    return {
      statusCode: this.statusCode,
      statusText: this.statusText,
      headers: this.headers,
      body: lines[lines.length - 1]
    }
  }

}

async function makeRequest() {
  const request = new Request({
    method: 'post',
    ip: '127.0.0.1',
    port: 3000,
    path: '/',
    headers: {
      "X-Customized-header": null
    },
    body: {
      name: 'haoran'
    }
  })

  const res = await request.send()

  parserHTML(res.body)

}

makeRequest()