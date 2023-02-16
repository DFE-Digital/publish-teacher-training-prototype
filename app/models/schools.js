const schools = require('../data/schools')

exports.findMany = (params) => {
  if (params.query?.length) {
    return schools.filter(school => school.name.toLowerCase().includes(params.query.toLowerCase()))
  } else {
    return []
  }
}

exports.findOne = (params) => {
  let school

  if (params.urn) {
    school = schools.find(school => school.urn === params.urn)
  } else if (params.name) {
    school = schools.find(school => school.name === params.name)
  }

  return school
}
