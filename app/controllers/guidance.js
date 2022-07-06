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

    res.render('../views/guidance/index', {
      links
    })
  }
}
