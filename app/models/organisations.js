const path = require('path')
const fs = require('fs')

exports.find = (params) => {

}

exports.findOne = (params) => {
  let organisation = {}

  if (params.organisationId) {
    const directoryPath = path.join(__dirname, '../data/organisations/')

    const filePath = directoryPath + '/' + params.organisationId + '.json'

    let raw = fs.readFileSync(filePath)
    organisation = JSON.parse(raw)
  }

  return organisation
}

exports.updateOne = (params) => {

}
