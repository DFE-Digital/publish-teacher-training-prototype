const studentVisaOptions = [{
  id: 'f261618c-6ff3-49cc-9d7d-4dc1663e1ea1',
  name: 'Yes',
  code: 'yes'
}, {
  id: '39e289d2-429b-4719-bee2-e0cb57a23f2d',
  name: 'No',
  code: 'no'
}]

const skilledWorkerVisaOptions = [{
  id: '4787b15b-20e6-4159-84a6-6a256b18096a',
  name: 'Yes',
  code: 'yes'
}, {
  id: '782589c9-bf24-473c-ae56-b2fc22a512b0',
  name: 'No',
  code: 'no'
}]

exports.getStudentVisaOptions = (selectedItem) => {
  const items = []

  studentVisaOptions.forEach((visa, i) => {
    const item = {}

    item.text = visa.name
    item.value = visa.code
    item.id = visa.id
    item.checked = (selectedItem && selectedItem.includes(visa.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getStudentVisaLabel = (code) => {
  const option = studentVisaOptions.find(visa => visa.code === code)
  let label = code

  if (option) {
    label = option.name
  }

  return label
}

exports.getSkilledWorkerVisaOptions = (selectedItem) => {
  const items = []

  skilledWorkerVisaOptions.forEach((visa, i) => {
    const item = {}

    item.text = visa.name
    item.value = visa.code
    item.id = visa.id
    item.checked = (selectedItem && selectedItem.includes(visa.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getSkilledWorkerVisaLabel = (code) => {
  const option = skilledWorkerVisaOptions.find(visa => visa.code === code)
  let label = code

  if (option) {
    label = option.name
  }

  return label
}
