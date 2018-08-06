var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  if (req.session.data['multi-organisation']) {
    res.render('your-organisations');
  } else {
    res.render('organisation');
  }
})

router.post('/request-access', function (req, res) {
  res.render('request-access', { showMessage: true })
})

router.post('/about-your-organisation', function (req, res) {
  res.render('about-your-organisation', { showMessage: true })
})

// router.post('/template/new', function (req, res) {
//   var name = req.body['template-name'];
//   var slug = name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-$/g, '').toLowerCase();
//
//   req.session.data['templates'].push({
//     name: name,
//     slug: slug
//   });
//
//   res.redirect('/template/' + slug);
// })
//
// router.get('/template/new', function (req, res) {
//   res.render('template/new');
// })
//
// router.get('/template/:template', function (req, res) {
//   res.render('template/fields', { template: template(req) })
// })
//
// router.get('/template/:template/:view', function (req, res) {
//   var view = req.params.view;
//   res.render(`template/${view}`, { template: template(req) })
// })
//
// router.post('/template/:template/apply', function (req, res) {
//
//   for (choice in req.body) {
//     if (req.body[choice] != '_unchecked') {
//       var code = choice.replace('apply-to-', '');
//       req.session.data[code + '-template-choice'] = req.params.template;
//     }
//   }
//
//   res.redirect(`/template/${req.params.template}/apply`)
// })
//
// router.get('/preview/template/:template', function (req, res) {
//   var t = template(req);
//   var c = {
//     name: 'Example subject'
//   }
//
//   var a = {
//     name: 'Example Accrediting Provider'
//   }
//
//   res.render('preview', { course: c, accrediting: a, template: t, prefix: t.slug + '-template', previewingTemplate: true })
// })

router.get('/course/:accreditor/:code', function (req, res) {
  var c = course(req);

  res.render('course', { course: c, accrediting: accreditor(req), template: template(req, c) })
})

router.get('/course-not-running/:accreditor/:code', function (req, res) {
  var c = course(req);

  res.render('course-not-running', { course: c, accrediting: accreditor(req), template: template(req, c) })
})

router.get('/preview/:accreditor/:code', function (req, res) {
  var c = course(req);
  var t = template(req, c);
  var prefix = '';

  if (t) {
    prefix = t.slug + '-template';
  } else {
    prefix = c.programmeCode;
  }

  res.render('preview', { course: c, accrediting: accreditor(req), template: t, prefix: prefix })
})

router.post('/course/:accreditor/:code', function (req, res) {
  var c = course(req);

  res.render('course', { course: c, accrediting: accreditor(req), template: template(req, c), showMessage: true })
})

router.get('/course/:accreditor/:code/no-template', function (req, res) {
  req.session.data[req.params.code + '-template-choice'] = 'template-none';
  res.redirect(`/course/${req.params.accreditor}/${req.params.code}`);
})

router.get('/course/:accreditor/:code/:view', function (req, res) {
  var view = req.params.view;
  res.render(`course/${view}`, { course: course(req), accrediting: accreditor(req) })
})

// router.get('/school/:id', function (req, res) {
//   var school = req.session.data['schools'].find(function(school) {
//     return school.code == req.params.id;
//   });
//
//   res.render('school', { school: school })
// })
//
// router.get('/school/:id/edit', function (req, res) {
//   var school = req.session.data['schools'].find(function(school) {
//     return school.id == req.params.id;
//   });
//
//   res.render('edit-school', { school: school })
// })

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

function course(req) {
  var course = req.session.data['ucasCourses'].find(function(a) {
    return a.programmeCode == req.params.code;
  });

  course.salaried = (course.route == 'School Direct training programme (salaried)')
  return course;
}

function accreditor(req) {
  var accreditor = req.session.data['accreditors'].find(function(a) {
    return a.slug == req.params.accreditor;
  });

  accreditor.selfAccrediting = (req.session.data['training-provider-name'] == accreditor.name);

  return accreditor;
}

function template(req, course) {
  var templateSlug;

  if (req.params.template) {
    templateSlug = req.params.template
  } else if (course) {
    templateSlug = req.session.data[course.programmeCode + '-template-choice'];
  }

  return req.session.data['templates'].find(function(t) {
    return t.slug == templateSlug;
  });
}

function option(req, subject) {
  var optionIndex = req.params.index;
  var folded_course = subject.folded_course;
  var name = folded_course['options'][optionIndex - 1];

  return {
    name: name,
    index: optionIndex,
    salaried: name.includes('salary'),
    partTime: name.includes('part'),
    qtsOnly: !name.includes('PGCE')
  };
}

function validate(req, course, locals) {
  var data = req.session.data;
  var prefix = course.programmeCode
  var errors = [];

  if (!data[prefix + '-about-this-course']) {
    errors.push({
      title: 'Give details about this course',
      link: `/about-this-course#${prefix}-about-this-course`
    })
  }

  if (!data[prefix + '-placement-school-policy']) {
    errors.push({
      title: 'Give details about how school placements work',
      link: `/about-this-course#${prefix}-placement-school-policy`
    })
  }

  if (errors.length > 0) {
    locals.errors = errors;
  } else {
    locals.success = true;
  }
}


// router.get('/email-qa-pass/:subject', function (req, res) {
//   res.render('email-qa-pass', { subject: subject(req) })
// })
//
// router.get('/email-qa-fail/:subject', function (req, res) {
//   res.render('email-qa-fail', { subject: subject(req) })
// })

module.exports = router
