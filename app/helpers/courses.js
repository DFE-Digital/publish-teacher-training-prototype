// const DEGREE_GRADES = {
//   0: "2:1 or above, or equivalent",
//   1: "2:2 or above, or equivalent",
//   2: "Third or above, or equivalent",
//   9: "Not required"
// }

exports.getAgeRangeOptions = (subjectLevel = 'secondary', selectedItem) => {
  const items = []

  let ageRanges = require('../data/age-ranges')
  if (subjectLevel) {
    ageRanges = ageRanges.filter(range => range.level === subjectLevel)
  }

  ageRanges.forEach((ageRange, i) => {
    const item = {}

    item.text = ageRange.name
    item.value = ageRange.code
    item.id = ageRange.id
    item.checked = (selectedItem && selectedItem.includes(ageRange.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  const divider = { divider: 'or' }
  items.push(divider)

  const other = {}
  other.text = 'Another age range'
  other.value = 'other'
  other.id = 'age-range-other'
  other.checked = (selectedItem && selectedItem.includes('other')) ? 'checked' : ''
  other.conditional = true
  items.push(other)

  return items
}

exports.getQualificationOptions = (selectedItem) => {
  const items = []
  const qualifications = []

  qualifications.forEach((qualification, i) => {
    const item = {}

    item.text = qualification.name
    item.value = qualification.code
    item.id = qualification.id
    item.checked = (selectedItem && selectedItem.includes(qualification.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

// TODO: funding type is dependent on provider type -> programType
// higher_education_programme: "HE",
// school_direct_training_programme: "SD",
// school_direct_salaried_training_programme: "SS",
// scitt_programme: "SC",
// pg_teaching_apprenticeship: "TA"
exports.getFundingTypeOptions = (selectedItem) => {
  const items = []
  const fundingTypes = require('../data/funding-types')

  fundingTypes.forEach((fundingType, i) => {
    const item = {}

    item.text = fundingType.name
    item.value = fundingType.code
    item.id = fundingType.id
    item.checked = (selectedItem && selectedItem.includes(fundingType.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getStudyModeOptions = (selectedItem) => {
  const items = []
  const studyModes = require('../data/study-modes')

  studyModes.forEach((studyModes, i) => {
    const item = {}

    item.text = studyModes.name
    item.value = studyModes.code
    item.id = studyModes.id
    item.checked = (selectedItem && selectedItem.includes(studyModes.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}
