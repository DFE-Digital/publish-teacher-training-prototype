const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

exports.findMany = (params) => {
  const studySites = []

  if (params.organisationId) {
    const directoryPath = path.join(__dirname, '../data/dist/study-sites/' + params.organisationId)

    // to prevent errors when an organisation doesn't have any studySites
    // create an empty studySite directory for the organisation
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }

    let documents = fs.readdirSync(directoryPath, 'utf8')

    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

    documents.forEach((filename) => {
      const raw = fs.readFileSync(directoryPath + '/' + filename)
      const data = JSON.parse(raw)
      studySites.push(data)
    })

    studySites.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  return studySites
}

exports.findOne = (params) => {
  let studySite = {}

  if (params.organisationId && params.studySiteId) {
    const directoryPath = path.join(__dirname, '../data/dist/study-sites/' + params.organisationId)

    const filePath = directoryPath + '/' + params.studySiteId + '.json'

    const raw = fs.readFileSync(filePath)
    studySite = JSON.parse(raw)
  }

  return studySite
}

exports.insertOne = (params) => {
  const studySite = {}

  if (params.organisationId) {
    studySite.id = uuid()

    if (params.studySite.name) {
      studySite.name = params.studySite.name
    }

    if (params.studySite.urn) {
      studySite.urn = params.studySite.urn
    }

    studySite.address = {}

    if (params.studySite.address) {
      if (params.studySite.address.addressLine1.length) {
        studySite.address.addressLine1 = params.studySite.address.addressLine1
      }

      if (params.studySite.address.addressLine2.length) {
        studySite.address.addressLine2 = params.studySite.address.addressLine2
      }

      if (params.studySite.address.town.length) {
        studySite.address.town = params.studySite.address.town
      }

      if (params.studySite.address.county.length) {
        studySite.address.county = params.studySite.address.county
      }

      if (params.studySite.address.postcode.length) {
        studySite.address.postcode = params.studySite.address.postcode.toUpperCase()
      }
    }

    studySite.createdAt = new Date()

    const directoryPath = path.join(__dirname, '../data/dist/study-sites/' + params.organisationId)

    const filePath = directoryPath + '/' + studySite.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(studySite)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return studySite
}

exports.updateOne = (params) => {
  if (params.organisationId && params.studySiteId) {
    const studySite = this.findOne({ organisationId: params.organisationId, studySiteId: params.studySiteId })

    if (params.studySite.name) {
      studySite.name = params.studySite.name
    }

    if (params.studySite.urn) {
      studySite.urn = params.studySite.urn
    } else {
      delete studySite.urn
    }

    if (params.studySite.code) {
      studySite.code = ''
    }

    if (params.studySite.address !== undefined) {
      if (params.studySite.address.addressLine1.length) {
        studySite.address.addressLine1 = params.studySite.address.addressLine1
      }

      if (params.studySite.address.addressLine2.length) {
        studySite.address.addressLine2 = params.studySite.address.addressLine2
      } else {
        delete studySite.address.addressLine2
      }

      if (params.studySite.address.town.length) {
        studySite.address.town = params.studySite.address.town
      }

      if (params.studySite.address.county.length) {
        studySite.address.county = params.studySite.address.county
      } else {
        delete studySite.address.county
      }

      if (params.studySite.address.postcode.length) {
        studySite.address.postcode = params.studySite.address.postcode.toUpperCase()
      }
    }

    studySite.updatedAt = new Date()

    const directoryPath = path.join(__dirname, '../data/dist/study-sites/' + params.organisationId)

    const filePath = directoryPath + '/' + params.studySiteId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(studySite)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }
}

exports.deleteOne = (params) => {
  if (params.organisationId && params.studySiteId) {
    const directoryPath = path.join(__dirname, '../data/dist/study-sites/' + params.organisationId)

    const filePath = directoryPath + '/' + params.studySiteId + '.json'
    fs.unlinkSync(filePath)
  }
}
