exports.find = (params) => {
  let courses = require('../data/courses')
  courses = courses.filter(course => course.trainingProvider.code === params.organisationId)

  courses.sort((a,b) => {
    return a.accreditedBody.name.localeCompare(b.accreditedBody.name)
      || a.name.localeCompare(b.name)
      // || a.code.localeCompare(b.code)
      || a.qualification.localeCompare(b.qualification)
      || a.studyMode.localeCompare(b.studyMode)
  })

  return courses
}

exports.findOne = (id) => {

}

exports.insertOne = (params) => {

}

exports.insertMany = (params) => {

}

exports.updateOne = (id, params) => {

}

exports.updateMany = (params) => {

}

exports.deleteOne = (id) => {

}

exports.deleteMany = (params) => {

}
