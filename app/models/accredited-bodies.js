const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')

const directoryPath = path.join(__dirname, '../data/organisations/')

exports.insertOne = (params) => {
  console.log('insertOne',params);
  let organisation

  if (params.organisationId) {
    organisation = organisationModel.findOne({ organisationId: params.organisationId })

    const accreditedBody = organisationModel.findOne({ organisationId: params.accreditedBody.id })
console.log(accreditedBody);
    const ab = {}
    ab.id = accreditedBody.id
    ab.code = accreditedBody.code
    ab.name = accreditedBody.name
    ab.description = params.accreditedBody.description

    organisation.accreditedBodies.push(ab)
console.log(organisation.accreditedBodies);
    organisation.updatedAt = new Date()

    const filePath = directoryPath + '/' + params.organisationId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(organisation)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return organisation
}

exports.updateOne = (params) => {
  console.log('updateOne',params);
  let organisation

  if (params.organisationId) {
    organisation = organisationModel.findOne({ organisationId: params.organisationId })

    if (params.accreditedBodyId) {
      organisation.accreditedBodies.forEach((accreditedBody, i) => {
        if (accreditedBody.id === params.accreditedBodyId) {
          accreditedBody.description = params.accreditedBody.description
        }
      })
    }

    organisation.updatedAt = new Date()

    const filePath = directoryPath + '/' + params.organisationId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(organisation)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return organisation
}
