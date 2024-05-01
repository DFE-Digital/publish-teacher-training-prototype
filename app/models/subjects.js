exports.findOne = (params) => {
  const subjects = require('../data/dist/subjects')

  let subject
  if (params.subjectId) {
    subject = subjects.find(subject => subject.id === params.subjectId)
  } else {
    subject = subjects.find(subject => subject.code === params.subjectCode)
  }

  return subject
}
