const courses = require('../models/courses')

exports.course_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Course list')
}

exports.course_details = (req, res) => {
  res.send('NOT IMPLEMENTED: Course detail: ' + req.params.courseId)
}

exports.course_description = (req, res) => {
  res.send('NOT IMPLEMENTED: Course description: ' + req.params.courseId)
}

exports.new_course_get = (req, res) => {

}

exports.new_course_post = (req, res) => {

}
