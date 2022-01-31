exports.getAccreditedBodySelectOptions = (selectedItem) => {
  const items = []

  let organisations = require('../data/organisations')
  organisations = organisations.filter(organisation => organisation.isAccreditedBody === 'true')

  organisations.forEach((organisation, i) => {
    const item = {}

    item.text = organisation.name
    item.value = organisation.code
    item.id = organisation.id
    item.checked = (selectedItem && selectedItem.includes(organisation.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getOrganisationLabel = (code) => {
  const organisations = require('../data/organisations')

  const label = organisations.find(organisation => organisation.code === code).name

  return label
}
