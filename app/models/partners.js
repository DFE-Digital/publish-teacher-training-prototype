const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')

const directoryPath = path.join(__dirname, '../data/organisations/')

exports.findMany = (params) => {
  let organisations = []

  if (params.organisationId) {
    organisations = organisationModel.findMany({})

    organisations = organisations.filter(organisation => {
      if (organisation.accreditedBodies) {
        return organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === params.organisationId)
      }
    })
  }

  return organisations
}
