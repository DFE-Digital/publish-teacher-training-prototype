const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')

const directoryPath = path.join(__dirname, '../data/organisations/')

exports.updateOne = (params) => {
  if (params.organisationId) {
    let organisation = organisationModel.findOne({ organisationId: params.organisationId })

    // permissions


    organisation.updatedAt = new Date()

    const filePath = directoryPath + '/' + organisation.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(organisation)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }
}
