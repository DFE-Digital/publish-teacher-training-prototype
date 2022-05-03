const organisationModel = require('../models/organisations')

exports.getAccreditedBodyOptions = (organisationId, selectedItem) => {
  const items = []

  const organisation = organisationModel.findOne({ organisationId: organisationId })

  organisation.accreditedBodies.forEach((accreditedBody, i) => {
    const item = {}

    item.text = accreditedBody.name
    item.value = accreditedBody.id
    item.id = accreditedBody.id
    item.checked = (selectedItem && selectedItem.includes(accreditedBody.id)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a, b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getAccreditedBodySelectOptions = (selectedItem) => {
  const items = []

  const organisations = organisationModel.findMany({ isAccreditedBody: true })

  organisations.forEach((organisation, i) => {
    const item = {}

    item.text = organisation.name
    item.value = organisation.id
    item.id = organisation.id
    item.selected = (selectedItem && selectedItem.includes(organisation.id)) ? 'selected' : ''

    items.push(item)
  })

  items.sort((a, b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getAccreditedBodyAutocompleteOptions = (selectedItem) => {
  const items = []

  const organisations = organisationModel.findMany({ isAccreditedBody: true })

  organisations.forEach((organisation, i) => {
    const item = {}

    item.text = organisation.name
    item.value = organisation.id
    item.selected = !!((selectedItem && selectedItem.includes(organisation.id)))

    items.push(item)
  })

  items.sort((a, b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getOrganisationLabel = (organisationId) => {
  const organisation = organisationModel.findOne({ organisationId: organisationId })

  let label = organisationId

  if (organisation) {
    label = organisation.name
  }

  return label
}
