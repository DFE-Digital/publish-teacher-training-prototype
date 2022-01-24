exports.getAccreditedBodyOptions = (accreditedBodies, selectedItem) => {
  const items = []

  accreditedBodies.forEach((accreditedBody, i) => {
    const item = {}

    item.text = accreditedBody.name
    item.value = accreditedBody.code
    item.id = accreditedBody.id
    item.checked = (selectedItem && selectedItem.includes(accreditedBody.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}
