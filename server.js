const express = require('express')
const next = require('next')

const hostname = process.env.RAILWAY_STATIC_URL || "localhost";
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use("/img", express.static(__dirname + "/img"));

  server.all('*', (req, res) => {
      return handle(req, res)
  })
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

})