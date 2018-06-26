var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/preview/:accreditor/:subject', function (req, res) {
  res.render('preview', { accrediting: accreditor(req), subject: subject(req) })
})

router.get('/email-qa-pass/:subject', function (req, res) {
  res.render('email-qa-pass', { subject: subject(req) })
})

router.get('/email-qa-fail/:subject', function (req, res) {
  res.render('email-qa-fail', { subject: subject(req) })
})

router.get('/course/:accreditor/:subject', function (req, res) {
  res.render('course', { subject: subject(req), accrediting: accreditor(req) })
})

router.get('/course/:accreditor/:subject/option/:index', function (req, res) {
  var subj = subject(req);

  res.render(`course/about-this-option`, { accrediting: accreditor(req), subject: subj, option: option(req, subj) })
})

router.get('/course/:accreditor/:subject/ucas/:code', function (req, res) {
  var ucasCourse = req.session.data['ucasCourses'].find(function(course) {
    return course.programmeCode == req.params.code;
  });

  res.render(`course/from-ucas`, { accrediting: accreditor(req), subject: subject(req), ucasCourse: ucasCourse })
})

router.get('/course/:accreditor/:subject/:view', function (req, res) {
  var view = req.params.view;
  res.render(`course/${view}`, { accrediting: accreditor(req), subject: subject(req) })
})

router.get('/school/:id', function (req, res) {
  var school = req.session.data['schools'].find(function(school) {
    return school.code == req.params.id;
  });

  res.render('school', { school: school })
})

router.get('/school/:id/edit', function (req, res) {
  var school = req.session.data['schools'].find(function(school) {
    return school.id == req.params.id;
  });

  res.render('edit-school', { school: school })
})

function subject(req) {
  var accrediting = accreditor(req);
  var subject = accrediting['subjects'].find(function(s) {
    return s.slug == req.params.subject;
  })

  var folded_course = req.session.data['folded_courses'][accrediting['name']].find(function(folded_course) {
    return folded_course.name == subject.name;
  });

  return {
    name: subject.name,
    slug: subject.slug,
    folded_course: folded_course
  };
}

function accreditor(req) {
  var accreditor = req.session.data['accreditors'].find(function(a) {
    return a.slug == req.params.accreditor;
  });

  accreditor.selfAccrediting = (req.session.data['training-provider-name'] == accreditor.name);

  return accreditor;
}

function option(req, subject) {
  var optionIndex = req.params.index;
  var folded_course = subject.folded_course;

  return {
    name: folded_course['options'][optionIndex - 1],
    index: optionIndex
  };
}

module.exports = router
