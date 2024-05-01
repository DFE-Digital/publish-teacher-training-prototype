const permissions = require('../data/dist/permission-types')

exports.getPermissionsOptions = (selectedItem) => {
  const items = []

  permissions.forEach((permission, i) => {
    const item = {}

    item.text = permission.name
    item.value = permission.code
    item.id = permission.id
    item.checked = (selectedItem && selectedItem.includes(permission.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getPermissionLabel = (code) => {
  const permission = permissions.find(permission => permission.code === code)

  let label = code

  if (permission) {
    label = permission.name
  }

  return label
}
