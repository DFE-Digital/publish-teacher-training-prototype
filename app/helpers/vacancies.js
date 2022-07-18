const utils = require('./utils')

const courseModel = require('../models/courses')
const locationModel = require('../models/locations')

// B - full time and part time
// P - part time
// F - full time
// empty string - no vacancies

exports.getLocationOptions = (organisationId, courseId, selectedItem = null) => {
  const items = []

  const course = courseModel.findOne({
    organisationId: organisationId,
    courseId: courseId
  })

  const locations = locationModel.findMany({
    organisationId: organisationId
  })

  course.locations.forEach((location, i) => {
    const item = {}

    const l = locations.find(loc => loc.id === location.id)

    // console.log(l.address);

    item.text = location.name
    item.value = location.id
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = utils.arrayToList(
      array = Object.values(l.address),
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
