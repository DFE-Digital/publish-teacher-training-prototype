const utils = require('./utils')

const locationModel = require('../models/locations')
const studySiteModel = require('../models/study-sites')

// const STATUSES = {
//   discontinued: "Discontinued", // "D" in the live service
//   new: "New", // "N" in the live service
//   running: "Running", // "R" in the live service
//   suspended: "Suspended" // "S" in the live service
// }

exports.getLocations = (organisationId) => {
  const locations = locationModel.findMany({
    organisationId: organisationId
  })

  return locations
}

exports.getLocationOptions = (organisationId, selectedItem) => {
  const items = []

  const locations = locationModel.findMany({
    organisationId: organisationId
  })

  locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.id
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = utils.arrayToList(
      array = Object.values(location.address),
      join = ', ',
      final = ', '
    )

    items.push(item)
  })

  return items
}

exports.getLocationLabel = (locationId, organisationId) => {
  let locations = []
  let location
  let label = ""

  if (organisationId) {
    locations = locationModel.findMany({
      organisationId: organisationId
    })
  }

  if (locationId) {
    location = locations.find(location => location.id === locationId)

    label = locationId

    if (location) {
      label = location.name
    }
  }

  return label
}

exports.getStudySites = (organisationId) => {
  const studySites = studySiteModel.findMany({
    organisationId: organisationId
  })

  return studySites
}

exports.getStudySiteOptions = (organisationId, selectedItem) => {
  const items = []

  const studySites = studySiteModel.findMany({
    organisationId: organisationId
  })

  studySites.forEach((studySite, i) => {
    const item = {}

    item.text = studySite.name
    item.value = studySite.id
    item.id = studySite.id
    item.checked = (selectedItem && selectedItem.includes(studySite.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = utils.arrayToList(
      array = Object.values(studySite.address),
      join = ', ',
      final = ', '
    )

    items.push(item)
  })

  return items
}

exports.getStudySiteLabel = (studySiteId, organisationId) => {
  let studySites = []
  let studySite
  let label = ""

  if (organisationId) {
    studySites = studySiteModel.findMany({
      organisationId: organisationId
    })
  }

  if (studySiteId) {
    studySite = studySites.find(studySite => studySite.id === studySiteId)

    label = studySiteId

    if (studySite) {
      label = studySite.name
    }
  }

  return label
}
