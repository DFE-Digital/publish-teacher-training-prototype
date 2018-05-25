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

// add your routes here

module.exports = router
