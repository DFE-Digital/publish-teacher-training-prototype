const path = require('path')
const fs = require('fs')

const userModel = require('./users')

exports.updateOne = (params) => {
  if (params.organisationId && params.userId) {
    const user = userModel.findOne({ organisationId: params.organisationId, userId: params.userId })

    user.organisations.forEach((organisation, i) => {
      if (organisation.id === params.organisationId) {
        organisation.notifications = params.notifications
      }
    })

    user.updatedAt = new Date()

    const directoryPath = path.join(__dirname, '../data/dist/users')

    const filePath = directoryPath + '/' + user.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(user)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }
}
