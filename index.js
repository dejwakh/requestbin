const express = require('express')
const app = express()
const port = 3000
const host = "https://briefcat.co/"
const form = "<form action='/new' method='POST'>Click <button>NEW</button> to get your own URL</form>"

const {generateHash, timeStamp, format} = require('./src/helpers')

var redis = require('redis')
var client = redis.createClient()
client.on('error', function (err) {
  console.log('Error ' + err)
})

app.use(express.json()) // for parsing JSON
app.use(express.urlencoded({ extended: true })) // for parsing URLEncoded

app.get('/', (req, res) => {
  res.send("Hello!" + form)
})

app.post('/new', (req, res) => {
  const hash = generateHash()
  const link = host+hash
  client.ZADD(hash, 0, `{"setup": "${timeStamp()} ** SETUP ** ${link}"}`, redis.print)
  res.send(`Use this spankin new, unique URL for your webhooks: <a href ='/${hash}'>${link}</a>`)
})

app.get('/:hash', (req, res) => {
  const hash = req.params.hash
  client.ZRANGE(hash, 0, -1, (err, arr) => {
    if (arr.length) {
      let page = '<ul>'
      arr.forEach(r => page += format(r))
      page += '</ul>'
      res.send(`${arr.length-1} Webhooks received (<a href='/${hash}'>refresh</a> to update): ` + page)
    } else {
      res.send("Sorry! this hash doesn't exist. <br>" + form)
    }
  })
})

app.post('/:hash', (req, res) => {
  const hash = req.params.hash
  client.ZRANGE(hash, 0, -1, (err, val) => {
    if (val.length) {
      const request = {
        timestamp: timeStamp(),
        headers: req.headers, 
        body: req.body
      }
      client.ZADD(hash, val.length, JSON.stringify(request), redis.print)
      res.send('Your webhook has been received and added!')
    } else {
      res.sendStatus(404); // hash does not exist
    }
  })

})

app.listen(port, () => {
  console.log(`requestbin listening at http://localhost:${port}`)
})