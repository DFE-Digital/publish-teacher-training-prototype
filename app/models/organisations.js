const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/organisations/')

exports.findMany = (params) => {
  let organisations = []

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    organisations.push(data)
  })

  // TODO: this is really findOne
  if (params.code) {
    organisations = organisations.find(organisation => organisation.code === params.code)
  }

  if (typeof (params.isAccreditedBody) === 'boolean') {
    organisations = organisations.filter(organisation => organisation.isAccreditedBody === params.isAccreditedBody)
  }

  if (params.query?.length) {
    const query = params.query.toLowerCase()
    return organisations.filter(organisation =>
      organisation.name.toLowerCase().includes(query)
      || organisation.code.toLowerCase().includes(query)
      || organisation.ukprn?.toString().includes(query)
      || organisation.address?.postcode?.toLowerCase().includes(query)
     )
  }

  return organisations
}

exports.findOne = (params) => {
  let organisation = {}

  if (params.organisationId) {
    const filePath = directoryPath + '/' + params.organisationId + '.json'

    const raw = fs.readFileSync(filePath)
    organisation = JSON.parse(raw)
  }

  return organisation
}

exports.updateOne = (params) => {
  let organisation

  if (params.organisationId) {
    organisation = this.findOne({ organisationId: params.organisationId })

    if (params.organisation.urn !== undefined) {
      organisation.urn = params.organisation.urn
    }

    if (params.organisation.ukprn !== undefined) {
      organisation.ukprn = params.organisation.ukprn
    }

    if (params.organisation.trainWithUs !== undefined) {
      organisation.trainWithUs = params.organisation.trainWithUs
    }

    if (params.organisation.trainWithDisability !== undefined) {
      organisation.trainWithDisability = params.organisation.trainWithDisability
    }

    if (params.organisation.contact !== undefined) {
      if (params.organisation.contact.email !== undefined) {
        organisation.contact.email = params.organisation.contact.email
      }

      if (params.organisation.contact.telephone !== undefined) {
        organisation.contact.telephone = params.organisation.contact.telephone
      }

      if (params.organisation.contact.website !== undefined) {
        organisation.contact.website = params.organisation.contact.website
      }
    }

    if (params.organisation.address !== undefined) {
      if (params.organisation.address.addressLine1 !== undefined) {
        organisation.address.addressLine1 = params.organisation.address.addressLine1
      }

      if (params.organisation.address.addressLine2 !== undefined) {
        organisation.address.addressLine2 = params.organisation.address.addressLine2
      }

      if (params.organisation.address.town !== undefined) {
        organisation.address.town = params.organisation.address.town
      }

      if (params.organisation.address.county !== undefined) {
        organisation.address.county = params.organisation.address.county
      }

      if (params.organisation.address.postcode !== undefined) {
        organisation.address.postcode = params.organisation.address.postcode
      }
    }

    if (params.organisation.visaSponsorship !== undefined) {
      if (params.organisation.visaSponsorship.canSponsorStudentVisa !== undefined) {
        organisation.visaSponsorship.canSponsorStudentVisa = params.organisation.visaSponsorship.canSponsorStudentVisa
      }

      if (params.organisation.visaSponsorship.canSponsorSkilledWorkerVisa !== undefined) {
        organisation.visaSponsorship.canSponsorSkilledWorkerVisa = params.organisation.visaSponsorship.canSponsorSkilledWorkerVisa
      }
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
