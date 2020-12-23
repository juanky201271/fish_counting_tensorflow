const yelp = require("yelp-fusion")

getYelpSearch = async (req, res) => {

  const apiKey = process.env.YELP_API_KEY
  const searchRequest = {
    locale: req.params.locale,
    categories: req.params.categories,
    location: req.params.location,
  }

  const client = yelp.client(apiKey)

  client.search(searchRequest)
    .then(response => {
      const result = response.jsonBody
      return res.status(200).json({ success: true, data: result })
    }).catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })

}

module.exports = {
  getYelpSearch,
}
