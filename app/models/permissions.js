const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/dist/organisations')

exports.findOne = (params) => {
  let organisation = {}
  let permissions = []

  if (params.trainingPartnerId && params.accreditedBodyId) {
    const filePath = directoryPath + '/' + params.trainingPartnerId + '.json'

    const raw = fs.readFileSync(filePath)
    organisation = JSON.parse(raw)

    if (organisation.accreditedBodies) {
      permissions = organisation.accreditedBodies.find(
        accreditedBody => accreditedBody.id === params.accreditedBodyId
      ).permissions
    }
  }

  return permissions
}
