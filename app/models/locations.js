const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

exports.find = (params) => {
  let locations = []

  if (params.organisationId) {
    const directoryPath = path.join(__dirname, '../data/locations/' + params.organisationId)

    // to prevent errors when an organisation doesn't have any locations
    // create an empty location directory for the organisation
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }

    let documents = fs.readdirSync(directoryPath,'utf8')

    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

    documents.forEach((filename) => {
      let raw = fs.readFileSync(directoryPath + '/' + filename)
      let data = JSON.parse(raw)
      locations.push(data)
    })

    locations.sort((a,b) => {
      return a.name.localeCompare(b.name)
    })
  }

  return locations
}

exports.findOne = (params) => {

}

exports.insertOne = (params) => {

}

// exports.insertMany = (params) => {
//
// }

exports.updateOne = (params) => {

}

// exports.updateMany = (params) => {
//
// }

exports.deleteOne = (params) => {

}

// exports.deleteMany = (params) => {
//
// }
