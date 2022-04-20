const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')

const directoryPath = path.join(__dirname, '../data/organisations/')

exports.insertOne = (params) => {
  let organisation

  if (params.organisationId) {
    organisation = organisationModel.findOne({ organisationId: params.organisationId })

    const accreditedBody = organisationModel.findOne({ organisationId: params.accreditedBody.id })

    const ab = {}
    ab.id = accreditedBody.id
    ab.code = accreditedBody.code
    ab.name = accreditedBody.name
    ab.description = params.accreditedBody.description

    organisation.accreditedBodies.push(ab)

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

exports.deleteOne = (params) => {
  if (params.organisationId && params.accreditedBodyId) {
    let organisation = organisationModel.findOne({ organisationId: params.organisationId })

    organisation.accreditedBodies = organisation.accreditedBodies.filter(
      accreditedBody => accreditedBody.id !== params.accreditedBodyId
    )

    organisation.updatedAt = new Date()

    const filePath = directoryPath + '/' + organisation.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(organisation)
    // write the JSON data
    fs.writeFileSync(filePath, fileData)

  }
}
