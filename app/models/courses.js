exports.find = (params) => {
  let courses = require('../data/courses')
  courses = courses.filter(course => course.trainingProvider.code === params.organisationId)
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
