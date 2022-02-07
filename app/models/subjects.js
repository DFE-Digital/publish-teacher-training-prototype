exports.find = (params) => {

}

exports.findOne = (params) => {
  const subjects = require('../data/subjects')
  const subject = subjects.find(subject => subject.id === params.subjectId)
  return subject
}
