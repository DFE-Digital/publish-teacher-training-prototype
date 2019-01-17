function generateCourseCode() {
  var letters = 'ABCDEFGHJKMNPQRSTUVWXYZ'.split('');
  var letter = letters[ Math.floor(Math.random() * letters.length) ];
  var code = letter + Math.floor(Math.random()*(999 - 100 + 1) + 100);
  return code;
}

function getGeneratedTitle(code, data) {
  var generatedTitle = data[code + '-subject'];

  if (data[code + '-second-subject']) {
    generatedTitle = `${generatedTitle} with ${data[code + '-second-subject']}`;
  }

  if (data[code + '-age-youngest']) {
    generatedTitle = `${generatedTitle} (${data[code + '-age-youngest']} – ${data[code + '-age-oldest']})`;
  }

  if (isModernLanguages(code, data)) {
    if (data[code + '-second-language']) {
      if (data[code + '-further-languages']) {
        generatedTitle = `${generatedTitle} (${data[code + '-first-language']}, ${data[code + '-second-language']}, ${data[code + '-further-languages'].join(', ')})`;
      } else {
        generatedTitle = `${generatedTitle} (${data[code + '-first-language']} and ${data[code + '-second-language']})`;
      }
    } else {
      generatedTitle = `${generatedTitle} (${data[code + '-first-language']})`;
    }
  }

  if (data[code + '-sen']) {
    generatedTitle = generatedTitle + ' (with Special educational needs and disability)';
  }

  data[code + '-generated-title'] = generatedTitle;
  return generatedTitle;
}

function newFurtherEducationCourseWizardPaths(req, code, data) {
  var currentPath = req.path;
  var originalQueryString = req.originalUrl.split('?')[1];
  var originalQuery = originalQueryString ? `?${originalQueryString}` : '';
  var paths = [
    '/',
    `/new/${code}/phase`,
    `/new/${code}/further/title`,
    `/new/${code}/further/outcome`,
    `/new/${code}/further/full-time-part-time`,
    ...(data['new-course']['include-locations'] ? [`/new/${code}/further/training-locations`] : []),
    `/new/${code}/further/start-date`,
    `/new/${code}/further/confirm`,
    `/new/${code}/further/create`
  ];

  var index = paths.indexOf(currentPath);
  var next = paths[index + 1];
  var back = paths[index - 1];

  return {
    next: next + originalQuery,
    back: back + originalQuery
  }
}

function newCourseWizardPaths(req, code, data) {
  var currentPath = req.path;
  var originalQueryString = req.originalUrl.split('?')[1];
  var originalQuery = originalQueryString ? `?${originalQueryString}` : '';
  var paths = [
    '/',
    `/new/${code}/phase`,
    `/new/${code}/subject`,
    `/new/${code}/languages`,
    `/new/${code}/outcome`,
    ...(data['new-course']['include-fee-or-salary'] ? [`/new/${code}/funding`] : []),
    `/new/${code}/full-time-part-time`,
    ...(data['new-course']['include-locations'] ? [`/new/${code}/training-locations`] : []),
    ...(data['new-course']['include-accredited'] ? [`/new/${code}/accredited-body`] : []),
    `/new/${code}/eligibility`,
    `/new/${code}/start-date`,
    `/new/${code}/title`,
    `/new/${code}/confirm`,
    `/new/${code}/create`
  ];
  var index = paths.indexOf(currentPath);
  var next = paths[index + 1];
  var back = paths[index - 1];

  if (back == `/new/${code}/languages` && !isModernLanguages(code, data)) {
    back = paths[index - 2];
  }

  return {
    next: next + originalQuery,
    back: back + originalQuery
  }
}

function getCourseOffered(code, data) {
  var courseOffered = data[code + '-outcome'];

  if (data[code + '-outcome'].includes('PGCE only')) {
    courseOffered = 'PGCE';
  }

  if (data[code + '-outcome'].includes('PGDE only')) {
    courseOffered = 'PGDE';
  }

  if (data[code + '-full-part'] == 'Full time or part time') {
    courseOffered = courseOffered + ', full time or part time';
  } else if (data[code + '-full-part'])  {
    courseOffered = courseOffered + ' ' + data[code + '-full-part'].toLowerCase();
  }

  if (data[code + '-type'] == 'Salaried') {
    courseOffered = courseOffered + ' with salary';
  }

  if (data[code + '-type'] == 'Teaching apprenticeship') {
    courseOffered = courseOffered + ' teaching apprenticeship';
  }

  data[code + '-generated-description'] = courseOffered;
  return courseOffered;
}

function isModernLanguages(code, data) {
  return data[code + '-subject'] == 'Modern languages'
}

function isFurtherEducation(code, data) {
  return data[code + '-phase'] == 'Further education'
}

function subject(req) {
  var accrediting = accreditor(req);
  var subject = accrediting['subjects'].find(function(s) {
    return s.slug == req.params.subject;
  })

  return {
    name: subject.name,
    slug: subject.slug
  };
}

function course(req) {
  var course = req.session.data['ucasCourses'].find(function(a) {
    return a.programmeCode == req.params.code;
  });

  course.path = `/course/${course.providerCode}/${course.programmeCode}`;
  course.salaried = (course.route == 'School Direct training programme (salaried)')
  return course;
}

function validate(data, course, view) {
  var prefix = course.programmeCode;
  var view = view || 'all';
  var errors = [];

  if (view == 'all' || view == 'about-this-course') {
    if (!data[prefix + '-about-this-course']) {
      errors.push({
        title: 'Give details about this course',
        id: `${prefix}-about-this-course`,
        link: `/about-this-course#${prefix}-about-this-course`,
        page: 'about-this-course'
      })
    }

    if (!data[prefix + '-placement-school-policy']) {
      errors.push({
        title: 'Give details about how school placements work',
        id: `${prefix}-placement-school-policy`,
        link: `/about-this-course#${prefix}-placement-school-policy`,
        page: 'about-this-course'
      })
    }
  }

  if (view == 'all' || view == 'requirements') {
    if (!data[prefix + '-qualifications-required']) {
      errors.push({
        title: 'Give details about the qualifications needed',
        id: `${prefix}-qualifications-required`,
        link: `/requirements#${prefix}-qualifications-required`,
        page: 'requirements'
      })
    }
  }

  if (view == 'all' || view == 'fees-and-length') {
    if (!data[prefix + '-duration']) {
      errors.push({
        title: 'Enter a course length',
        id: `${prefix}-duration`,
        link: `/fees-and-length#${prefix}-duration`,
        page: 'fees-and-length'
      })
    }

    if (!course.salaried && !data[prefix + '-fee']) {
      errors.push({
        title: 'Enter course fees for UK and EU students',
        id: `${prefix}-fee`,
        link: `/fees-and-length#${prefix}-fee`,
        page: 'fees-and-length'
      })
    }

    if (course.salaried && !data[prefix + '-salary-details']) {
      errors.push({
        title: 'Give details about the salary for this course',
        id: `${prefix}-salary-details`,
        link: `/fees-and-length#${prefix}-salary-details`,
        page: 'fees-and-length'
      })
    }
  }

  return errors.map(e => {
    e.text = e.title;
    e.href = course.path + e.link;

    return e;
  });
}

function validateOrg(data, view) {
  var errors = [];
  var view = view || 'all';

  if (view == 'all' || view == 'about-your-organisation') {
    if (!data['about-organisation']) {
      errors.push({
        title: 'Give details about your organisation',
        id: `about-organisation`,
        link: `/about-your-organisation/edit#about-organisation`,
        page: 'about-your-organisation'
      })
    }

    if (!data['training-with-a-disability']) {
      errors.push({
        title: 'Give details about training with a disability',
        id: `training-with-a-disability`,
        link: `/about-your-organisation/edit#training-with-a-disability`,
        page: 'about-your-organisation'
      })
    }
  }

  if (view == 'all' || view == 'contact-details') {
    if (!data['email-address']) {
      errors.push({
        title: 'Email address is missing',
        id: `email-address`,
        link: `/about-your-organisation/contact#email-address`,
        page: 'contact'
      })
    }

    if (!data['telephone-number']) {
      errors.push({
        title: 'Telephone number is missing',
        id: `telephone-number`,
        link: `/about-your-organisation/contact#telephone-number`,
        page: 'contact'
      })
    }

    if (!data['website']) {
      errors.push({
        title: 'Website is missing',
        id: `website`,
        link: `/about-your-organisation/contact#website`,
        page: 'contact'
      })
    }

    if (!data['building-and-street']) {
      errors.push({
        title: 'Give a building and street name in your contact address',
        id: `building-and-street`,
        link: `/about-your-organisation/contact#building-and-street`,
        page: 'contact'
      })
    }

    if (!data['organisation-town-or-city']) {
      errors.push({
        title: 'Give a town or city in your contact address',
        id: `organisation-town-or-city`,
        link: `/about-your-organisation/contact#organisation-town-or-city`,
        page: 'contact'
      })
    }

    if (!data['postcode']) {
      errors.push({
        title: 'Give a postcode in your contact address',
        id: `postcode`,
        link: `/about-your-organisation/contact#postcode`,
        page: 'contact'
      })
    }

    if (!data['county']) {
      errors.push({
        title: 'Give a county in your contact address',
        id: `county`,
        link: `/about-your-organisation/contact#county`,
        page: 'contact'
      })
    }
  }

  return errors.map(e => {
    e.text = e.title;
    e.href = e.link;

    return e;
  });
}

module.exports = {
  generateCourseCode,
  getGeneratedTitle,
  getCourseOffered,
  isModernLanguages,
  isFurtherEducation,
  newCourseWizardPaths,
  newFurtherEducationCourseWizardPaths,
  subject,
  course,
  validate,
  validateOrg
}
