const utils = require('./utils')

const STATUSES = {
  discontinued: "Discontinued", // "D" in the live service
  new: "New", // "N" in the live service
  running: "Running", // "R" in the live service
  suspended: "Suspended" // "S" in the live service
}

exports.getLocationOptions = (organisationId, selectedItem) => {
  const items = []

  let locations = require('../data/locations')
  locations = locations.filter(location => location.organisation.code === organisationId)

  locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.code
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.code)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = utils.arrayToList(
        array = Object.values(location.address),
        join = ', ',
        final = ', '
      )

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}
