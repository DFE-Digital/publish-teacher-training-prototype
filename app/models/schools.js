const schools = require('../data/dist/schools')

exports.findMany = (params) => {
  if (params.query?.length) {
    const query = params.query.toLowerCase()
    return schools.filter(school =>
      school.name.toLowerCase().includes(query)
      || school.urn.toString().includes(query)
      || school.address.postcode.toLowerCase().includes(query)
     )
  } else {
    return []
  }
}

exports.findOne = (params) => {
  let school

  if (params.urn) {
    school = schools.find(school => school.urn === parseInt(params.urn))
  } else if (params.name) {
    school = schools.find(school => school.name === params.name)
  }

  return school
}
