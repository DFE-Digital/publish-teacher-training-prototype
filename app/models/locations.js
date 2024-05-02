const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const generateLocationCode = (params) => {
  let locationCode = ''

  const alphaNumerics = [
    '-',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ]

  const locations = this.findMany({
    organisationId: params.organisationId
  })

  if (!locations.length) {
    locationCode = '-'
  } else {
    const locationCodes = []

    // get the location codes already in use
    locations.forEach((location, i) => {
      locationCodes.push(location.code)
    })

    // sort codes
    locationCodes.sort()

    alphaNumerics.forEach((code, i) => {
      if (locationCodes.includes(code)) {
        locationCode = alphaNumerics[i + 1]
      }
    })
  }

  return locationCode
}

exports.findMany = (params) => {
  const locations = []

  if (params.organisationId) {
    const directoryPath = path.join(__dirname, '../data/dist/locations/' + params.organisationId)

    // to prevent errors when an organisation doesn't have any locations
    // create an empty location directory for the organisation
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }

    let documents = fs.readdirSync(directoryPath, 'utf8')

    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

    documents.forEach((filename) => {
      const raw = fs.readFileSync(directoryPath + '/' + filename)
      const data = JSON.parse(raw)
      locations.push(data)
    })

    locations.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  return locations
}

exports.findOne = (params) => {
  let location = {}

  if (params.organisationId && params.locationId) {
    const directoryPath = path.join(__dirname, '../data/dist/locations/' + params.organisationId)

    const filePath = directoryPath + '/' + params.locationId + '.json'

    const raw = fs.readFileSync(filePath)
    location = JSON.parse(raw)
  }

  return location
}

exports.insertOne = (params) => {
  const location = {}

  if (params.organisationId) {
    location.id = uuid()

    if (params.location.name) {
      location.name = params.location.name
    }

    if (params.location.urn) {
      location.urn = params.location.urn
    }

    location.code = generateLocationCode({
      organisationId: params.organisationId
    })

    location.address = {}

    if (params.location.address) {
      if (params.location.address.addressLine1.length) {
        location.address.addressLine1 = params.location.address.addressLine1
      }

      if (params.location.address.addressLine2.length) {
        location.address.addressLine2 = params.location.address.addressLine2
      }

      if (params.location.address.town.length) {
        location.address.town = params.location.address.town
      }

      if (params.location.address.county.length) {
        location.address.county = params.location.address.county
      }

      if (params.location.address.postcode.length) {
        location.address.postcode = params.location.address.postcode.toUpperCase()
      }
    }

    location.createdAt = new Date()

    const directoryPath = path.join(__dirname, '../data/dist/locations/' + params.organisationId)

    const filePath = directoryPath + '/' + location.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(location)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return location
}

exports.updateOne = (params) => {
  if (params.organisationId && params.locationId) {
    const location = this.findOne({ organisationId: params.organisationId, locationId: params.locationId })

    if (params.location.name) {
      location.name = params.location.name
    }

    if (params.location.urn) {
      location.urn = params.location.urn
    } else {
      delete location.urn
    }

    if (params.location.code) {
      location.code = ''
    }

    if (params.location.address !== undefined) {
      if (params.location.address.addressLine1.length) {
        location.address.addressLine1 = params.location.address.addressLine1
      }

      if (params.location.address.addressLine2.length) {
        location.address.addressLine2 = params.location.address.addressLine2
      } else {
        delete location.address.addressLine2
      }

      if (params.location.address.town.length) {
        location.address.town = params.location.address.town
      }

      if (params.location.address.county.length) {
        location.address.county = params.location.address.county
      } else {
        delete location.address.county
      }

      if (params.location.address.postcode.length) {
        location.address.postcode = params.location.address.postcode.toUpperCase()
      }
    }

    location.updatedAt = new Date()

    const directoryPath = path.join(__dirname, '../data/dist/locations/' + params.organisationId)

    const filePath = directoryPath + '/' + params.locationId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(location)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }
}

exports.deleteOne = (params) => {
  if (params.organisationId && params.locationId) {
    const directoryPath = path.join(__dirname, '../data/dist/locations/' + params.organisationId)

    const filePath = directoryPath + '/' + params.locationId + '.json'
    fs.unlinkSync(filePath)
  }
}
