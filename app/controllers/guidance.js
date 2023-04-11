const _ = require('lodash')
const guidanceModel = require('../models/guidance')

exports.guidance = (req, res) => {

  if (req.params.fileName) {
    const markdown = guidanceModel.findOne({
      fileName: req.params.fileName
    })

    res.render('../views/guidance/show', {
      contentData: markdown.data,
      content: markdown.content
    })
  } else {
    const links = guidanceModel.findMany({})

    // group guidance by section
    // group an array of objects by key
    const guidance = _.groupBy(links, 'section')

    // group an array of objects by key and remove key from object
    // const guidance = _.mapValues(_.groupBy(links, 'section'),
      // list => list.map(link => _.omit(link, 'section')))

    // sort links alphabetically by title
    // links.sort((a, b) => {
    //   return a.section.localeCompare(b.section) || a.title.localeCompare(b.title)
    // })

    res.render('../views/guidance/index', {
      guidance
    })
  }
}
