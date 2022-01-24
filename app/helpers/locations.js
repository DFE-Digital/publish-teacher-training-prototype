const STATUSES = {
  discontinued: "Discontinued", // "D" in the live service
  new: "New", // "N" in the live service
  running: "Running", // "R" in the live service
  suspended: "Suspended" // "S" in the live service
}

exports.getLocationOptions = (locations, selectedItem) => {
  const items = []

  locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.code
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}
