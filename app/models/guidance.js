const path = require('path')
const fs = require('fs')
const matter = require('gray-matter')

const directoryPath = path.join(__dirname, '../content/')

exports.findMany = (params) => {
  let documents = fs.readdirSync(directoryPath,'utf8')

  // Only get markdown documents
  documents = documents.filter(doc => doc.match(/.*\.(md)/ig))

  let files = []

  documents.forEach((filename, i) => {
    const doc = fs.readFileSync(directoryPath + '/' + filename)
    const content = matter(doc)
    const file = {}
    file.slug = filename.replace(/.(md)/,'')
    file.title = content.data.title
    file.section = content.data.section
    files.push(file)
  })

  // sort files alphabetically by title
  // files = files.sort((a, b) => {
  //   return a.title.localeCompare(b.title)
  // })

  return files
}

exports.findOne = (params) => {
  let doc = fs.readFileSync(directoryPath + params.fileName + '.md', 'utf8')
  const content = matter(doc)
  return content
}
