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
