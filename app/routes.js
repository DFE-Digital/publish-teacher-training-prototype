var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/preview/:subject', function (req, res) {
  res.render('preview', { subject: subject(req) })
})

router.get('/course/:subject', function (req, res) {
  res.render('course', { subject: subject(req) })
})

router.get('/course/:subject/:view', function (req, res) {
  var view = req.params.view;
  res.render(`course/${view}`, { subject: subject(req) })
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

// add your routes here

function subject(req) {
  var subject = req.params.subject;
  var name = subject.charAt(0).toUpperCase() + subject.slice(1);
  var folded_course = req.session.data['folded_courses'].find(function(folded_course) {
    return folded_course.name == name;
  });

  return {
    name: name.replace(/-/g,' '),
    slug: subject,
    folded_course: folded_course
  };
}

module.exports = router
