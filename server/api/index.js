const axios = require('axios')
const router = require('express').Router()
const CoinMarketCap = require('coinmarketcap-api')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 10, checkperiod: 120 })

const luxor = axios.create({
  baseURL: 'http://explorer.luxor.tech:6001',
  timeout: 15000,
  headers: {
    'User-Agent': 'Sia-Agent'
  }
})

const cmc = new CoinMarketCap()

const TICKER_KEY = 'Ticker'

/*
/explorer
/explorer/pending
/explorer/ws
/explorer/tx/ws
/explorer/blocks/:height
/explorer/hashes/:hash
*/

// returns curr block
router.get('/latest', (req, res) => {
  cache.get('LATEST', async (err, val) => {
    if (!err) {
      if (val === undefined) {
        luxor
          .get('/explorer')
          .then(({ data }) => {
            cache.set('LATEST', data.blocks[0])
            res.send(data.blocks[0])
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        res.send(val)
      }
    }
  })
})

router.get('/latestblocks', (req, res) => {
  cache.get('LATEST_BLOCKS', async (err, val) => {
    if (!err) {
      if (val === undefined) {
        const { data } = await luxor.get('/explorer')
        const { height } = data.blocks[0]
        luxor
          .get('/explorer/blocks', {
            params: {
              from: height - 5,
              to: height
            }
          })
          .then(({ data }) => {
            cache.set('LATEST_BLOCKS', data)
            res.send(data)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        res.send(val)
      }
    }
  })
})

router.get('/blocks/:height', (req, res) => {
  const { height } = req.params
  cache.get(`HEIGHT${height}`, async (err, val) => {
    if (!err) {
      if (val === undefined) {
        luxor
          .get(`/explorer/blocks/${height}`)
          .then(({ data }) => {
            cache.set(`HEIGHT${height}`, data)
            res.send(data)
          })
          .catch(err => {
            res.status(400).send(err.response.data)
            console.log(err)
          })
      } else {
        res.send(val)
      }
    }
  })
})

router.get('/hashes/:hash', (req, res) => {
  const { hash } = req.params
  cache.get(`HASH${hash}`, async (err, val) => {
    if (!err) {
      if (val === undefined) {
        luxor
          .get(`/explorer/hashes/${hash}`)
          .then(({ data }) => {
            cache.set(`HASH${hash}`, data)
            res.send(data)
          })
          .catch(err => {
            res.status(400).send(err.response.data)
            console.log(err)
          })
      } else {
        res.send(val)
      }
    }
  })
})

router.get('/pending', (req, res) => {
  cache.get('PENDING', async (err, val) => {
    if (!err) {
      if (val === undefined) {
        luxor
          .get('/explorer/pending')
          .then(({ data }) => {
            cache.set('PENDING', data)
            res.send(data)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        res.send(val)
      }
    }
  })
})

router.get('/price', (req, res) => {
  cache.get(TICKER_KEY, (err, val) => {
    if (!err) {
      if (val === undefined) {
        cmc
          .getTicker({
            currency: 'siacoin'
          })
          .then(data => {
            cache.set(TICKER_KEY, data)
            res.send(data)
          })
          .catch(console.error)
      } else {
        // cache hit
        res.send(val)
      }
    } else {
      console.log(
        'Error in caching CMC infrastructure.  This needs to be investigated. Making the API call as a fallback'
      )
      cmc
        .getTicker({
          currency: 'siacoin'
        })
        .then(data => {
          cache.set(TICKER_KEY, data)
          res.send(data)
        })
        .catch(console.error)
    }
  })
})

module.exports = router
