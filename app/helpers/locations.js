const utils = require('./utils')

const locationModel = require('../models/locations')

// const STATUSES = {
//   discontinued: "Discontinued", // "D" in the live service
//   new: "New", // "N" in the live service
//   running: "Running", // "R" in the live service
//   suspended: "Suspended" // "S" in the live service
// }

exports.getLocationOptions = (organisationId, selectedItem) => {
  const items = []

  const locations = locationModel.find({
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

exports.getLocationLabel = (code) => {
  const locations = require('../data/temp/locations')
  const location = locations.find(location => location.id === code)

  let label = code

  if (location) {
    label = location.name
  }

  return label
}
