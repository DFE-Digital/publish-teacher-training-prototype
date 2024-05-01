const degreeGrades = require('../data/dist/degree-grades')

exports.getDegreeGradeOptions = (selectedItem) => {
  const items = []

  degreeGrades.forEach((degreeGrade, i) => {
    if (degreeGrade.code !== '9') {
      const item = {}

      item.text = degreeGrade.name
      item.value = degreeGrade.code
      item.id = degreeGrade.id
      item.checked = (selectedItem && selectedItem.includes(degreeGrade.code)) ? 'checked' : ''

      items.push(item)
    }
  })

  return items
}

exports.getMinimumDegreeGradeOptions = (selectedItem) => {
  const options = [{
    id: 'b584f5e2-a196-4f41-9cbc-1a625fd0e968',
    name: 'Yes',
    code: 'yes'
  }, {
    id: 'a8b5b3e9-68ea-478f-96d9-cd54fae6f9c2',
    name: 'No',
    code: 'no'
  }]

  const items = []

  options.forEach((option, i) => {
    const item = {}

    item.text = option.name
    item.value = option.code
    item.id = option.id
    item.checked = (selectedItem && selectedItem.includes(option.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

// exports.getDegreeSubjectRequirementOptions = (selectedItem) => {
//   const options = [{
//     id: '4b415817-fbba-4dcf-9258-7b0a44ea1615',
//     name: 'Yes',
//     code: 'yes'
//   }, {
//     id: '3162ccfa-eb8c-4e52-89d1-bd0ad4e19ef8',
//     name: 'No',
//     code: 'no'
//   }]
//
//   const items = []
//
//   options.forEach((option, i) => {
//     const item = {}
//
//     item.text = option.name
//     item.value = option.code
//     item.id = option.id
//     item.checked = (selectedItem && selectedItem.includes(option.code)) ? 'checked' : ''
//
//     items.push(item)
//   })
//
//   return items
// }

exports.getDegreeGradeLabel = (code) => {
  const degreeGrade = degreeGrades.find(degreeGrade => degreeGrade.code === code)

  let label = code

  if (degreeGrade) {
    label = degreeGrade.name
  }

  return label
}
