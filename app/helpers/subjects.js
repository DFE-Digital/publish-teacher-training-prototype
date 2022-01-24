exports.getSubjectLevelOptions = (selectedItem) => {
  const items = []
  const subjectLevels = require('../data/subject-levels')

  subjectLevels.forEach((subjectLevel, i) => {
    const item = {}

    item.text = subjectLevel.name
    item.value = subjectLevel.code
    item.id = subjectLevel.id
    item.checked = (selectedItem && selectedItem.includes(subjectLevel.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getSubjectOptions = (subjectLevel = 'secondary', selectedItem) => {
  const items = []

  let subjects = require('../data/subjects')
  subjects = subjects.filter(subject => subject.level === subjectLevel)

  subjects.forEach((subject, i) => {
    const item = {}

    item.text = subject.name
    // item.text += ' (' + subject.code + ')'
    item.value = subject.code
    item.id = subject.id
    item.checked = (selectedItem && selectedItem.includes(subject.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getSendOptions = (selectedItem) => {
  const items = []
  const sendOptions = [{
    id: '5289e0bd-830b-46f6-948e-685214651beb',
    name: 'Yes',
    code: 'yes'
  },{
    id: '0c4ababf-9acb-4105-973d-ce931cf89a94',
    name: 'No',
    code: 'no'
  }]

  sendOptions.forEach((send, i) => {
    const item = {}

    item.text = send.name
    item.value = send.code
    item.id = send.id
    item.checked = (selectedItem && selectedItem.includes(send.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}
