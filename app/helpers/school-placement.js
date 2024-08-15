const schoolPlacementOptions = [{
  id: 'f261618c-6ff3-49cc-9d7d-4dc1663e1ea1',
  name: 'Yes',
  code: 'yes'
}, {
  id: '39e289d2-429b-4719-bee2-e0cb57a23f2d',
  name: 'No',
  code: 'no'
}]

exports.getSchoolPlacementOptions = (selectedItem) => {
  const items = []

  schoolPlacementOptions.forEach((placement, i) => {
    const item = {}

    item.text = placement.name
    item.value = placement.code
    item.id = placement.id
    item.checked = (selectedItem && selectedItem.includes(placement.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getSchoolPlacementLabel = (code) => {
  const option = schoolPlacementOptions.find(placement => placement.code === code)
  let label = code

  if (option) {
    label = option.name
  }

  return label
}
