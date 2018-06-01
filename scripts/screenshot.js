// node scripts/screenshot.js directory-name-with-hyphens
var webshot = require('webshot');
var fs = require('fs');
var sharp = require('sharp');
var directoryName = process.argv.slice(-1)[0];

if (directoryName.startsWith('/Users')) {
  console.log('No arguments set');
  console.log('Please set a screenshot directory in the format directory-name-with-hyphens');
  return;
}

var directory = 'app/assets/images/history/' + directoryName;
var indexDirectory = 'app/views/history/' + directoryName;
if ( ! fs.existsSync(directory)){
  fs.mkdirSync(directory);
  fs.mkdirSync(directory + '/thumbnails');
}

if ( ! fs.existsSync(indexDirectory)){
  fs.mkdirSync(indexDirectory);
}

var options = {
  phantomConfig: {
    'ignore-ssl-errors': 'true',
    'ssl-protocol': 'ANY'
  },
  windowSize: {
    width: 1200,
    height: 800
  },
  shotSize: {
    width: 'window',
    height: 'all'
  }
}

var paths = [
  { path: '/course/chemistry', name: 'course' },
  { path: '/course/chemistry/about-this-course', name: 'about-this-course' },
  { path: '/course/chemistry/requirements', name: 'course-requirements' },
  { path: '/course/chemistry/qualification-options', name: 'qualification' },
  { path: '/course/chemistry/salary-options', name: 'salary' },
  { path: '/course/chemistry/from-ucas', name: 'course-details-from-ucas' }
]

var template = '';

paths.forEach(function(item, index) {
  var i = index + 1;
  var indexStr = i < 10 ? '0' + i : i;
  var screenshot = directory + '/' + indexStr + '-' + item.name + '.png';
  var thumbnail = directory + '/thumbnails/' + indexStr + '-' + item.name + '.png';
  var heading = item.name.replace(/-/g, ' ');
  heading = heading.charAt(0).toUpperCase() + heading.slice(1)

  template += `
  {{ macros.screenshot('${heading}', '${item.name}', '${thumbnail.replace('app/assets', '/public')}', '${screenshot.replace('app/assets', '/public')}', '') }}
  `

  webshot('http://localhost:3000' + item.path, screenshot, options, function(err) {
    console.log(screenshot);
    sharp(screenshot).resize(630, null).toFile(thumbnail);
  });
});

var title = directoryName.replace(/-/g, ' ');
title = title.charAt(0).toUpperCase() + title.slice(1)

var templateStart = `
{% extends "layout.html" %}
{% set title = '${title}' %}
{% block page_title %}{{ title }}{% endblock %}

{% block content %}
<main id="content" role="main">
  <div class="breadcrumbs">
    <ol>
      <li><a href="/history">Design history</a></li>
    </ol>
  </div>
  <h1 class="heading-xlarge">{{ title }}</h1>
`;

var templateEnd = `
</main>
{% endblock %}
`;

fs.writeFile(indexDirectory + "/index.html", templateStart + template + templateEnd, function(err) {
  if (err) {
    return console.log(err);
  }
  console.log(`${indexDirectory}/index.html file generated.`);
});
