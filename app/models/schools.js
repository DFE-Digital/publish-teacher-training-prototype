const schools = require('../data/schools')

exports.findMany = (params) => {
  return schools.filter(school => school.name.includes(params.query))
}

exports.findOne = (params) => {
  let school
  if (params.urn) {
    school = schools.find(school => school.urn === params.urn)
  }
  return school
}
