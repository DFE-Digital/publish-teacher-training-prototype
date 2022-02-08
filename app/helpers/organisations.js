exports.getAccreditedBodyOptions = (organisationId, selectedItem) => {
  const items = []

  let relationships = require('../data/temp/relationships')
  if (organisationId) {
    relationships = relationships.find(relationship => relationship.id === organisationId)
  }

  relationships.accreditedBodies.forEach((accreditedBody, i) => {
    const item = {}

    item.text = accreditedBody.name
    item.value = accreditedBody.id
    item.id = accreditedBody.id
    item.checked = (selectedItem && selectedItem.includes(accreditedBody.id)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // const divider = { divider: 'or' }
  // items.push(divider)
  //
  // const other = {}
  // other.text = 'Another accredited body'
  // other.value = 'other'
  // other.id = 'accredited-body-other'
  // other.checked = (selectedItem && selectedItem.includes('other')) ? 'checked' : ''
  // other.conditional = true
  // items.push(other)

  return items
}

exports.getAccreditedBodySelectOptions = (selectedItem) => {
  const items = []

  let organisations = require('../data/temp/organisations')
  organisations = organisations.filter(organisation => organisation.isAccreditedBody === 'true')

  organisations.forEach((organisation, i) => {
    const item = {}

    item.text = organisation.name
    item.value = organisation.id
    item.id = organisation.id
    item.selected = (selectedItem && selectedItem.includes(organisation.code)) ? 'selected' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getOrganisationLabel = (code) => {
  const organisations = require('../data/temp/organisations')
  const organisation = organisations.find(organisation => organisation.id === code)

  let label = code

  if (organisation) {
    label = organisation.name
  }

  return label
}
