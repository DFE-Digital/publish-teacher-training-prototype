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
  { path: '/courses', name: 'courses' },
  { path: '/course/st-mary-s-university--twickenham/chemistry', name: 'course' },
  { path: '/course/st-mary-s-university--twickenham/chemistry/ucas/2H62', name: 'course-details-from-ucas' },
  { path: '/course/st-mary-s-university--twickenham/chemistry/option/1', name: 'PGCE with QTS course option' },
  { path: '/course/st-mary-s-university--twickenham/chemistry/option/2', name: 'QTS with salary course option' },
  { path: '/course/st-mary-s-university--twickenham/chemistry/about-this-provider', name: 'About your organisation' },
  { path: '/course/st-mary-s-university--twickenham/chemistry/requirements', name: 'Requirements and eligibility' },
  { path: '/preview/st-mary-s-university--twickenham/chemistry', name: 'preview' }
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
<main id="content" role="main design-history">
  <div class="breadcrumbs dont-print">
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
