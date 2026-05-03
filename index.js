const express = require("express")
const https = require("https")
const app = express()

// Add middleware to handle request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.all("/*", (req, res) => {
  let options = {
      host: 'dev-nakama.winterpixel.io',
      path: '/' + req.path,
      method: req.method,
      headers: req.headers  // Forward all headers
    };
  
  const proxyReq = https.request(options, (resp) => {
    res.contentType((resp.headers["content-type"] ? resp.headers["content-type"] : "text/plain"))
    resp.pipe(res)
  })
  
  // Forward the request body
  req.pipe(proxyReq)
  
  proxyReq.on('error', (err) => {
    res.status(500).send('Proxy error: ' + err.message)
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
