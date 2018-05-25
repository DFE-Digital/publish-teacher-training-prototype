var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/course/:subject', function (req, res) {
  var subject = req.params.subject;
  res.render('course', { subject: subject.charAt(0).toUpperCase() + subject.slice(1) })
})

router.get('/school/:id', function (req, res) {
  var school = req.session.data['schools'].find(function(school) {
    return school.id == req.params.id;
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

module.exports = router
