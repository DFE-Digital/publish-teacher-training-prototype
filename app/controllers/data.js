const dataModel = require('../models/data')

exports.seed = (req, res) => {
  dataModel.seed()
  res.send('Seeding')
}
